#!/usr/bin/env bash
# Builds the signed Android App Bundle (phones, tablets and Android TV) that is uploaded to Google Play.
# Run after scripts/native-setup.sh android. Usage: bash scripts/build-android-bundle.sh [output-folder]
# The upload key is made once and kept outside the repository: back up that folder, a lost key must be reset with Google.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT="${1:-android/app/build/outputs/bundle/release}"
TOOLS="${PANDURI_ANDROID_TOOLS:-$HOME/Library/Caches/panduri-installers/android}"
export JAVA_HOME="${JAVA_HOME:-$TOOLS/jdk/Contents/Home}"
export ANDROID_HOME="${ANDROID_HOME:-$TOOLS/sdk}"
KEYS="${PANDURI_KEY_DIR:-$HOME/Library/Application Support/panduri-signing}"
STORE="$KEYS/panduri-upload.jks"
PROPS="$KEYS/key.properties"
VERSION="$(node -p "require('./package.json').version")"

if [ ! -f "$STORE" ]; then
  mkdir -p "$KEYS"; chmod 700 "$KEYS"
  PASS="$(openssl rand -hex 24)"
  ( umask 077; printf 'storePassword=%s\nkeyPassword=%s\nkeyAlias=upload\n' "$PASS" "$PASS" > "$PROPS" )
  "$JAVA_HOME/bin/keytool" -genkeypair -v -keystore "$STORE" -alias upload -keyalg RSA -keysize 2048 -validity 10000 \
    -storepass "$PASS" -keypass "$PASS" -dname "CN=Nukri Beridze, O=Panduri, C=GE" >/dev/null 2>&1
  chmod 600 "$STORE"
fi
get() { sed -n "s/^$1=//p" "$PROPS"; }

cd android
chmod +x gradlew
./gradlew bundleRelease --no-daemon --console=plain \
  -Pandroid.injected.signing.store.file="$STORE" -Pandroid.injected.signing.store.password="$(get storePassword)" \
  -Pandroid.injected.signing.key.alias="$(get keyAlias)" -Pandroid.injected.signing.key.password="$(get keyPassword)"
cd ..
mkdir -p "$OUT"
cp android/app/build/outputs/bundle/release/app-release.aab "$OUT/Panduri-$VERSION-GooglePlay.aab"
echo "bundle: $OUT/Panduri-$VERSION-GooglePlay.aab"
