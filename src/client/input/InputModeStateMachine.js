/**
 * Input mode state machine
 * Manages input mode transitions (keyboard, mouse, gamepad, touch)
 * TODO: Implement full state machine logic
 */

export class InputModeStateMachine {
    constructor() {
        this.currentMode = 'mouse'; // Default mode
        this.listeners = [];
    }

    /**
     * Initialize the state machine
     */
    initialize() {
        // TODO: Set up input event listeners to detect mode changes
        console.log('InputModeStateMachine initialized');
    }

    /**
     * Get current input mode
     * @returns {'mouse'|'keyboard'|'gamepad'|'touch'}
     */
    getCurrentMode() {
        return this.currentMode;
    }

    /**
     * Set input mode
     * @param {'mouse'|'keyboard'|'gamepad'|'touch'} mode
     */
    setMode(mode) {
        if (this.currentMode !== mode) {
            const previousMode = this.currentMode;
            this.currentMode = mode;
            this.notifyListeners(mode, previousMode);
        }
    }

    /**
     * Add mode change listener
     * @param {Function} callback - Called with (newMode, previousMode)
     */
    addListener(callback) {
        this.listeners.push(callback);
    }

    /**
     * Remove mode change listener
     * @param {Function} callback
     */
    removeListener(callback) {
        const index = this.listeners.indexOf(callback);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }

    /**
     * Notify all listeners of mode change
     * @private
     */
    notifyListeners(newMode, previousMode) {
        this.listeners.forEach(callback => {
            try {
                callback(newMode, previousMode);
            } catch (error) {
                console.error('Error in input mode listener:', error);
            }
        });
    }

    /**
     * Destroy the state machine
     */
    destroy() {
        this.listeners = [];
        // TODO: Remove event listeners
    }
}
