/**
 * UI Shell creator
 * Creates HUD controls including low-graphics mode toggle with localStorage persistence
 */

import { viewportLayoutManager } from '../layout/ViewportLayoutManager.js';

// LocalStorage keys
const STORAGE_KEY_NEW = 'etidorhpa_low_graphics';
const STORAGE_KEY_OLD = 'septerra_low_graphics';

/**
 * Migrate old localStorage key to new key
 * Implements backwards-compatibility for renamed project
 */
function migrateLowGraphicsPreference() {
    // Check if new key already exists
    const newValue = localStorage.getItem(STORAGE_KEY_NEW);
    if (newValue !== null) {
        return; // New key exists, no migration needed
    }

    // Check if old key exists
    const oldValue = localStorage.getItem(STORAGE_KEY_OLD);
    if (oldValue !== null) {
        // Migrate: copy old value to new key
        localStorage.setItem(STORAGE_KEY_NEW, oldValue);
        // Keep old key for one release cycle to support version switching
        // TODO: Remove old key cleanup after one release (2026-Q3)
        // localStorage.removeItem(STORAGE_KEY_OLD);
        console.log(`Migrated low-graphics preference from ${STORAGE_KEY_OLD} to ${STORAGE_KEY_NEW}`);
    }
}

/**
 * Read low-graphics preference from localStorage
 * @returns {boolean} Low-graphics enabled state
 */
function readLowGraphicsPreference() {
    // First, ensure migration has happened
    migrateLowGraphicsPreference();

    // Read from new key
    const value = localStorage.getItem(STORAGE_KEY_NEW);
    
    // Default to device-detected value if no preference stored
    if (value === null) {
        return viewportLayoutManager.isLowGraphics();
    }

    return value === 'true';
}

/**
 * Save low-graphics preference to localStorage
 * @param {boolean} enabled - Low-graphics enabled state
 */
function saveLowGraphicsPreference(enabled) {
    localStorage.setItem(STORAGE_KEY_NEW, enabled.toString());
}

/**
 * Create the UI shell with HUD controls
 * @param {HTMLElement} container - Container element for UI (default: document.body)
 * @returns {Object} UI shell instance with control methods
 */
export function createUiShell(container = document.body) {
    // Migrate and read preference
    const initialLowGraphics = readLowGraphicsPreference();
    
    // Apply initial preference to layout manager
    viewportLayoutManager.setLowGraphics(initialLowGraphics);

    // Create HUD container
    const hudContainer = document.createElement('div');
    hudContainer.id = 'etidorhpa-hud';
    hudContainer.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 1000;
        background: rgba(0, 0, 0, 0.7);
        padding: 10px;
        border-radius: 5px;
        color: white;
        font-family: Arial, sans-serif;
        font-size: 14px;
    `;

    // Create low-graphics toggle
    const toggleLabel = document.createElement('label');
    toggleLabel.style.cssText = 'display: flex; align-items: center; cursor: pointer;';

    const toggleCheckbox = document.createElement('input');
    toggleCheckbox.type = 'checkbox';
    toggleCheckbox.checked = initialLowGraphics;
    toggleCheckbox.style.cssText = 'margin-right: 8px; cursor: pointer;';

    const toggleText = document.createElement('span');
    toggleText.textContent = 'Low Graphics Mode';

    toggleLabel.appendChild(toggleCheckbox);
    toggleLabel.appendChild(toggleText);
    hudContainer.appendChild(toggleLabel);

    // Handle toggle changes
    toggleCheckbox.addEventListener('change', (event) => {
        const enabled = event.target.checked;
        
        // Save preference
        saveLowGraphicsPreference(enabled);
        
        // Update layout manager
        viewportLayoutManager.setLowGraphics(enabled);
        
        // Publish CSS variables (done automatically by setLowGraphics)
        // Both --etidorhpa-low-graphics and --septerra-low-graphics are updated
        
        console.log(`Low-graphics mode ${enabled ? 'enabled' : 'disabled'}`);
        
        // TODO: Notify spinePool to adjust creation behavior
        // This would require a global event system or direct pool reference
    });

    // Add HUD to container
    container.appendChild(hudContainer);

    // Return UI shell API
    return {
        hudContainer,
        toggleCheckbox,
        
        /**
         * Get current low-graphics state
         * @returns {boolean}
         */
        isLowGraphics() {
            return toggleCheckbox.checked;
        },
        
        /**
         * Set low-graphics state programmatically
         * @param {boolean} enabled
         */
        setLowGraphics(enabled) {
            toggleCheckbox.checked = enabled;
            saveLowGraphicsPreference(enabled);
            viewportLayoutManager.setLowGraphics(enabled);
        },
        
        /**
         * Destroy the UI shell
         */
        destroy() {
            if (hudContainer.parentNode) {
                hudContainer.parentNode.removeChild(hudContainer);
            }
        }
    };
}
