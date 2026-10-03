#!/usr/bin/env bash
# Creates / updates the native Android and iOS projects from the web app in ./app.
# Usage: bash scripts/native-setup.sh [android|ios|all]      (BUILD_NUMBER=… optional)
set -euo pipefail
cd "$(dirname "$0")/.."
PLATFORM="${1:-all}"
VERSION_NAME="$(node -p "require('./package.json').version")"
BUILD_NUMBER="${BUILD_NUMBER:-1}"
CAM_TEXT="კამერა მხოლოდ სარკეა: ხედავ საკუთარ თავს ფანდურით, სანამ აპი აკორდებს და რიტმს გიჩვენებს. გამოსახულება არ იწერება და არსად იგზავნება. / The camera is only a mirror: you see yourself with the panduri while the app shows chords and rhythm. The picture is never recorded or sent."
MIC_TEXT="ფანდური უსმენს შენს დაკვრას, რომ გაიგოს რომელი ნოტი და როდის დაუკარი. ხმა მხოლოდ ტელეფონზე მუშავდება და არსად იგზავნება. / Panduri listens to your playing to hear which note you played and when. Sound is analysed on your phone and never sent anywhere."

if [[ "$PLATFORM" == "android" || "$PLATFORM" == "all" ]]; then
  [ -d android ] || npx cap add android
  MAN=android/app/src/main/AndroidManifest.xml
  # permissions: microphone (hears the panduri), camera (mirror while practising), vibration
  grep -q 'RECORD_AUDIO' "$MAN" || perl -0pi -e 's#</manifest>#    <uses-permission android:name="android.permission.RECORD_AUDIO" />\n    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />\n    <uses-permission android:name="android.permission.VIBRATE" />\n</manifest>#' "$MAN"
  grep -q 'android.permission.CAMERA' "$MAN" || perl -0pi -e 's#</manifest>#    <uses-permission android:name="android.permission.CAMERA" />\n</manifest>#' "$MAN"
  # phones, tablets and Android TV: nothing below is required hardware
  grep -q 'android.software.leanback' "$MAN" || perl -0pi -e 's#</manifest>#    <uses-feature android:name="android.hardware.camera" android:required="false" />\n    <uses-feature android:name="android.hardware.camera.front" android:required="false" />\n    <uses-feature android:name="android.hardware.microphone" android:required="false" />\n    <uses-feature android:name="android.hardware.touchscreen" android:required="false" />\n    <uses-feature android:name="android.software.leanback" android:required="false" />\n</manifest>#' "$MAN"
  # Android TV launcher row + banner
  mkdir -p android/app/src/main/res/drawable
  cp assets/tv-banner.png android/app/src/main/res/drawable/tv_banner.png
  grep -q 'android:banner' "$MAN" || perl -0pi -e 's#<application#<application android:banner="\@drawable/tv_banner"#' "$MAN"
  grep -q 'LEANBACK_LAUNCHER' "$MAN" || perl -0pi -e 's#(<category android:name="android.intent.category.LAUNCHER" />)#$1\n                <category android:name="android.intent.category.LEANBACK_LAUNCHER" />#' "$MAN"
  # sign-in return link (Google / Facebook): com.yanx.panduri://auth
  grep -q 'android:scheme="com.yanx.panduri"' "$MAN" || perl -0pi -e 's#(</intent-filter>)#$1\n            <intent-filter>\n                <action android:name="android.intent.action.VIEW" />\n                <category android:name="android.intent.category.DEFAULT" />\n                <category android:name="android.intent.category.BROWSABLE" />\n                <data android:scheme="com.yanx.panduri" android:host="auth" />\n            </intent-filter>#' "$MAN"
  perl -pi -e "s/versionCode \d+/versionCode $BUILD_NUMBER/; s/versionName \"[^\"]*\"/versionName \"$VERSION_NAME\"/" android/app/build.gradle
  npx @capacitor/assets generate --android \
    --iconBackgroundColor '#130C07' --iconBackgroundColorDark '#130C07' \
    --splashBackgroundColor '#130C07' --splashBackgroundColorDark '#130C07'
  npx cap sync android
fi

if [[ "$PLATFORM" == "ios" || "$PLATFORM" == "all" ]]; then
  [ -d ios ] || npx cap add ios
  PL=ios/App/App/Info.plist
  PB=/usr/libexec/PlistBuddy
  $PB -c "Set :NSMicrophoneUsageDescription $MIC_TEXT" "$PL" 2>/dev/null || $PB -c "Add :NSMicrophoneUsageDescription string $MIC_TEXT" "$PL"
  $PB -c "Set :NSCameraUsageDescription $CAM_TEXT" "$PL" 2>/dev/null || $PB -c "Add :NSCameraUsageDescription string $CAM_TEXT" "$PL"
  if ! $PB -c "Print :CFBundleURLTypes:0:CFBundleURLSchemes:0" "$PL" >/dev/null 2>&1; then
    $PB -c "Add :CFBundleURLTypes array" "$PL" 2>/dev/null || true
    $PB -c "Add :CFBundleURLTypes:0 dict" "$PL"
    $PB -c "Add :CFBundleURLTypes:0:CFBundleURLName string com.yanx.panduri" "$PL"
    $PB -c "Add :CFBundleURLTypes:0:CFBundleURLSchemes array" "$PL"
    $PB -c "Add :CFBundleURLTypes:0:CFBundleURLSchemes:0 string com.yanx.panduri" "$PL"
  fi
  $PB -c "Set :CFBundleDisplayName ფანდური" "$PL" 2>/dev/null || $PB -c "Add :CFBundleDisplayName string ფანდური" "$PL"
  $PB -c "Set :ITSAppUsesNonExemptEncryption false" "$PL" 2>/dev/null || $PB -c "Add :ITSAppUsesNonExemptEncryption bool false" "$PL"
  perl -pi -e "s/MARKETING_VERSION = [^;]+;/MARKETING_VERSION = $VERSION_NAME;/g; s/CURRENT_PROJECT_VERSION = [^;]+;/CURRENT_PROJECT_VERSION = $BUILD_NUMBER;/g" ios/App/App.xcodeproj/project.pbxproj
  npx @capacitor/assets generate --ios \
    --iconBackgroundColor '#130C07' --iconBackgroundColorDark '#130C07' \
    --splashBackgroundColor '#130C07' --splashBackgroundColorDark '#130C07'
  npx cap sync ios
fi
echo "native setup done ($PLATFORM, v$VERSION_NAME build $BUILD_NUMBER)"
