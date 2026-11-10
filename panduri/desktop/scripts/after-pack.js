/* Windows only: writes the icon and the developer into Panduri.exe (Properties → Details).
   electron-builder does this through Wine; this does it in plain JavaScript, so it runs on any Mac. */
'use strict';
const fs = require('fs');
const path = require('path');

exports.default = async function afterPack(context) {
  if (context.electronPlatformName !== 'win32') return;
  const { NtExecutable, NtExecutableResource, Resource, Data } = await import('resedit');
  const { appInfo, info } = context.packager;
  const file = path.join(context.appOutDir, 'Panduri.exe');
  const exe = NtExecutable.from(fs.readFileSync(file), { ignoreCert: true });
  const res = NtExecutableResource.from(exe);

  const icon = Data.IconFile.from(fs.readFileSync(path.join(info.projectDir, 'build', 'icon.ico')));
  const group = Resource.IconGroupEntry.fromEntries(res.entries)[0];
  Resource.IconGroupEntry.replaceIconsForResource(res.entries, group.id, group.lang, icon.icons.map(i => i.data));

  const version = Resource.VersionInfo.fromEntries(res.entries)[0];
  const [major, minor, patch] = appInfo.version.split('.').map(Number);
  const lang = version.getAllLanguagesForStringValues()[0];
  version.setFileVersion(major, minor, patch, 0, lang.lang);
  version.setProductVersion(major, minor, patch, 0, lang.lang);
  version.setStringValues(lang, {
    ProductName: appInfo.productName,
    FileDescription: 'ფანდური — Panduri Learning',
    CompanyName: info.metadata.author.name,
    LegalCopyright: appInfo.copyright,
    OriginalFilename: 'Panduri.exe',
    InternalName: 'Panduri',
    FileVersion: appInfo.version,
    ProductVersion: appInfo.version
  });
  version.outputToResourceEntries(res.entries);

  res.outputResource(exe);
  fs.writeFileSync(file, Buffer.from(exe.generate()));
  if (process.env.WINDOWS_SIGN_COMMAND) require('child_process').execSync(process.env.WINDOWS_SIGN_COMMAND.replace('%1', `"${file}"`), { stdio: 'inherit' });
};
