# Typica Font Explorer

A beautiful font exploration and comparison tool built as a native desktop application using Tauri. Typica helps you discover, compare, and analyze system fonts with an intuitive interface.

## Features

✨ **Font Discovery**
- Automatic system font detection
- Font classification (serif, sans-serif, monospace, cursive, fantasy)
- Font weight detection (thin, light, regular, medium, bold, etc.)
- Real-time font filtering and search

🔍 **Font Comparison**
- Side-by-side comparison of multiple fonts
- Multiple preview sizes (16px, 24px, 32px, 48px)
- Character set comparison (uppercase, lowercase, numbers, symbols)
- Custom text input for real-world testing

🎨 **Customization**
- Dark/light theme support
- Customizable text color and background
- Responsive design for different screen sizes

🖥️ **Native Desktop Experience**
- Fast native performance using Rust + React
- Cross-platform support (macOS, Windows, Linux)
- No internet connection required

## Quick Start

```bash
# Install dependencies
npm install

# Run desktop app in development
npm run desktop

# Build desktop app for distribution
npm run build:signed
```

## Distribution

### For macOS Users
The desktop app creates a DMG installer that can be shared with others. After building:

1. **Developer**: Share the DMG file at `src-tauri/target/release/bundle/dmg/`
2. **Users**: Open the DMG and drag the app to Applications
3. **First Run**: Right-click the app and select "Open" (required for unsigned apps)

For more details, see [DISTRIBUTION.md](./DISTRIBUTION.md)

## Architecture

- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Rust + font-kit (via Tauri)
- **Styling**: Tailwind CSS v4 with dark mode
- **Icons**: Lucide React

## Development

```bash
# Install dependencies
npm install

# Development mode
npm run desktop     # Desktop app with hot reload

# Building
npm run build:signed # Desktop app with DMG
npm run build       # Frontend build only
npm run tauri:build # Desktop app only

# Linting
npm run lint
```

## Project Structure

```
typica/
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── utils/             # Utilities & API abstraction
│   └── App.jsx            # Main app component
├── src-tauri/             # Desktop app (Tauri)
│   ├── src/lib.rs         # Rust backend
│   └── tauri.conf.json    # App configuration
└── dist/                  # Built frontend
```
