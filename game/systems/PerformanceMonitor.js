// Monitor de rendimiento en tiempo real (FPS, memoria, entidades)

class PerformanceMonitor {
    constructor() {
        this.element = null;
        this.visible = false;
        
        // Métricas de rendimiento
        this.fps = 0;
        this.frameTime = 0;
        this.lastTime = performance.now();
        this.frames = 0;
        this.lastFPSUpdate = this.lastTime;
        
        // Historial para promedios
        this.fpsHistory = [];
        this.maxHistorySize = 60;
        
        // Contadores de entidades
        this.entityCounts = {
            enemies: 0,
            projectiles: 0,
            items: 0,
            platforms: 0
        };
        
        // Métricas de memoria (si está disponible)
        this.memoryUsage = 0;
        this.hasMemoryAPI = this.checkMemoryAPI();
        
        // Estado del juego
        this.gameState = 'UNKNOWN';
        this.level = 0;
        
        this.createMonitorElement();
    }

    /**
     * Verifica si la API de memoria está disponible
     * @returns {boolean}
     */
    checkMemoryAPI() {
        return (
            performance.memory !== undefined &&
            performance.memory.usedJSHeapSize !== undefined
        );
    }

    /**
     * Crea el elemento HTML del monitor
     */
    createMonitorElement() {
        this.element = document.createElement('div');
        this.element.id = 'performanceMonitor';
        this.element.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #0f0;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            padding: 10px;
            border: 2px solid #0f0;
            border-radius: 4px;
            z-index: 9999;
            min-width: 200px;
            user-select: none;
            display: none;
        `;

        this.updateDisplay();
        document.body.appendChild(this.element);
    }

    /**
     * Actualiza el monitor en cada frame
     */
    update() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.frameTime = deltaTime;
        this.frames++;

        // Actualizar FPS cada segundo
        if (currentTime - this.lastFPSUpdate >= 1000) {
            this.fps = Math.round(this.frames * 1000 / (currentTime - this.lastFPSUpdate));
            this.frames = 0;
            this.lastFPSUpdate = currentTime;
            
            // Agregar al historial
            this.fpsHistory.push(this.fps);
            if (this.fpsHistory.length > this.maxHistorySize) {
                this.fpsHistory.shift();
            }
            
            // Actualizar memoria
            if (this.hasMemoryAPI) {
                this.memoryUsage = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
            }
            
            // Actualizar contadores de entidades
            this.updateEntityCounts();
            
            // Actualizar estado del juego
            this.updateGameState();
            
            // Actualizar display si está visible
            if (this.visible) {
                this.updateDisplay();
            }
        }
    }

    /**
     * Actualiza los contadores de entidades del juego
     */
    updateEntityCounts() {
        if (!window.game) return;

        this.entityCounts = {
            enemies: window.game.enemyManager ? window.game.enemyManager.getAliveCount() : 0,
            projectiles: window.game.projectileSystem ? window.game.projectileSystem.getActiveCount() : 0,
            items: window.game.itemManager ? 
                (window.game.itemManager.getCoinCount() + window.game.itemManager.getPowerUpCount()) : 0,
            platforms: window.game.platforms ? window.game.platforms.length : 0
        };
    }

    /**
     * Actualiza el estado actual del juego
     */
    updateGameState() {
        if (window.currentState) {
            this.gameState = window.currentState;
        }
        
        if (window.game && window.game.levelManager) {
            this.level = window.game.levelManager.currentLevel;
        }
    }

    /**
     * Actualiza el contenido visual del monitor
     */
    updateDisplay() {
        if (!this.element) return;

        const avgFPS = this.getAverageFPS();
        const minFPS = this.getMinFPS();
        const maxFPS = this.getMaxFPS();
        
        const fpsColor = this.getFPSColor(this.fps);
        const totalEntities = Object.values(this.entityCounts).reduce((a, b) => a + b, 0);

        let html = `
            <div style="color: ${fpsColor}; font-weight: bold; margin-bottom: 5px;">
                FPS: ${this.fps}
            </div>
            <div>Frame: ${this.frameTime.toFixed(2)}ms</div>
            <div style="margin-top: 5px;">
                Avg: ${avgFPS} | Min: ${minFPS} | Max: ${maxFPS}
            </div>
        `;

        // Memoria (si está disponible)
        if (this.hasMemoryAPI) {
            html += `
                <div style="margin-top: 5px; border-top: 1px solid #0f0; padding-top: 5px;">
                    Memory: ${this.memoryUsage} MB
                </div>
            `;
        }

        // Entidades
        html += `
            <div style="margin-top: 5px; border-top: 1px solid #0f0; padding-top: 5px;">
                Entities: ${totalEntities}
            </div>
            <div style="font-size: 12px;">
                Enemies: ${this.entityCounts.enemies}<br>
                Projectiles: ${this.entityCounts.projectiles}<br>
                Items: ${this.entityCounts.items}<br>
                Platforms: ${this.entityCounts.platforms}
            </div>
        `;

        // Estado del juego
        html += `
            <div style="margin-top: 5px; border-top: 1px solid #0f0; padding-top: 5px;">
                State: ${this.gameState}
            </div>
        `;

        if (this.level > 0) {
            html += `<div>Level: ${this.level}</div>`;
        }

        this.element.innerHTML = html;
    }

    /**
     * Obtiene el FPS promedio
     * @returns {number}
     */
    getAverageFPS() {
        if (this.fpsHistory.length === 0) return 0;
        
        const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
        return Math.round(sum / this.fpsHistory.length);
    }

    /**
     * Obtiene el FPS mínimo del historial
     * @returns {number}
     */
    getMinFPS() {
        if (this.fpsHistory.length === 0) return 0;
        return Math.min(...this.fpsHistory);
    }

    /**
     * Obtiene el FPS máximo del historial
     * @returns {number}
     */
    getMaxFPS() {
        if (this.fpsHistory.length === 0) return 0;
        return Math.max(...this.fpsHistory);
    }

    /**
     * Determina el color según el FPS
     * @param {number} fps
     * @returns {string}
     */
    getFPSColor(fps) {
        if (fps >= 55) return '#0f0';      // Verde (bueno)
        if (fps >= 30) return '#ff0';      // Amarillo (aceptable)
        return '#f00';                      // Rojo (malo)
    }

    /**
     * Muestra u oculta el monitor
     * @param {boolean} visible
     */
    setVisible(visible) {
        if (!this.element) return;
        
        this.visible = visible;
        this.element.style.display = visible ? 'block' : 'none';
        
        if (visible) {
            this.updateDisplay();
        }
    }

    /**
     * Alterna la visibilidad del monitor
     */
    toggle() {
        this.setVisible(!this.visible);
    }

    /**
     * Resetea el historial de FPS
     */
    resetHistory() {
        this.fpsHistory = [];
        console.log('Historial de FPS reseteado');
    }

    /**
     * Obtiene un reporte completo del rendimiento
     * @returns {Object}
     */
    getPerformanceReport() {
        return {
            fps: {
                current: this.fps,
                average: this.getAverageFPS(),
                min: this.getMinFPS(),
                max: this.getMaxFPS()
            },
            frameTime: this.frameTime,
            memory: this.hasMemoryAPI ? this.memoryUsage : 'N/A',
            entities: {
                ...this.entityCounts,
                total: Object.values(this.entityCounts).reduce((a, b) => a + b, 0)
            },
            gameState: this.gameState,
            level: this.level
        };
    }

    /**
     * Registra el reporte de rendimiento en la consola
     */
    logReport() {
        console.log('=== REPORTE DE RENDIMIENTO ===');
        console.table(this.getPerformanceReport());
    }

    /**
     * Detecta problemas de rendimiento
     * @returns {Array<string>}
     */
    detectIssues() {
        const issues = [];
        
        // FPS bajo
        if (this.fps < 30) {
            issues.push(`FPS crítico: ${this.fps} (< 30)`);
        } else if (this.fps < 45) {
            issues.push(`FPS bajo: ${this.fps} (< 45)`);
        }
        
        // Frame time alto
        if (this.frameTime > 33) {
            issues.push(`Frame time alto: ${this.frameTime.toFixed(2)}ms (> 33ms)`);
        }
        
        // Demasiadas entidades
        const totalEntities = Object.values(this.entityCounts).reduce((a, b) => a + b, 0);
        if (totalEntities > 100) {
            issues.push(`Demasiadas entidades: ${totalEntities} (> 100)`);
        }
        
        // Memoria alta (si disponible)
        if (this.hasMemoryAPI && parseFloat(this.memoryUsage) > 100) {
            issues.push(`Uso de memoria alto: ${this.memoryUsage} MB (> 100 MB)`);
        }
        
        return issues;
    }

    /**
     * Cambia la posición del monitor
     * @param {string} position - 'top-left', 'top-right', 'bottom-left', 'bottom-right'
     */
    setPosition(position) {
        if (!this.element) return;

        // Resetear posiciones
        this.element.style.top = 'auto';
        this.element.style.right = 'auto';
        this.element.style.bottom = 'auto';
        this.element.style.left = 'auto';

        switch(position) {
            case 'top-left':
                this.element.style.top = '10px';
                this.element.style.left = '10px';
                break;
            case 'top-right':
                this.element.style.top = '10px';
                this.element.style.right = '10px';
                break;
            case 'bottom-left':
                this.element.style.bottom = '10px';
                this.element.style.left = '10px';
                break;
            case 'bottom-right':
                this.element.style.bottom = '10px';
                this.element.style.right = '10px';
                break;
        }
    }

    /**
     * Destruye el monitor
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        
        this.element = null;
        this.fpsHistory = [];
    }
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}