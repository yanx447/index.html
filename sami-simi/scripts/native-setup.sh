#!/usr/bin/env bash
# Creates / updates the native iOS and Android projects from the web app in ./app.
# Usage: bash scripts/native-setup.sh [android|ios|all]      (BUILD_NUMBER=… optional)
# Safe to run repeatedly. Requires: npm install already done.
set -euo pipefail
cd "$(dirname "$0")/.."

PLATFORM="${1:-all}"
VERSION_NAME="$(node -p "require('./package.json').version")"
BUILD_NUMBER="${BUILD_NUMBER:-1}"
MIC_TEXT="Sami Simi listens to your panduri to measure its pitch and recognise chords. Sound is analysed on your device and is never sent anywhere. It is recorded only when you choose to make a recording, which stays on your device."

if [[ "$PLATFORM" == "android" || "$PLATFORM" == "all" ]]; then
  [ -d android ] || npx cap add android
  MAN=android/app/src/main/AndroidManifest.xml
  grep -q 'RECORD_AUDIO' "$MAN" || perl -0pi -e 's#</manifest>#    <uses-permission android:name="android.permission.RECORD_AUDIO" />\n    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />\n</manifest>#' "$MAN"
  grep -q 'screenOrientation' "$MAN" || perl -0pi -e 's#<activity#<activity android:screenOrientation="portrait"#' "$MAN"
  perl -pi -e "s/versionCode \d+/versionCode $BUILD_NUMBER/; s/versionName \"[^\"]*\"/versionName \"$VERSION_NAME\"/" android/app/build.gradle
  npx @capacitor/assets generate --android \
    --iconBackgroundColor '#120d0a' --iconBackgroundColorDark '#120d0a' \
    --splashBackgroundColor '#120d0a' --splashBackgroundColorDark '#120d0a'
  npx cap sync android
fi

if [[ "$PLATFORM" == "ios" || "$PLATFORM" == "all" ]]; then
  [ -d ios ] || npx cap add ios
  PL=ios/App/App/Info.plist
  PB=/usr/libexec/PlistBuddy
  $PB -c "Set :NSMicrophoneUsageDescription $MIC_TEXT" "$PL" 2>/dev/null || $PB -c "Add :NSMicrophoneUsageDescription string $MIC_TEXT" "$PL"
  $PB -c "Set :CFBundleDisplayName Sami Simi" "$PL" 2>/dev/null || $PB -c "Add :CFBundleDisplayName string Sami Simi" "$PL"
  $PB -c "Delete :UISupportedInterfaceOrientations" "$PL" 2>/dev/null || true
  $PB -c "Add :UISupportedInterfaceOrientations array" -c "Add :UISupportedInterfaceOrientations:0 string UIInterfaceOrientationPortrait" "$PL"
  $PB -c "Delete :UISupportedInterfaceOrientations~ipad" "$PL" 2>/dev/null || true
  $PB -c "Add :UISupportedInterfaceOrientations~ipad array" -c "Add :UISupportedInterfaceOrientations~ipad:0 string UIInterfaceOrientationPortrait" -c "Add :UISupportedInterfaceOrientations~ipad:1 string UIInterfaceOrientationPortraitUpsideDown" "$PL"
  $PB -c "Set :ITSAppUsesNonExemptEncryption false" "$PL" 2>/dev/null || $PB -c "Add :ITSAppUsesNonExemptEncryption bool false" "$PL"
  $PB -c "Set :UIRequiresFullScreen true" "$PL" 2>/dev/null || $PB -c "Add :UIRequiresFullScreen bool true" "$PL"
  perl -pi -e "s/MARKETING_VERSION = [^;]+;/MARKETING_VERSION = $VERSION_NAME;/g; s/CURRENT_PROJECT_VERSION = [^;]+;/CURRENT_PROJECT_VERSION = $BUILD_NUMBER;/g" ios/App/App.xcodeproj/project.pbxproj
  npx @capacitor/assets generate --ios \
    --iconBackgroundColor '#120d0a' --iconBackgroundColorDark '#120d0a' \
    --splashBackgroundColor '#120d0a' --splashBackgroundColorDark '#120d0a'
  npx cap sync ios
fi
echo "native setup done ($PLATFORM, v$VERSION_NAME build $BUILD_NUMBER)"
