#!/usr/bin/env bash
# Builds a drop-in folder for studioplus.ge (or any static site):
#   /apps/                 → the apps page (studio style, ka/en)
#   _redirects             → short download links on the studio domain (Cloudflare Pages / Netlify)
# Usage: bash apps/build-studio-pack.sh <out-dir>
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${1:?out dir}"; rm -rf "$OUT"; mkdir -p "$OUT/apps"
GH="https://yanx447.github.io/index.html"
REL="https://github.com/yanx447/index.html/releases/download"

cp "$ROOT/panduri/app/icons/icon-192.png" "$OUT/apps/panduri-192.png"

python3 - "$ROOT/apps/index.html" "$OUT/apps/index.html" "$GH" <<'PY'
import sys
src, dst, gh = sys.argv[1:4]
s = open(src, encoding='utf-8').read()
rep = {
  '"../panduri/app/icons/icon-192.png"': '"panduri-192.png"',
  'href="../panduri/app/"': f'href="{gh}/panduri/app/"',            # Panduri signs in via its own domain
  'href="../panduri/tuner/privacy.html"': f'href="{gh}/panduri/tuner/privacy.html"',
  'href="../panduri/tuner/support.html"': f'href="{gh}/panduri/tuner/support.html"',
  '<link rel="canonical"': '<link rel="alternate"',
}
for a, b in rep.items(): s = s.replace(a, b)
# fonts and the QR library come from the Panduri app (its built-in tuner)
s = s.replace('../panduri/app/tuner/', gh + '/panduri/app/tuner/')
s = s.replace('href="https://studioplus.ge"', 'href="/"')
# the studio's own logo (public/brand of the studio project) instead of the placeholder mark
import re
s = re.sub(r'<a class="brand".*?</a>', '<a class="brand" href="/" aria-label="Studio Plus+"><img src="/brand/studioplus-logo-horizontal-for-dark-bg.svg" alt="Studio Plus+" width="853" height="272" style="height:44px;width:auto;display:block"></a>', s, count=1, flags=re.S)
# on the studio domain the way back follows the chosen language: / (ka) or /en
s = s.replace("  document.title = l === 'ka'", "  document.querySelectorAll('a[href=\"/\"], a[href=\"/en\"]').forEach((a) => { a.href = l === 'en' ? '/en' : '/'; });\n  document.title = l === 'ka'")
open(dst, 'w', encoding='utf-8').write(s)
PY

cat > "$OUT/_redirects" <<R
# short links on the studio domain — always the newest build
/apps/Panduri.apk   $REL/panduri-android-latest/Panduri.apk  302
R

cat > "$OUT/README.txt" <<'T'
სტუდიო+ — აპლიკაციები studioplus.ge-ზე
=====================================
ატვირთე ამ საქაღალდის შიგთავსი საიტის მთავარ საქაღალდეში (იქ, სადაც index.html დევს):
  apps/        → studioplus.ge/apps           (აპლიკაციების გვერდი)
  _redirects   → თუ საიტს უკვე აქვს _redirects ფაილი, ეს ხაზები მის ბოლოში ჩაამატე.
მენიუში დაამატე ბმული „აპლიკაციები“ / „Apps“ → /apps
Android ღილაკი ყოველთვის უახლეს APK-ს ჩამოტვირთავს — საიტის განახლება არ სჭირდება.
ტიუნერი „სამი სიმი“ ახლა ფანდურის აპის ნაწილია.
T
echo "built $OUT ($(du -sh "$OUT" | cut -f1))"
