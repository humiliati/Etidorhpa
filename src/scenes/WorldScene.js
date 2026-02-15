/**
 * World Scene
 * Main game scene with character pooling support
 */

import { createSpinePool, acquireSkeleton, releaseSkeleton } from '../client/assets/spinePool.js';
import { viewportLayoutManager } from '../client/layout/ViewportLayoutManager.js';

export class WorldScene extends Phaser.Scene {
    constructor() {
        super('WorldScene');
        this.characterPools = {};
        this.activeCharacters = [];
    }

    init(data) {
        // Receive spine skeletons from BootScene
        this.spineSkeletons = data.spineSkeletons || {};
        console.log('WorldScene: Received spine skeletons:', Object.keys(this.spineSkeletons));
    }

    create() {
        console.log('WorldScene: Creating world...');

        // Add background
        this.add.tileSprite(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            1280,
            720,
            'background'
        );

        // Initialize character pools
        this.initializeCharacterPools();

        // Display world info
        this.add.text(20, 20, 'Etidorhpa World Scene', {
            fontSize: '24px',
            color: '#ffffff'
        });

        // Display low-graphics mode status
        const isLowGraphics = viewportLayoutManager.isLowGraphics();
        this.add.text(20, 60, `Low Graphics: ${isLowGraphics ? 'ON' : 'OFF'}`, {
            fontSize: '16px',
            color: isLowGraphics ? '#ff9900' : '#00ff00'
        });

        // TODO: Use spinePool for character creation
        // Example placeholder for character spawning:
        // this.spawnCharacter('character-pro', 400, 300, 'idle');
    }

    /**
     * Initialize character pools for loaded skeletons
     */
    initializeCharacterPools() {
        const isLowGraphics = viewportLayoutManager.isLowGraphics();
        const settings = viewportLayoutManager.getSettings();

        Object.keys(this.spineSkeletons).forEach(skeletonName => {
            const skeletonData = this.spineSkeletons[skeletonName];
            
            // Create a pool for this skeleton type
            this.characterPools[skeletonName] = createSpinePool(skeletonData, {
                initialSize: settings.initialPoolSize,
                lowGraphics: isLowGraphics,
                lowGraphicsScale: 0.75
            });

            console.log(`WorldScene: Created pool for ${skeletonName} (low-graphics: ${isLowGraphics})`);
        });
    }

    /**
     * Spawn a character using the pool system
     * TODO: Implement actual character spawning when Spine integration is complete
     * @param {string} skeletonName - Name of skeleton to spawn
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {string} animationName - Initial animation
     */
    spawnCharacter(skeletonName, x, y, animationName = 'idle') {
        const pool = this.characterPools[skeletonName];
        if (!pool) {
            console.warn(`WorldScene: No pool found for skeleton ${skeletonName}`);
            return null;
        }

        // Acquire a character from the pool
        const character = acquireSkeleton(pool, x, y, animationName, true);
        this.activeCharacters.push(character);

        console.log(`WorldScene: Spawned ${skeletonName} at (${x}, ${y})`);
        return character;
    }

    /**
     * Despawn a character and return it to the pool
     * @param {Object} character - Character instance to despawn
     */
    despawnCharacter(character) {
        const index = this.activeCharacters.indexOf(character);
        if (index !== -1) {
            this.activeCharacters.splice(index, 1);
        }

        // Find the appropriate pool and release
        const skeletonName = character.data.name;
        const pool = this.characterPools[skeletonName];
        if (pool) {
            releaseSkeleton(pool, character);
            console.log(`WorldScene: Despawned ${skeletonName}`);
        }
    }

    update(time, delta) {
        // TODO: Update active characters
        // Implement low-graphics optimization (reduced update frequency)
        // if (viewportLayoutManager.isLowGraphics()) {
        //     // Update less frequently
        // }
    }

    shutdown() {
        // Clean up - iterate in reverse to avoid issues with splice
        for (let i = this.activeCharacters.length - 1; i >= 0; i--) {
            this.despawnCharacter(this.activeCharacters[i]);
        }
        this.activeCharacters = [];
        this.characterPools = {};
    }
}
