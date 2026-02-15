# Asset Pipeline Documentation

## Spine Asset Workflow

This document describes how to export, package, and load Spine animations in the Etidorhpa project.

## Manifest Format

Spine assets are defined in `src/client/assets/manifest.spine.json`. The manifest follows this structure:
# Spine Asset Pipeline

This document describes the Spine asset workflow for Etidorhpa, including manifest format, export settings, and low-graphics mode behavior.

## Overview

The Etidorhpa asset pipeline uses a JSON manifest to define Spine skeletons, atlases, and texture variants. The system supports:

- Multiple texture scales (1x, 2x) for different device resolutions
- WebP and PNG fallback formats
- Low-graphics mode for performance optimization
- Object pooling to reduce memory allocation overhead

## Manifest Format

The Spine manifest is located at `src/client/assets/manifest.spine.json`. It defines all available Spine skeletons:
# Asset Pipeline Documentation

## Overview

This document describes the Etidorhpa asset pipeline for Spine skeletal animations, including manifest format, export settings, and integration with the low-graphics mode system.

## Spine Manifest Format

The Spine manifest (`src/client/assets/manifest.spine.json`) defines all Spine skeletons, their data files, atlases, and texture variants.

### Manifest Structure

```json
{
  "skeletons": {
    "skeleton-key": {
      "json": "path/to/skeleton.json",
    "character-pro": {
      "json": "assets/etidorhpa/character-pro.json",
      "atlas": "assets/etidorhpa/character-pro.atlas",
      "textures": {
        "1x": "assets/etidorhpa/1x/character-pro.webp",
        "2x": "assets/etidorhpa/2x/character-pro.webp",
        "fallback": "assets/etidorhpa/1x/character-pro.png"
    "skeleton-name": {
      "json": "path/to/skeleton.json",
      "binary": "path/to/skeleton.skel",
      "atlas": "path/to/skeleton.atlas",
      "textures": {
        "1x": "path/to/1x/texture.webp",
        "2x": "path/to/2x/texture.webp",
        "fallback": "path/to/1x/texture.png"
      }
    }
  }
}
```

### Fields

- **json**: Path to Spine JSON export file (or use `binary` for binary format)
- **atlas**: Path to texture atlas file (.atlas)
- **textures**: Map of texture scale variants
  - **1x**: Standard resolution texture (for mobile/low-end devices)
  - **2x**: High resolution texture (for desktop/HD displays)
  - **fallback**: PNG fallback for browsers without WebP support

## Exporting from Spine

### Recommended Spine Export Settings

1. **Skeleton Data**:
   - Format: JSON (or Binary for production)
   - Version: Match your Spine runtime version
   - Include: All required bones, slots, and animations
   - Optimize: Remove unused animations and attachments

2. **Texture Atlas**:
   - Use Spine's built-in texture packing or TexturePacker
   - Atlas format: Spine (.atlas)
   - Padding: 2-4 pixels to prevent bleeding
   - Extrude edges: Yes (prevents seams)
   - Power of two: Not required for WebGL

3. **Textures**:
   - Export at multiple scales (1x for mobile, 2x for desktop)
   - Format: PNG (for editing), WebP (for production)
   - Compression: Use WebP for 30-50% size reduction

### Export Workflow

1. **In Spine Editor**:
   - File → Export → JSON (or Binary)
   - Select output directory: `assets/etidorhpa/`
   - Export texture atlas with skeleton

2. **Generate Scale Variants**:
   ```bash
   # Export 1x (standard)
   - Set scale to 1.0 in export settings
   - Output to: assets/etidorhpa/1x/
   
   # Export 2x (high-res)
   - Set scale to 2.0 in export settings
   - Output to: assets/etidorhpa/2x/
   ```

3. **Convert to WebP**:
   ```bash
   # Using cwebp (install from webp package)
   cwebp -q 80 assets/etidorhpa/1x/character.png -o assets/etidorhpa/1x/character.webp
   cwebp -q 80 assets/etidorhpa/2x/character.png -o assets/etidorhpa/2x/character.webp
   ```

4. **Update Manifest**:
   - Add entry to `manifest.spine.json`
   - Point to JSON, atlas, and texture paths
   - Include both WebP and PNG fallback

## TexturePacker Settings

If using TexturePacker instead of Spine's built-in packer:

- **Algorithm**: MaxRects
- **Texture format**: PNG-8 or PNG-32
- **Size constraints**: 2048x2048 (safe for mobile)
- **Padding**: 2-4 pixels
- **Extrude**: 1 pixel
- **Allow rotation**: Yes
- **Trim**: Yes (remove transparent pixels)

Export settings:
- Data format: Spine
- Data file: `character.atlas`
- Texture file: `character.png`

## Loading in Code

Assets are loaded via `spineLoader.js`:

```javascript
import { loadManifest, loadSkeleton } from './client/assets/spineLoader.js';

// In BootScene preload
const manifest = await loadManifest('src/client/assets/manifest.spine.json');

await loadSkeleton(this, manifest, 'character-pro', {
  textureScale: '1x',  // or '2x' for high-res
  preferWebP: true
});
```

## Low-Graphics Mode

Low-graphics mode affects asset loading and pooling:

### Asset Loading
- Uses `1x` texture variant instead of `2x`
- Reduces texture memory usage by ~75%
- Automatically selected on low-end devices

### Pooling Behavior
When low-graphics mode is enabled, pooled Spine instances have:

1. **Reduced Scale**: 75% of normal size
2. **Disabled Features**:
   - Mesh deformations (uses simple bone transforms)
   - Advanced blend modes
3. **Reduced Update Frequency**: 30 FPS instead of 60 FPS
4. **Smaller Pool Size**: Fewer instances in memory

### Toggling Low-Graphics

Users can toggle low-graphics mode via the UI:
- Toggle appears in top-right corner
- Setting persisted to `localStorage`
- Changes apply to newly created instances

Developers can programmatically set it:
```javascript
import { setLowGraphicsMode } from './client/assets/spinePool.js';
import { updateGraphicsSettings } from './client/layout/ViewportLayoutManager.js';

updateGraphicsSettings(true);  // Enable low-graphics
setLowGraphicsMode(true);      // Update pools
```

## Migration from Septerra

If you have existing Spine assets using "septerra" naming:

1. Rename asset directories:
   ```bash
   mv assets/septerra assets/etidorhpa
   ```

2. Update manifest paths to use `etidorhpa` instead of `septerra`

3. The localStorage migration is automatic:
   - Old key: `septerra_low_graphics`
   - New key: `etidorhpa_low_graphics`
   - Migration happens on first read

## Performance Tips

1. **Texture Size**: Use smallest possible texture that looks good
2. **Atlas Packing**: Pack multiple characters into one atlas when possible
3. **Animation Complexity**: Simplify animations for background/distant characters
4. **Pooling**: Reuse skeleton instances instead of creating new ones
5. **LOD**: Consider multiple quality levels for distant characters

## Troubleshooting

### Assets not loading
- Check browser console for errors
- Verify file paths in manifest are correct
- Ensure atlas and texture files exist
- Check CORS settings if loading from CDN

### Low-graphics mode not working
- Check localStorage value: `localStorage.getItem('etidorhpa_low_graphics')`
- Verify CSS variable is set: `getComputedStyle(document.documentElement).getPropertyValue('--etidorhpa-low-graphics')`
- Check console for migration messages

### Poor performance
- Enable low-graphics mode on affected devices
- Reduce texture scale to 1x
- Decrease pool sizes
- Simplify animations

## References

- [Spine Runtime Documentation](http://esotericsoftware.com/spine-runtimes)
- [Phaser Spine Plugin](https://github.com/orange-games/phaser-spine)
- [WebP Conversion Tools](https://developers.google.com/speed/webp)
- **json**: Path to Spine skeleton JSON (or binary .skel file)
- **atlas**: Path to Spine atlas file (.atlas)
- **textures**: Texture variants by scale and format
  - **1x**: Low-resolution texture (typically 512x or 1024x)
  - **2x**: High-resolution texture (typically 2048x)
  - **fallback**: PNG fallback if WebP is not supported

## Exporting Spine Assets

### Spine Editor Settings

**Recommended Spine version**: 4.1+ (for optimal WebP support)

1. **Export JSON**:
   - Format: JSON (not binary for debugging)
   - Minify: No (for readability during development)
   - Pretty print: Yes

2. **Texture Settings**:
   - Max texture size: 2048x2048 (for 2x), 1024x1024 (for 1x)
   - Format: WebP (primary), PNG (fallback)
   - Compression: Medium quality (80-85%)
   - Premultiply alpha: Yes

3. **Atlas Settings**:
   - Pot (Power of Two): Yes
   - Padding: 2-4 pixels
   - Strip whitespace: Yes
   - Duplicate padding: Yes

### TexturePacker Integration

If using TexturePacker for atlas packing:

1. **Algorithm**: MaxRects
2. **Packing**: Best (optimize space)
3. **Exporter**: Spine
4. **Format**: WebP + PNG fallback
5. **Scale variants**: Export both 1x and 2x scales

### File Organization

```
assets/etidorhpa/
├── character-pro.json
├── character-pro.atlas
├── 1x/
│   ├── character-pro.webp
│   └── character-pro.png
└── 2x/
    ├── character-pro.webp
    └── character-pro.png
```

## Loading Assets

Assets are loaded in `BootScene` using the `spineLoader` module:

```javascript
import { loadManifest, loadSkeletons } from '../client/assets/spineLoader.js';

// In BootScene.preload()
const manifest = await loadManifest();
await loadSkeletons(this, ['character-pro'], manifest, lowGraphics);
```

The loader:
- Does NOT eager-load on module import
- Loads assets explicitly when called
- Respects low-graphics mode setting
- Caches loaded data in Phaser cache

## Pooling System

The `spinePool` module manages object pooling for Spine skeletons:

```javascript
import { spinePoolManager } from '../client/assets/spinePool.js';
import { getSkeletonData } from '../client/assets/spineLoader.js';

// Acquire from pool
const skeletonData = getSkeletonData(this, 'character-pro');
const character = spinePoolManager.acquire('character-pro', skeletonData);

// Use the character...

// Release back to pool when done
spinePoolManager.release('character-pro', character);
```

### Pool Configuration

Default settings (in `spinePool.js`):
- **Initial size**: 5 instances
- **Max size**: 20 instances
- **Low-graphics scale**: 0.75x

## Low-Graphics Mode

Low-graphics mode optimizes performance on lower-end devices:

### Texture Selection
- **Normal mode**: Uses 2x textures (high resolution)
- **Low-graphics mode**: Uses 1x textures (lower resolution)

### Skeleton Optimizations
When low-graphics mode is enabled, pooled skeletons have:
- **Scale**: Reduced to 75% (configurable)
- **Mesh deformations**: Disabled
- **Update frequency**: Reduced to 30 FPS (vs 60 FPS)
- **Texture quality**: Uses 1x variants

### User Control
Users can toggle low-graphics mode via:
- HUD toggle in the UI (top-right corner)
- Setting persisted in `localStorage` under key `etidorhpa_low_graphics`

### Automatic Detection
Device quality is detected using:
- `navigator.deviceMemory`
- `navigator.hardwareConcurrency`
- User agent (mobile detection)

Low-graphics mode is auto-enabled for "low" quality devices.

## Migration Notes

### From Septerra to Etidorhpa

The project has been renamed from Septerra to Etidorhpa. Migration is handled automatically:

1. **localStorage keys**: Old `septerra_low_graphics` migrated to `etidorhpa_low_graphics`
2. **CSS variables**: Both `--etidorhpa-low-graphics` and `--septerra-low-graphics` are set (legacy fallback)
3. **Asset paths**: Use `assets/etidorhpa/` (renamed from `assets/septerra/`)

The old CSS variable `--septerra-low-graphics` will be removed in a future release.

## TODO

- [ ] Replace placeholder filenames in manifest with actual asset paths
- [ ] Export actual Spine skeletons for characters
- [ ] Integrate Spine Phaser runtime plugin
- [ ] Add atlas compression optimization
- [ ] Create automated export scripts

## Resources

- [Spine User Guide](http://esotericsoftware.com/spine-user-guide)
- [Spine Runtimes](http://esotericsoftware.com/spine-runtimes)
- [TexturePacker](https://www.codeandweb.com/texturepacker)
- [WebP Format](https://developers.google.com/speed/webp)
- **json**: Path to Spine JSON export (required if `binary` not provided)
- **binary**: Path to Spine binary export (.skel) - preferred for production
- **atlas**: Path to texture atlas file (required)
- **textures**: Object mapping scale variants and formats
  - **1x**: Standard resolution texture (WebP recommended)
  - **2x**: High resolution texture for high-DPI displays
  - **fallback**: PNG fallback for browsers without WebP support

## Exporting Spine Assets

### Recommended Spine Export Settings

1. **Spine Version**: 4.0+ recommended
2. **Animation Data**:
   - Format: JSON (dev) or Binary (production)
   - Pretty print: Enable for JSON in development
   - Nonessential data: Disable for production

3. **Texture Packing**:
   - Use TexturePacker or Spine's built-in packer
   - Atlas format: Spine atlas (.atlas)
   - Texture format: PNG or WebP
   - Power of 2: Enable
   - Max size: 2048x2048 (balance between quality and memory)

### TexturePacker Settings

For optimal atlas packing:

```
Format: Spine
Data format: Spine
Texture format: PNG-32 (for fallback) or WebP (for modern browsers)
Algorithm: MaxRects
Pack mode: Best
Allow rotation: No (unless needed)
Trim: Sprite
Padding: 2px
Extrude: 1px
```

### Scale Variants

Generate textures at multiple resolutions:

1. **1x (Standard)**: Base resolution for mobile and low-end devices
2. **2x (High-DPI)**: For retina displays and high-end devices

Export workflow:
1. Export skeleton data once (JSON or binary)
2. Export atlas at 1x scale → `assets/etidorhpa/1x/`
3. Export atlas at 2x scale → `assets/etidorhpa/2x/`
4. Generate WebP versions: `cwebp -q 90 input.png -o output.webp`

## Low-Graphics Mode

### Overview

Low-graphics mode optimizes Spine rendering for low-end devices by:

1. Using lower resolution textures (1x instead of 2x)
2. Reducing skeleton scale (0.75x default)
3. Disabling expensive features (mesh deformations)
4. Reducing update frequency

### Implementation

The `spinePool` automatically applies low-graphics optimizations when creating skeleton instances:

```javascript
const pool = createSpinePool(skeletonData, {
  lowGraphics: true,
  lowGraphicsScale: 0.75
});
```

### Pooling Behavior

- **Standard mode**: Full-featured skeletons with normal update rate
- **Low-graphics mode**: 
  - Skeletons scaled to 75% by default
  - Mesh deformations disabled
  - Update every 2 frames instead of every frame
  - Smaller initial pool size

### User Control

Users can toggle low-graphics mode via:
1. HUD toggle in top-right corner
2. Automatic detection based on device quality
3. Preference persisted in localStorage as `etidorhpa_low_graphics`

## Migration Notes

### From Septerra to Etidorhpa

When migrating from the old Septerra project:

1. **Asset Paths**: Update any hardcoded paths from `septerra` to `etidorhpa`
2. **LocalStorage**: Migration shim automatically copies `septerra_low_graphics` → `etidorhpa_low_graphics`
3. **CSS Variables**: Both `--septerra-low-graphics` and `--etidorhpa-low-graphics` are set for one release cycle
4. **Manifest**: Update manifest paths to use `etidorhpa` naming

### Backwards Compatibility

The system maintains backwards compatibility through:
- localStorage key migration on first read
- Dual CSS variable publishing
- Graceful degradation if Spine assets fail to load

## Integration Examples

### Loading in BootScene

```javascript
import { loadEssentialSkeletons } from '../client/assets/spineLoader.js';

async loadSpineAssets() {
  const skeletonDataList = await loadEssentialSkeletons(
    this,
    ['character-pro', 'enemy-basic'],
    'src/client/assets/manifest.spine.json'
  );
  // Store for use in WorldScene
}
```

### Using in WorldScene

```javascript
import { createSpinePool, acquireSkeleton } from '../client/assets/spinePool.js';

// Create pool
const pool = createSpinePool(skeletonData, {
  initialSize: 20,
  lowGraphics: viewportLayoutManager.isLowGraphics()
});

// Spawn character
const character = acquireSkeleton(pool, x, y, 'idle', true);

// Return to pool when done
releaseSkeleton(pool, character);
```

## TODO

- Replace placeholder asset paths in manifest with actual exported Spine files
- Implement full Phaser Spine plugin integration
- Add performance monitoring for adaptive quality
- Consider implementing LOD (Level of Detail) system
- Add asset preloading strategies for large worlds

## References

- [Spine Documentation](http://esotericsoftware.com/spine-user-guide)
- [TexturePacker Documentation](https://www.codeandweb.com/texturepacker/documentation)
- [Phaser Spine Plugin](https://github.com/photonstorm/phaser3-plugin-spine)
## Spine Asset Management

This document describes how Spine skeletal animation assets are loaded, managed, and optimized in Etidorhpa.

### Manifest Format

Spine assets are organized using a JSON manifest file located at `src/client/assets/manifest.spine.json`. This manifest defines all available Spine characters, their skeleton formats, atlas files, and texture variants.

#### Manifest Structure

```json
{
  "version": "1.0",
  "characters": {
    "character-id": {
      "skeleton": {
        "json": "path/to/skeleton.json",
        "binary": "path/to/skeleton.skel"
      },
      "atlas": "path/to/atlas.atlas",
      "textures": {
        "1x": {
          "webp": "path/to/texture.webp",
          "png": "path/to/texture.png"
        },
        "2x": {
          "webp": "path/to/texture@2x.webp",
          "png": "path/to/texture@2x.png"
        }
      }
    }
  }
}
```

### Exporting Spine Assets

#### Recommended Export Settings

1. **Skeleton Format**
   - **JSON**: Use for development and debugging (human-readable)
   - **Binary**: Use for production (smaller file size, faster parsing)

2. **Atlas Packing**
   - Use power-of-two dimensions (512, 1024, 2048)
   - Enable padding (2-4 pixels) to prevent texture bleeding
   - Use premultiplied alpha for proper blending
   - Pack related animations together to minimize atlas switches

3. **Texture Formats**
   - **WebP**: Primary format for modern browsers (better compression)
   - **PNG**: Fallback format for compatibility
   - Export both formats for maximum compatibility

4. **Scale Variants**
   - **1x**: Standard resolution for medium/low-end devices
   - **2x**: High resolution for high-end devices and retina displays
   - The system automatically selects based on device capability

### Loading Assets

Assets are loaded through the `spineLoader` module, which handles:

1. Manifest loading
2. Asset path resolution
3. Format selection (JSON vs binary)
4. Texture variant selection based on device quality
5. Format fallback (WebP → PNG)

#### Example Usage in BootScene

```javascript
import { loadManifest, preloadEssentialCharacters } from '../client/assets/spineLoader.js';

async loadSpineAssets() {
    await loadManifest('src/client/assets/manifest.spine.json');
    
    const essentialCharacters = ['character-pro', 'character-npc'];
    await preloadEssentialCharacters(this, essentialCharacters, {
        format: 'json',  // or 'binary'
        scale: '1x'      // or '2x'
    });
}
```

### Pooling and Low-Graphics Mode

#### Object Pooling

The `spinePool` module implements object pooling to reduce garbage collection and improve performance:

```javascript
import { acquireSkeleton, releaseSkeleton } from '../client/assets/spinePool.js';

// Acquire a skeleton from the pool
const character = acquireSkeleton('character-pro', skeletonData, scene);
character.setPosition(x, y);

// When done, release back to pool
releaseSkeleton('character-pro', character);
```

#### Low-Graphics Mode

Low-graphics mode reduces visual complexity for low-end devices:

- Reduced skeleton scale (75% of original)
- Disabled expensive features (mesh deformation, complex blend modes)
- Lower animation update rates
- Simplified physics constraints

Users can toggle low-graphics mode through the HUD. The setting is:
- Persisted in localStorage (`etidorhpa_low_graphics`)
- Auto-detected based on device capabilities
- Applied globally to all pooled skeletons

### Device Quality Detection

The system automatically detects device capability using:

1. **Device Memory** (`navigator.deviceMemory`)
   - ≥8 GB: High quality
   - ≥4 GB: Medium quality
   - <4 GB: Low quality

2. **Hardware Concurrency** (`navigator.hardwareConcurrency`)
   - ≥8 cores: High quality
   - ≥4 cores: Medium quality
   - <4 cores: Low quality

3. **Mobile Detection**
   - Mobile devices get one quality tier lower
   - Ensures smooth performance on mobile hardware

Based on detection, the system automatically:
- Selects appropriate texture scale (1x vs 2x)
- Enables/disables low-graphics mode by default
- Adjusts particle effects and shadows

### File Organization

```
assets/
└── spine/
    ├── character-pro/
    │   ├── character-pro.json
    │   ├── character-pro.skel
    │   ├── character-pro.atlas
    │   ├── character-pro.png
    │   ├── character-pro.webp
    │   ├── character-pro@2x.png
    │   └── character-pro@2x.webp
    └── character-npc/
        └── ...
```

### TODO for Asset Integration

Before deploying Spine assets, verify:

1. [ ] All asset file paths in manifest match actual exported files
2. [ ] Atlas files use recommended settings (power-of-two, premultiplied alpha)
3. [ ] Both WebP and PNG versions exist for all textures
4. [ ] Scale variants (1x and 2x) are properly exported
5. [ ] Skeleton data is optimized (remove unused animations/bones)
6. [ ] Test loading in both development (JSON) and production (binary) modes

### Performance Tips

1. **Preload Essential Assets**: Only preload characters needed for the initial scene
2. **Lazy Load**: Load additional characters on-demand as scenes require them
3. **Pool Aggressively**: Reuse skeleton instances instead of creating/destroying
4. **Batch Draws**: Group characters with the same atlas to minimize draw calls
5. **Monitor Pool Stats**: Use `getPoolStats()` to identify memory leaks

### Troubleshooting

**Assets not loading?**
- Check browser console for manifest loading errors
- Verify file paths in manifest.spine.json
- Ensure Phaser Spine plugin is properly configured

**Poor performance?**
- Enable low-graphics mode
- Reduce number of active skeletons
- Use 1x textures instead of 2x
- Check pool stats for excessive object creation

**Visual artifacts?**
- Verify atlas padding is enabled
- Check premultiplied alpha settings
- Ensure texture dimensions are power-of-two
