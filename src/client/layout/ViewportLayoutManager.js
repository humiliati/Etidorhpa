/**
 * Viewport layout manager
 * Handles responsive layout, device quality detection, and CSS variable publishing
 */

import { getDeviceQuality, getRecommendedSettings } from '../utils/deviceQuality.js';

export class ViewportLayoutManager {
    constructor() {
        this.deviceQuality = null;
        this.settings = null;
        this.initialized = false;
    }

    /**
     * Initialize the layout manager and detect device quality
     */
    initialize() {
        if (this.initialized) {
            return;
        }

        // Detect device quality
        this.deviceQuality = getDeviceQuality();
        this.settings = getRecommendedSettings(this.deviceQuality);

        // Apply initial CSS variables
        this.updateCssVariables();

        // Listen for resize events
        window.addEventListener('resize', () => this.handleResize());

        this.initialized = true;
        console.log(`ViewportLayoutManager initialized with device quality: ${this.deviceQuality}`);
    }

    /**
     * Update CSS variables based on device quality and settings
     */
    updateCssVariables() {
        const root = document.documentElement;

        // Set low-graphics CSS variable (both new and legacy names for compatibility)
        const lowGraphicsValue = this.settings.lowGraphics ? '1' : '0';
        root.style.setProperty('--etidorhpa-low-graphics', lowGraphicsValue);
        // TODO: Remove --septerra-low-graphics after one release
        root.style.setProperty('--septerra-low-graphics', lowGraphicsValue);

        // Additional quality-based CSS variables
        root.style.setProperty('--etidorhpa-particle-multiplier', this.settings.particleMultiplier.toString());
        root.style.setProperty('--etidorhpa-texture-scale', this.settings.textureScale.toString());
        root.style.setProperty('--etidorhpa-device-quality', this.deviceQuality);
    }

    /**
     * Handle window resize events
     */
    handleResize() {
        // Re-detect quality on significant layout changes if needed
        // For now, we keep the initial detection
        // TODO: Implement adaptive quality based on performance monitoring
    }

    /**
     * Get current device quality
     * @returns {'high'|'medium'|'low'}
     */
    getDeviceQuality() {
        return this.deviceQuality;
    }

    /**
     * Get current recommended settings
     * @returns {Object}
     */
    getSettings() {
        return { ...this.settings };
    }

    /**
     * Override low-graphics setting (e.g., from user preference)
     * @param {boolean} lowGraphics - Enable/disable low-graphics mode
     */
    setLowGraphics(lowGraphics) {
        this.settings.lowGraphics = lowGraphics;
        this.updateCssVariables();
    }

    /**
     * Check if low-graphics mode is enabled
     * @returns {boolean}
     */
    isLowGraphics() {
        return this.settings.lowGraphics;
    }
}

// Singleton instance
export const viewportLayoutManager = new ViewportLayoutManager();
