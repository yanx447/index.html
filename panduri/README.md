# ფანდური — Panduri Learning

Learn the Georgian three-string panduri on your **real instrument**: the app shows what to play, waits, and listens through the microphone.

* Web / installable PWA: `app/` (served by GitHub Pages at `/panduri/app/`).
* Android app: built automatically by `.github/workflows/panduri-android.yml` on every push to `panduri/**`.
  The APK is published as the GitHub Release **`panduri-android-latest`** — open it on the phone and install.
* iOS app: `bash scripts/native-setup.sh ios` on a Mac (or Codemagic, like Sami Simi) — needs an Apple Developer account to install on a phone.

`app/` is the build output of the Panduri Learning source (`build.py`); edit the source, rebuild, and copy `dist/app` here.
