/**
 * Device quality detection utility
 * Determines device performance tier based on hardware characteristics
 */

/**
 * Detect device quality level based on available hardware information
 * @returns {'high'|'medium'|'low'} Device quality tier
 */
export function getDeviceQuality() {
    // Check for available APIs
    const memory = navigator.deviceMemory; // GB, available in Chrome
    const cores = navigator.hardwareConcurrency;
    const userAgent = navigator.userAgent.toLowerCase();

    // High-end device indicators
    if (memory && memory >= 8) {
        return 'high';
    }

    if (cores && cores >= 8) {
        return 'high';
    }

    // Low-end device indicators
    if (memory && memory < 4) {
        return 'low';
    }

    if (cores && cores <= 2) {
        return 'low';
    }

    // Check for known low-end devices via user agent
    const lowEndPatterns = [
        /android.*2\./,
        /android.*3\./,
        /android.*4\.[0-3]/,
        /windows phone/,
        /opera mini/,
        /opera mobi/
    ];

    for (const pattern of lowEndPatterns) {
        if (pattern.test(userAgent)) {
            return 'low';
        }
    }

    // Check for mobile devices - default to medium unless proven otherwise
    const isMobile = /mobile|android|iphone|ipad|tablet/.test(userAgent);
    
    if (isMobile) {
        // Modern mobile devices without enough info default to medium
        return memory && memory >= 6 ? 'high' : 'medium';
    }

    // Desktop or unknown - assume medium as safe default
    return 'medium';
}

/**
 * Get recommended settings based on device quality
 * @param {'high'|'medium'|'low'} quality - Device quality tier
 * @returns {Object} Recommended settings object
 */
export function getRecommendedSettings(quality) {
    const settings = {
        high: {
            lowGraphics: false,
            particleMultiplier: 1.0,
            shadowQuality: 'high',
            textureScale: 2,
            initialPoolSize: 100
        },
        medium: {
            lowGraphics: false,
            particleMultiplier: 0.7,
            shadowQuality: 'medium',
            textureScale: 1,
            initialPoolSize: 50
        },
        low: {
            lowGraphics: true,
            particleMultiplier: 0.3,
            shadowQuality: 'low',
            textureScale: 1,
            initialPoolSize: 20
        }
    };

    return settings[quality] || settings.medium;
}
