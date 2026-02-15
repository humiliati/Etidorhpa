# Etidorhpa

> Formerly known as Septerra

A Phaser-based browser MMO with advanced Spine animation support, object pooling, and device-adaptive graphics settings.

## Project Rename Notice

**Important**: This project has been renamed from "Septerra" to "Etidorhpa" due to trademark considerations.

### Migration Notes

- **localStorage Key**: User preferences automatically migrate from `septerra_low_graphics` to `etidorhpa_low_graphics` on first run.
- **CSS Variables**: Both `--etidorhpa-low-graphics` and `--septerra-low-graphics` are set for backwards compatibility. The legacy variable will be removed in a future release.
- **Package Name**: The client package name has changed to `etidorhpa-client`.
- **Asset Paths**: Updated from `assets/septerra/` to `assets/etidorhpa/`

## Features

### Spine Asset Pipeline

The game includes a comprehensive Spine skeletal animation pipeline with:

- **Manifest-based asset loading**: Organize Spine assets in `src/client/assets/manifest.spine.json`
- **Automatic format selection**: Supports both JSON and binary skeleton formats
- **Texture variants**: Multiple resolutions (1x, 2x) and formats (WebP, PNG)
- **Object pooling**: Efficient skeleton instance reuse for better performance
- **Low-graphics mode**: Performance optimization for low-end devices

See [docs/asset_pipeline.md](docs/asset_pipeline.md) for detailed documentation.

### Device Quality Detection

Automatic device capability detection using:
- Device memory (`navigator.deviceMemory`)
- CPU cores (`navigator.hardwareConcurrency`)
- User agent detection for mobile devices

The system automatically selects appropriate graphics settings based on detected capability.

### Low-Graphics Mode

Users can manually toggle low-graphics mode through the HUD (top-right corner). This setting:
- Persists across sessions in localStorage as `etidorhpa_low_graphics`
- Reduces skeleton scale and disables expensive visual features
- Uses 1x texture variants (lower resolution)
- Disables mesh deformations
- Reduces update frequency to 30 FPS
- Scales skeletons to 75%
- Can override automatic device detection

### Object Pooling

Generic pooling system with Spine-specific adapter:

- **Pool Utility**: `src/client/utils/Pool.js`
- **Spine Pool**: `src/client/assets/spinePool.js`
- **Benefits**: Reduced GC overhead, faster spawn/despawn, consistent performance

## Getting Started

### Prerequisites

- Modern web browser with ES module support
- Node.js 16.0.0 or higher (for verification scripts)

### Running the Game

1. Serve the project directory with a local web server:
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js http-server
   npx http-server -p 8000
   ```

2. Open `http://localhost:8000` in your browser

### Verification

Run syntax checks on bootstrap files:

```bash
# From client directory
cd client
npm run verify:nodecheck

# Or use the smoke check script from project root
./scripts/smoke-check.sh
```

## Project Structure

```
Etidorhpa/
├── src/
│   ├── main.js                          # Entry point
│   ├── scenes/
│   │   ├── BootScene.js                 # Asset loading scene
│   │   ├── WorldScene.js                # Main game scene
│   │   └── Start.js                     # Demo scene
│   └── client/
│       ├── assets/
│       │   ├── spineLoader.js           # Spine asset loader
│       │   ├── spinePool.js             # Spine pooling system
│       │   └── manifest.spine.json      # Asset manifest
│       ├── utils/
│       │   ├── Pool.js                  # Generic pooling utility
│       │   └── deviceQuality.js         # Device detection
│       ├── ui/
│       │   └── createUiShell.js         # UI shell with HUD
│       ├── layout/
│       │   └── ViewportLayoutManager.js # Layout & CSS vars
│       └── input/
│           └── InputModeStateMachine.js # Input handling
├── scripts/
│   └── smoke-check.sh                   # Syntax verification
├── docs/
│   └── asset_pipeline.md                # Asset pipeline docs
├── assets/                              # Game assets
├── index.html                           # Entry HTML
├── package.json                         # Package config
└── README.md                            # This file
```

## Scene Flow

1. **BootScene**: Loads essential assets (Spine skeletons, textures)
2. **WorldScene**: Main game world
3. **Start**: Original demo scene (spaceship animation)

## Development

### Modules

The project uses ES modules (`type: "module"` in package.json):
- All files use `import`/`export` syntax
- No bundler required for development
- Compatible with modern browsers

### Adding New Spine Assets

1. Export Spine skeleton (JSON + atlas + textures)
2. Add entry to `src/client/assets/manifest.spine.json`
3. Load in `BootScene.js` using `loadSkeletons()`
4. Use pooling in scenes via `spinePoolManager`

See [docs/asset_pipeline.md](docs/asset_pipeline.md) for detailed export instructions.

### Spine Manifest Structure

```json
{
  "skeletons": {
    "character-pro": {
      "json": "assets/etidorhpa/character-pro.json",
      "atlas": "assets/etidorhpa/character-pro.atlas",
      "textures": {
        "1x": "assets/etidorhpa/1x/character-pro.webp",
        "2x": "assets/etidorhpa/2x/character-pro.webp",
        "fallback": "assets/etidorhpa/1x/character-pro.png"
      }
    }
  }
}
```

### CSS Variables

The system publishes CSS variables for use in styling:

- `--etidorhpa-low-graphics`: `'1'` or `'0'`
- `--septerra-low-graphics`: Legacy compatibility (will be removed in future release)
- `--etidorhpa-particle-multiplier`: `0.3` to `1.0`
- `--etidorhpa-texture-scale`: `1` or `2`
- `--etidorhpa-device-quality`: `'high'`, `'medium'`, or `'low'`

### Code Style

- Use ES modules (import/export)
- Include JSDoc comments for public functions
- Add TODO comments where manual verification is needed
- Follow existing code style and structure

## Testing Changes

After making code changes:

1. Run verification: `npm run verify:nodecheck` or `./scripts/smoke-check.sh`
2. Test in browser
3. Test low-graphics toggle functionality
4. Verify localStorage migration (clear storage and reload)

## License

ISC

## Credits

- Phaser 3.88.2 game framework
- Spaceship sprite by [ansimuz](https://ansimuz.itch.io) (CC0)
- Spine animation runtime for skeletal animations
