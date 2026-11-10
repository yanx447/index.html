#!/usr/bin/env node
/* Builds the app, then the installers, and puts them in საინსტალაციო/macos and საინსტალაციო/windows.
   Usage: node scripts/build-installers.js [--mac] [--win] [--skip-web]        (no flag = both)
   The Windows setup.exe needs NSIS: `makensis` on the PATH, or MAKENSIS=/path/to/makensis. */
'use strict';
const { execFileSync, spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const DESKTOP = path.join(__dirname, '..');
const SOURCE = path.join(DESKTOP, '..', 'source');
const OUT = process.env.PANDURI_OUT || path.join(DESKTOP, 'out');   // PANDURI_OUT: keep the heavy temporary files off a slow or unreliable disk
const INSTALLERS = path.join(DESKTOP, '..', '..', 'საინსტალაციო');
const ICON_PNG = path.join(DESKTOP, '..', 'assets', 'icon-only.png');
const ICON_ICO = path.join(DESKTOP, 'build', 'icon.ico');

const flags = new Set(process.argv.slice(2));
const both = !flags.has('--mac') && !flags.has('--win');
const wantMac = both || flags.has('--mac');
const wantWin = both || flags.has('--win');

const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: 'inherit' });

/** the version is the app's own (panduri/package.json); the desktop shell only follows it */
function syncVersion() {
  const version = require(path.join(DESKTOP, '..', 'package.json')).version;
  const file = path.join(DESKTOP, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (pkg.version !== version) { pkg.version = version; fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n'); }
  return version;
}

/** icon.ico from the app's 1024 px icon; the frames are PNG, which every supported Windows reads */
function makeIco() {
  const sizes = [16, 24, 32, 48, 64, 128, 256];
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'panduri-ico-'));
  const frames = sizes.map(s => {
    const f = path.join(tmp, `${s}.png`);
    execFileSync('sips', ['-z', String(s), String(s), '-s', 'format', 'png', ICON_PNG, '--out', f], { stdio: 'ignore' });
    return fs.readFileSync(f);
  });
  fs.rmSync(tmp, { recursive: true });
  const header = Buffer.alloc(6 + 16 * sizes.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  sizes.forEach((s, i) => {
    const at = 6 + 16 * i;
    header[at] = s === 256 ? 0 : s;
    header[at + 1] = s === 256 ? 0 : s;
    header.writeUInt16LE(1, at + 4);
    header.writeUInt16LE(32, at + 6);
    header.writeUInt32LE(frames[i].length, at + 8);
    header.writeUInt32LE(offset, at + 12);
    offset += frames[i].length;
  });
  fs.mkdirSync(path.dirname(ICON_ICO), { recursive: true });
  fs.writeFileSync(ICON_ICO, Buffer.concat([header, ...frames]));
}

function place(from, platform) {
  const dir = path.join(INSTALLERS, platform);
  fs.mkdirSync(dir, { recursive: true });
  const to = path.join(dir, path.basename(from));
  fs.copyFileSync(from, to);
  console.log(`→ ${path.relative(path.join(INSTALLERS, '..'), to)}  ${(fs.statSync(to).size / 1048576).toFixed(1)} MB`);
}

function findMakensis() {
  if (process.env.MAKENSIS) return process.env.MAKENSIS;
  const kept = path.join(os.homedir(), 'Library', 'Caches', 'panduri-installers', 'nsis', '3.13');
  if (fs.existsSync(path.join(kept, 'bin', 'makensis'))) { process.env.NSISDIR = path.join(kept, 'share', 'nsis'); return path.join(kept, 'bin', 'makensis'); }
  return spawnSync('which', ['makensis'], { encoding: 'utf8' }).stdout.trim() || null;
}

const version = syncVersion();
if (!flags.has('--skip-web')) run('python3', ['build.py'], SOURCE);
makeIco();
const builder = path.join(DESKTOP, 'node_modules', '.bin', 'electron-builder');

if (wantMac) {
  // with an Apple "Developer ID Application" certificate in the Keychain, the app is signed and notarized: no Gatekeeper warning.
  // notarization reads APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD and APPLE_TEAM_ID from the environment. Without it: ad-hoc, for testing.
  const identity = (process.env.APPLE_SIGNING_IDENTITY || '').replace(/^Developer ID Application: /, '');
  const signed = identity ? [`-c.mac.identity=${identity}`, '-c.mac.hardenedRuntime=true', '-c.mac.notarize=true', '-c.mac.entitlements=build/entitlements.mac.plist', '-c.mac.entitlementsInherit=build/entitlements.mac.plist'] : [];
  run(builder, ['--mac', 'dmg', '--arm64', '--x64', `-c.directories.output=${OUT}`, ...signed], DESKTOP);
  for (const arch of ['arm64', 'x64']) place(path.join(OUT, `Panduri-${version}-macOS-${arch}.dmg`), 'macos');
}

if (wantWin) {
  run(builder, ['--win', 'dir', '--x64', `-c.directories.output=${OUT}`], DESKTOP);
  const makensis = findMakensis();
  if (!makensis) {
    console.error('\nmakensis was not found: the Windows app is in out/win-unpacked, but setup.exe was NOT built.');
    process.exitCode = 2;
  } else {
    const setup = path.join(OUT, `Panduri-${version}-Windows-Setup.exe`);
    // WINDOWS_SIGN_COMMAND: the certificate provider's signing command, with %1 for the file (Panduri.exe is signed in after-pack.js)
    const sign = process.env.WINDOWS_SIGN_COMMAND ? [`-DSIGN_COMMAND=${process.env.WINDOWS_SIGN_COMMAND}`] : [];
    run(makensis, ['-V2', `-DVERSION=${version}`, `-DSOURCE_DIR=${path.join(OUT, 'win-unpacked')}`, `-DOUT_FILE=${setup}`, `-DICON_FILE=${ICON_ICO}`, `-DSIDEBAR_FILE=${path.join(DESKTOP, 'build', 'installer-sidebar.bmp')}`, ...sign, path.join(DESKTOP, 'installer', 'windows.nsi')], DESKTOP);
    place(setup, 'windows');
  }
}
