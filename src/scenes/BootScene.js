/**
 * Boot Scene
 * Handles initial asset loading including Spine skeletons
 */

import { loadEssentialSkeletons } from '../client/assets/spineLoader.js';

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
        this.spineSkeletons = {};
    }

    preload() {
        console.log('BootScene: Loading essential assets...');

        // Load basic assets
        this.load.image('background', 'assets/space.png');
        this.load.image('logo', 'assets/phaser.png');

        // Load essential Spine skeletons
        // Note: This returns metadata - actual Phaser loading would happen here
        // TODO: Integrate with Phaser Spine plugin when available
        this.loadSpineAssets();
    }

    /**
     * Load Spine assets using spineLoader
     * Keeps loading lazy and non-blocking
     */
    async loadSpineAssets() {
        try {
            // Define essential skeletons to load at boot
            const essentialSkeletons = ['character-pro'];
            
            // Load skeleton metadata from manifest
            const skeletonDataList = await loadEssentialSkeletons(
                this,
                essentialSkeletons,
                'src/client/assets/manifest.spine.json'
            );

            // Store skeleton data for later use
            skeletonDataList.forEach(skeletonData => {
                this.spineSkeletons[skeletonData.name] = skeletonData;
                
                // TODO: Use Phaser Spine plugin to actually load the skeleton:
                // this.load.spine(
                //     skeletonData.name,
                //     skeletonData.skeletonDataPath,
                //     skeletonData.atlasPath,
                //     true // preMultipliedAlpha
                // );
            });

            // Expose skeleton data via Phaser's cache system
            // Use a custom cache category to avoid conflicts
            if (!this.cache.custom) {
                this.cache.addCustom('etidorhpa');
            }
            this.cache.custom.etidorhpa.spineSkeletons = this.spineSkeletons;

            console.log('BootScene: Spine skeleton metadata loaded:', Object.keys(this.spineSkeletons));
        } catch (error) {
            console.error('BootScene: Error loading Spine assets:', error);
            // Continue boot even if Spine loading fails (graceful degradation)
        }
    }

    create() {
        console.log('BootScene: Assets loaded, transitioning to WorldScene...');

        // Display loading complete message
        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Boot Complete\nStarting World...',
            {
                fontSize: '32px',
                color: '#ffffff',
                align: 'center'
            }
        ).setOrigin(0.5);

        // Transition to WorldScene after a brief delay
        this.time.delayedCall(1000, () => {
            this.scene.start('WorldScene', {
                spineSkeletons: this.spineSkeletons
            });
        });
    }
}
