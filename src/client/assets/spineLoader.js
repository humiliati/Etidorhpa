/**
 * Spine skeleton and asset loader
 * Handles loading Spine skeletons, atlases, and scaled texture variants
 * NOTE: Does not eager-load assets at import time - loading is explicit
 */

let cachedManifest = null;

/**
 * Load the Spine manifest
 * @param {string} manifestPath - Path to manifest.spine.json (default: src/client/assets/manifest.spine.json)
 * @returns {Promise<Object>} Parsed manifest object
 */
export async function loadManifest(manifestPath = 'src/client/assets/manifest.spine.json') {
    if (cachedManifest) {
        return cachedManifest;
    }

    try {
        const response = await fetch(manifestPath);
        if (!response.ok) {
            throw new Error(`Failed to load manifest from ${manifestPath}: ${response.statusText}`);
        }
        cachedManifest = await response.json();
        return cachedManifest;
    } catch (error) {
        console.error('Error loading Spine manifest:', error);
        throw error;
    }
}

/**
 * Load a specific Spine skeleton by name
 * @param {Phaser.Scene} scene - Phaser scene instance
 * @param {string} skeletonName - Name of skeleton in manifest
 * @param {Object} manifest - Loaded manifest object
 * @param {Object} options - Loading options
 * @param {number} options.textureScale - Preferred texture scale (1 or 2), default: 1
 * @param {boolean} options.preferWebp - Prefer WebP format if available, default: true
 * @returns {Promise<Object>} Loaded skeleton data with metadata
 */
export async function loadSkeleton(scene, skeletonName, manifest, options = {}) {
    const { textureScale = 1, preferWebp = true } = options;
    
    if (!manifest || !manifest.skeletons || !manifest.skeletons[skeletonName]) {
        throw new Error(`Skeleton '${skeletonName}' not found in manifest`);
    }

    const skeletonEntry = manifest.skeletons[skeletonName];
    const { json, binary, atlas, textures } = skeletonEntry;

    // Determine which skeleton data file to load (prefer binary if available)
    const skeletonDataPath = binary || json;
    if (!skeletonDataPath) {
        throw new Error(`Skeleton '${skeletonName}' missing json/binary path`);
    }

    // Determine texture path based on scale and format preference
    let texturePath;
    if (textures) {
        const scaleKey = `${textureScale}x`;
        if (preferWebp && textures[scaleKey]) {
            texturePath = textures[scaleKey];
        } else if (textures.fallback) {
            texturePath = textures.fallback;
        } else {
            texturePath = textures['1x']; // Default fallback
        }
    }

    // Load skeleton data (Phaser handles JSON/binary detection)
    // TODO: This is a placeholder - actual Spine plugin integration needed
    // For now, return metadata that BootScene can use
    return {
        name: skeletonName,
        skeletonDataPath,
        atlasPath: atlas,
        texturePath,
        scale: textureScale,
        loaded: false // Will be set to true after actual Phaser loading
    };
}

/**
 * Load essential skeletons for boot
 * @param {Phaser.Scene} scene - Phaser scene (typically BootScene)
 * @param {Array<string>} essentialSkeletonNames - Array of skeleton names to load
 * @param {string} manifestPath - Path to manifest (optional)
 * @returns {Promise<Array<Object>>} Array of loaded skeleton metadata
 */
export async function loadEssentialSkeletons(scene, essentialSkeletonNames = [], manifestPath) {
    const manifest = await loadManifest(manifestPath);
    
    const loadPromises = essentialSkeletonNames.map(name => 
        loadSkeleton(scene, name, manifest)
    );

    return Promise.all(loadPromises);
}

/**
 * Clear manifest cache (useful for hot-reloading in dev)
 */
export function clearManifestCache() {
    cachedManifest = null;
}
