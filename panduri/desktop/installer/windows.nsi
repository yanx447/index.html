; ფანდური — the Windows installer. Built by scripts/build-installers.js, which passes
; VERSION, SOURCE_DIR, OUT_FILE and ICON_FILE with /D.
; It installs for the current user, without asking for an administrator.
Unicode true
SetCompressor /SOLID lzma

!include "MUI2.nsh"
!include "FileFunc.nsh"
!include "LogicLib.nsh"
!include "WinVer.nsh"
!include "x64.nsh"

!define APP_NAME "ფანდური"
!define APP_EXE "Panduri.exe"
!define DEVELOPER "ნუკრი ბერიძე (Nukri Beridze)"
!define COPYRIGHT "© 2026 ${DEVELOPER}"
!define UNINSTALL_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\com.yanx.panduri"
!define LINK_KEY "Software\Classes\com.yanx.panduri"

Name "${APP_NAME}"
OutFile "${OUT_FILE}"
; a fixed folder of our own: the uninstaller removes it whole, so it must never be one the learner chose
InstallDir "$LOCALAPPDATA\Programs\Panduri"
RequestExecutionLevel user
ManifestDPIAware true
BrandingText "${DEVELOPER}"

VIProductVersion "${VERSION}.0"
VIFileVersion "${VERSION}.0"
VIAddVersionKey /LANG=1033 "ProductName" "${APP_NAME}"
VIAddVersionKey /LANG=1033 "ProductVersion" "${VERSION}"
VIAddVersionKey /LANG=1033 "FileVersion" "${VERSION}"
VIAddVersionKey /LANG=1033 "FileDescription" "${APP_NAME} — Setup"
VIAddVersionKey /LANG=1033 "CompanyName" "${DEVELOPER}"
VIAddVersionKey /LANG=1033 "LegalCopyright" "${COPYRIGHT}"

!define MUI_ICON "${ICON_FILE}"
!define MUI_UNICON "${ICON_FILE}"
!define MUI_ABORTWARNING
!define MUI_WELCOMEPAGE_TITLE "${APP_NAME}"
!define MUI_WELCOMEPAGE_TEXT "ფანდურის სასწავლო აპლიკაცია · Panduri Learning$\r$\n$\r$\nვერსია · Version ${VERSION}$\r$\n$\r$\nდეველოპერი · Developer:$\r$\n${DEVELOPER}"
!define MUI_FINISHPAGE_RUN "$INSTDIR\${APP_EXE}"
!define MUI_WELCOMEFINISHPAGE_BITMAP "${SIDEBAR_FILE}"
!define MUI_UNWELCOMEFINISHPAGE_BITMAP "${SIDEBAR_FILE}"

; every executable the learner runs carries the same signature, the uninstaller included
!ifdef SIGN_COMMAND
  !finalize '${SIGN_COMMAND}' = 0
  !uninstfinalize '${SIGN_COMMAND}' = 0
!endif

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_LANGUAGE "Georgian"
!insertmacro MUI_LANGUAGE "English"

Function .onInit
  ${IfNot} ${RunningX64}
  ${OrIfNot} ${AtLeastWin10}
    MessageBox MB_ICONSTOP "ფანდურს სჭირდება Windows 10 ან უფრო ახალი, 64-ბიტიანი.$\r$\nPanduri needs 64-bit Windows 10 or newer."
    Abort
  ${EndIf}
FunctionEnd

Section
  nsExec::Exec 'taskkill /F /T /IM ${APP_EXE}'
  Pop $0
  RMDir /r "$INSTDIR"
  SetOutPath "$INSTDIR"
  File /r "${SOURCE_DIR}/*"
  WriteUninstaller "$INSTDIR\Uninstall.exe"

  CreateShortcut "$SMPROGRAMS\${APP_NAME}.lnk" "$INSTDIR\${APP_EXE}"
  CreateShortcut "$DESKTOP\${APP_NAME}.lnk" "$INSTDIR\${APP_EXE}"

  WriteRegStr HKCU "${UNINSTALL_KEY}" "DisplayName" "${APP_NAME} — Panduri Learning"
  WriteRegStr HKCU "${UNINSTALL_KEY}" "DisplayVersion" "${VERSION}"
  WriteRegStr HKCU "${UNINSTALL_KEY}" "Publisher" "${DEVELOPER}"
  WriteRegStr HKCU "${UNINSTALL_KEY}" "DisplayIcon" "$INSTDIR\${APP_EXE},0"
  WriteRegStr HKCU "${UNINSTALL_KEY}" "InstallLocation" "$INSTDIR"
  WriteRegStr HKCU "${UNINSTALL_KEY}" "UninstallString" '"$INSTDIR\Uninstall.exe"'
  WriteRegDWORD HKCU "${UNINSTALL_KEY}" "NoModify" 1
  WriteRegDWORD HKCU "${UNINSTALL_KEY}" "NoRepair" 1
  ${GetSize} "$INSTDIR" "/S=0K" $0 $1 $2
  IntFmt $0 "0x%08X" $0
  WriteRegDWORD HKCU "${UNINSTALL_KEY}" "EstimatedSize" "$0"

  ; the return link from Google / Facebook sign-in
  WriteRegStr HKCU "${LINK_KEY}" "" "URL:Panduri sign-in"
  WriteRegStr HKCU "${LINK_KEY}" "URL Protocol" ""
  WriteRegStr HKCU "${LINK_KEY}\DefaultIcon" "" "$INSTDIR\${APP_EXE},0"
  WriteRegStr HKCU "${LINK_KEY}\shell\open\command" "" '"$INSTDIR\${APP_EXE}" "%1"'
SectionEnd

; the learner's progress in %APPDATA%\Panduri stays: reinstalling must not lose it
Section "Uninstall"
  nsExec::Exec 'taskkill /F /T /IM ${APP_EXE}'
  Pop $0
  Delete "$SMPROGRAMS\${APP_NAME}.lnk"
  Delete "$DESKTOP\${APP_NAME}.lnk"
  RMDir /r "$INSTDIR"
  DeleteRegKey HKCU "${UNINSTALL_KEY}"
  DeleteRegKey HKCU "${LINK_KEY}"
SectionEnd
