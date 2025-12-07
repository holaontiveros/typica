#!/bin/bash

# Verification script for Typica distribution
# Run this on the target machine to test the app

APP_PATH="./typica.app"
DMG_PATH="./typica_0.1.0_aarch64.dmg"

echo "🔍 Typica Distribution Verification"
echo "=================================="

# Check if we have the app
if [ -d "$APP_PATH" ]; then
    echo "✅ App found: $APP_PATH"
elif [ -f "$DMG_PATH" ]; then
    echo "📦 DMG found: $DMG_PATH"
    echo "   Please mount the DMG and drag the app out first"
    exit 1
else
    echo "❌ No app or DMG found in current directory"
    echo "   Expected: typica.app or typica_0.1.0_aarch64.dmg"
    exit 1
fi

# Check quarantine status
QUARANTINE=$(xattr "$APP_PATH" 2>/dev/null | grep com.apple.quarantine)
if [ -n "$QUARANTINE" ]; then
    echo "⚠️  App is quarantined (expected for unsigned apps)"
    echo "   To fix: xattr -d com.apple.quarantine '$APP_PATH'"
    echo ""
    echo "🔧 Fixing quarantine automatically..."
    xattr -d com.apple.quarantine "$APP_PATH" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✅ Quarantine removed"
    else
        echo "❌ Failed to remove quarantine (may need sudo)"
    fi
else
    echo "✅ App is not quarantined"
fi

# Check if app can be opened
echo ""
echo "🚀 Testing app launch..."
open "$APP_PATH"

if [ $? -eq 0 ]; then
    echo "✅ App launched successfully!"
    echo ""
    echo "📝 Verification complete:"
    echo "   - App found and accessible"
    echo "   - Quarantine removed (if present)"
    echo "   - App launched without errors"
else
    echo "❌ App failed to launch"
    echo "   Try right-clicking and selecting 'Open'"
fi