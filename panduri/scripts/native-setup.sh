#!/usr/bin/env bash
# Creates / updates the native Android and iOS projects from the web app in ./app.
# Usage: bash scripts/native-setup.sh [android|ios|all]      (BUILD_NUMBER=… optional)
set -euo pipefail
cd "$(dirname "$0")/.."
PLATFORM="${1:-all}"
VERSION_NAME="$(node -p "require('./package.json').version")"
BUILD_NUMBER="${BUILD_NUMBER:-1}"
MIC_TEXT="ფანდური უსმენს შენს დაკვრას, რომ გაიგოს რომელი ნოტი და როდის დაუკარი. ხმა მხოლოდ ტელეფონზე მუშავდება და არსად იგზავნება. / Panduri listens to your playing to hear which note you played and when. Sound is analysed on your phone and never sent anywhere."

if [[ "$PLATFORM" == "android" || "$PLATFORM" == "all" ]]; then
  [ -d android ] || npx cap add android
  MAN=android/app/src/main/AndroidManifest.xml
  grep -q 'RECORD_AUDIO' "$MAN" || perl -0pi -e 's#</manifest>#    <uses-permission android:name="android.permission.RECORD_AUDIO" />\n    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />\n    <uses-permission android:name="android.permission.VIBRATE" />\n</manifest>#' "$MAN"
  perl -pi -e "s/versionCode \d+/versionCode $BUILD_NUMBER/; s/versionName \"[^\"]*\"/versionName \"$VERSION_NAME\"/" android/app/build.gradle
  npx @capacitor/assets generate --android \
    --iconBackgroundColor '#0B0C10' --iconBackgroundColorDark '#0B0C10' \
    --splashBackgroundColor '#0B0C10' --splashBackgroundColorDark '#0B0C10'
  npx cap sync android
fi

if [[ "$PLATFORM" == "ios" || "$PLATFORM" == "all" ]]; then
  [ -d ios ] || npx cap add ios
  PL=ios/App/App/Info.plist
  PB=/usr/libexec/PlistBuddy
  $PB -c "Set :NSMicrophoneUsageDescription $MIC_TEXT" "$PL" 2>/dev/null || $PB -c "Add :NSMicrophoneUsageDescription string $MIC_TEXT" "$PL"
  $PB -c "Set :CFBundleDisplayName ფანდური" "$PL" 2>/dev/null || $PB -c "Add :CFBundleDisplayName string ფანდური" "$PL"
  $PB -c "Set :ITSAppUsesNonExemptEncryption false" "$PL" 2>/dev/null || $PB -c "Add :ITSAppUsesNonExemptEncryption bool false" "$PL"
  perl -pi -e "s/MARKETING_VERSION = [^;]+;/MARKETING_VERSION = $VERSION_NAME;/g; s/CURRENT_PROJECT_VERSION = [^;]+;/CURRENT_PROJECT_VERSION = $BUILD_NUMBER;/g" ios/App/App.xcodeproj/project.pbxproj
  npx @capacitor/assets generate --ios \
    --iconBackgroundColor '#0B0C10' --iconBackgroundColorDark '#0B0C10' \
    --splashBackgroundColor '#0B0C10' --splashBackgroundColorDark '#0B0C10'
  npx cap sync ios
fi
echo "native setup done ($PLATFORM, v$VERSION_NAME build $BUILD_NUMBER)"
