#!/usr/bin/env bash
# Builds a drop-in folder for studioplus.ge (or any static site):
#   /apps/                 → the apps page (studio style, ka/en)
#   /sami-simi/app/        → the full Sami Simi web app (iPhone/iPad: "Add to Home Screen" from the studio domain)
#   _redirects             → short download links on the studio domain (Cloudflare Pages / Netlify)
# Usage: bash apps/build-studio-pack.sh <out-dir>
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${1:?out dir}"; rm -rf "$OUT"; mkdir -p "$OUT/apps" "$OUT/sami-simi"
GH="https://yanx447.github.io/index.html"
REL="https://github.com/yanx447/index.html/releases/download"

cp -r "$ROOT/sami-simi/app" "$OUT/sami-simi/app"
cp "$ROOT/panduri/app/icons/icon-192.png" "$OUT/apps/panduri-192.png"

python3 - "$ROOT/apps/index.html" "$OUT/apps/index.html" "$GH" <<'PY'
import sys
src, dst, gh = sys.argv[1:4]
s = open(src, encoding='utf-8').read()
rep = {
  '"../panduri/app/icons/icon-192.png"': '"panduri-192.png"',
  'href="../panduri/app/"': f'href="{gh}/panduri/app/"',            # Panduri signs in via its own domain
  'href="../sami-simi/"': f'href="{gh}/sami-simi/"',
  'href="../sami-simi/privacy.html"': f'href="{gh}/sami-simi/privacy.html"',
  'href="../sami-simi/support.html"': f'href="{gh}/sami-simi/support.html"',
  '<link rel="canonical"': '<link rel="alternate"',
}
for a, b in rep.items(): s = s.replace(a, b)
# fonts, icons, QR library and the web app are part of this package: absolute from the site root,
# so the page works both as /apps and /apps/
s = s.replace('../sami-simi/app/', '/sami-simi/app/')
s = s.replace('href="https://studioplus.ge"', 'href="/"')
open(dst, 'w', encoding='utf-8').write(s)
PY

cat > "$OUT/_redirects" <<R
# short links on the studio domain — always the newest build
/apps/SamiSimi.apk  $REL/android-latest/SamiSimi.apk  302
/apps/Panduri.apk   $REL/panduri-android-latest/Panduri.apk  302
R

cat > "$OUT/README.txt" <<'T'
სტუდიო+ — აპლიკაციები studioplus.ge-ზე
=====================================
ატვირთე ამ საქაღალდის შიგთავსი საიტის მთავარ საქაღალდეში (იქ, სადაც index.html დევს):
  apps/        → studioplus.ge/apps           (აპლიკაციების გვერდი)
  sami-simi/   → studioplus.ge/sami-simi/app  (ტიუნერი iPhone-ისთვის და ბრაუზერისთვის)
  _redirects   → თუ საიტს უკვე აქვს _redirects ფაილი, ეს ხაზები მის ბოლოში ჩაამატე.
მენიუში დაამატე ბმული „აპლიკაციები“ / „Apps“ → /apps
Android ღილაკი ყოველთვის უახლეს APK-ს ჩამოტვირთავს — საიტის განახლება არ სჭირდება.
ტიუნერის ახალ ვერსიაზე (iPhone/ბრაუზერი) გადასასვლელად sami-simi საქაღალდე ახლით შეცვალე.
T
echo "built $OUT ($(du -sh "$OUT" | cut -f1))"
