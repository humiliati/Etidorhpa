import { Start } from './scenes/Start.js';
import { BootScene } from './scenes/BootScene.js';
import { WorldScene } from './scenes/WorldScene.js';
import { createUiShell } from './client/ui/createUiShell.js';
import { viewportLayoutManager } from './client/layout/ViewportLayoutManager.js';

// Initialize viewport layout manager and detect device quality
viewportLayoutManager.initialize();

const config = {
    type: Phaser.AUTO,
    title: 'Etidorhpa',
    description: 'Etidorhpa - A Phaser game with Spine animations',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    pixelArt: false,
    scene: [
        BootScene,
        WorldScene,
        Start  // Keep original demo scene available
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

// Create the Phaser game instance
const game = new Phaser.Game(config);

// Create UI shell with low-graphics toggle
const uiShell = createUiShell(document.body);

// Make uiShell available globally for debugging (optional)
window.etidorhpa = {
    game,
    uiShell,
    viewportLayoutManager
};
            