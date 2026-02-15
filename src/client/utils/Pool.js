/**
 * Generic object pooling utility
 * Reduces GC pressure by reusing objects instead of creating/destroying them
 */
export class Pool {
    /**
     * @param {Function} factory - Function that creates a new instance when pool is empty
     * @param {number} initialSize - Initial pool size (default: 10)
     */
    constructor(factory, initialSize = 10) {
        this.factory = factory;
        this.available = [];
        this.inUse = new Set();
        
        // Pre-populate pool
        for (let i = 0; i < initialSize; i++) {
            this.available.push(this.factory());
        }
    }

    /**
     * Acquire an object from the pool
     * Creates a new instance if pool is empty
     * @returns {*} Object instance from pool
     */
    acquire() {
        let instance;
        if (this.available.length > 0) {
            instance = this.available.pop();
        } else {
            instance = this.factory();
        }
        this.inUse.add(instance);
        return instance;
    }

    /**
     * Release an object back to the pool
     * @param {*} instance - Object to release back to pool
     */
    release(instance) {
        if (this.inUse.has(instance)) {
            this.inUse.delete(instance);
            this.available.push(instance);
        }
    }

    /**
     * Get pool statistics
     * @returns {{available: number, inUse: number, total: number}}
     */
    getStats() {
        return {
            available: this.available.length,
            inUse: this.inUse.size,
            total: this.available.length + this.inUse.size
        };
    }

    /**
     * Clear the pool
     */
    clear() {
        this.available = [];
        this.inUse.clear();
    }
}
