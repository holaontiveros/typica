#!/bin/bash

# Build script for signed Tauri app
# This script handles code signing for macOS distribution

echo "🚀 Building Typica with code signing..."

# Set environment variables for ad-hoc signing (development/testing)
export TAURI_SIGNING_PRIVATE_KEY=""
export TAURI_SIGNING_PRIVATE_KEY_PASSWORD=""

# For ad-hoc signing (no developer certificate)
export TAURI_SKIP_CODESIGN=""

# Build the app
npm run tauri:build

echo "✅ Build complete!"
echo ""
echo "📦 Your app bundle is located at:"
echo "   src-tauri/target/release/bundle/macos/typica.app"
echo ""
echo "⚠️  Note: This is an ad-hoc signed build for testing only."
echo "   For distribution, you'll need proper   ."
echo ""
echo "🔧 To allow users to run this app:"
echo "   1. Right-click the app and select 'Open'"
echo "   2. Or use: xattr -d com.apple.quarantine /path/to/typica.app"