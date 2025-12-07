# App Distribution & Code Signing Guide

## The Problem
When you build a Tauri app on macOS without proper code signing, other macOS machines will show:
> "typica.app is damaged and can't be opened. You should move it to the trash."

This happens because macOS Gatekeeper blocks unsigned applications for security.

## Solutions (Choose One)

### 1. Quick Fix - For Testing/Personal Use

**For users receiving the app:**
```bash
# Right-click the app and select "Open" instead of double-clicking
# OR remove the quarantine attribute:
xattr -d com.apple.quarantine /path/to/typica.app
```

**For developers building the app:**
```bash
# Use the provided build script
npm run build:signed
```

### 2. Proper Code Signing - For Distribution

#### Prerequisites
1. **Apple Developer Account** ($99/year)
2. **Developer ID Certificate** from Apple Developer portal

#### Setup Steps

1. **Get your signing identity:**
```bash
# List available certificates
security find-identity -v -p codesigning

# Look for "Developer ID Application: Your Name (TEAM_ID)"
```

2. **Configure environment variables:**
```bash
# Add to your ~/.zshrc or ~/.bash_profile
export APPLE_CERTIFICATE="Developer ID Application: Your Name (TEAM_ID)"
export APPLE_CERTIFICATE_PASSWORD="your_certificate_password"
export APPLE_TEAM_ID="YOUR_TEAM_ID"
```

3. **Update tauri.conf.json:**
```json
{
  "bundle": {
    "macOS": {
      "minimumSystemVersion": "10.13"
    }
  }
}
```

4. **Build with signing:**
```bash
# Set environment variables for this build
export TAURI_SIGNING_PRIVATE_KEY_PATH="/path/to/your/certificate.p12"
export TAURI_SIGNING_PRIVATE_KEY_PASSWORD="certificate_password"

# Build
npm run tauri:build
```

### 3. Notarization - For App Store & Public Distribution

#### Additional Setup (requires proper code signing first)
```bash
# Set additional environment variables
export APPLE_ID="your@apple.id"
export APPLE_ID_PASSWORD="app_specific_password"
export APPLE_TEAM_ID="YOUR_TEAM_ID"

# Enable notarization in tauri.conf.json
```

Update `tauri.conf.json`:
```json
{
  "bundle": {
    "macOS": {
      "minimumSystemVersion": "10.13",
      "notarize": {
        "appleId": "$APPLE_ID",
        "password": "$APPLE_ID_PASSWORD",
        "teamId": "$APPLE_TEAM_ID"
      }
    }
  }
}
```

## Current Project Status

✅ **Ad-hoc signing configured** - Use `npm run build:signed`
✅ **DMG installer created** - Automatic with each build
⏳ **Proper code signing** - Requires Apple Developer account
⏳ **Notarization** - Requires Apple Developer account

## Quick Start

### Build for Distribution:
```bash
npm run build:signed
```

This creates:
- `src-tauri/target/release/bundle/macos/typica.app` - The application
- `src-tauri/target/release/bundle/dmg/typica_0.1.0_aarch64.dmg` - DMG installer

## Recommendations

### For Personal/Internal Use:
- Use the current ad-hoc signing setup
- Provide users with instructions to right-click and "Open"

### For Public Distribution:
- Get Apple Developer account
- Set up proper code signing certificates
- Enable notarization for seamless user experience

### For Testing with Friends/Beta Users:
- Create a DMG installer with instructions
- Include a README with the "right-click to open" instructions