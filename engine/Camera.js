// engine/Camera.js
// Sistema de cámara con seguimiento suave y efectos

class Camera {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.smoothing = 0.1; // Factor de suavizado (0-1)
        
        // Para screen shake
        this.shakeAmount = 0;
        this.shakeDecay = 0.95;
        this.shakeOffsetX = 0;
        this.shakeOffsetY = 0;
        
        // Límites de la cámara
        this.minX = 0;
        this.maxX = Infinity;
        this.minY = 0;
        this.maxY = Infinity;
    }

    /**
     * Sigue a un objetivo (normalmente el jugador)
     * @param {Object} target - Objeto con propiedades x, y, width
     * @param {number} canvasWidth - Ancho del canvas
     * @param {number} offsetRatio - Ratio de offset (ej: 0.3 = 30% del canvas)
     */
    follow(target, canvasWidth, offsetRatio = 0.3) {
        this.targetX = target.x - (canvasWidth * offsetRatio);
        
        // Limitar cámara dentro de los bounds
        if (this.targetX < this.minX) {
            this.targetX = this.minX;
        }
        if (this.targetX > this.maxX) {
            this.targetX = this.maxX;
        }
    }

    /**
     * Actualiza la posición de la cámara con suavizado
     */
    update() {
        // Interpolación lineal suave
        this.x += (this.targetX - this.x) * this.smoothing;
        this.y += (this.targetY - this.y) * this.smoothing;
        
        // Actualizar screen shake
        if (this.shakeAmount > 0) {
            this.shakeOffsetX = (Math.random() - 0.5) * this.shakeAmount;
            this.shakeOffsetY = (Math.random() - 0.5) * this.shakeAmount;
            this.shakeAmount *= this.shakeDecay;
            
            // Detener shake cuando es muy pequeño
            if (this.shakeAmount < 0.1) {
                this.shakeAmount = 0;
                this.shakeOffsetX = 0;
                this.shakeOffsetY = 0;
            }
        }
    }

    /**
     * Aplica la transformación de la cámara al contexto
     * @param {CanvasRenderingContext2D} ctx
     */
    apply(ctx) {
        const finalX = this.x + this.shakeOffsetX;
        const finalY = this.y + this.shakeOffsetY;
        ctx.translate(-finalX, -finalY);
    }

    /**
     * Remueve la transformación de la cámara
     * @param {CanvasRenderingContext2D} ctx
     */
    reset(ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    /**
     * Convierte coordenadas de pantalla a coordenadas del mundo
     * @param {number} screenX
     * @param {number} screenY
     * @returns {{x: number, y: number}}
     */
    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.x,
            y: screenY + this.y
        };
    }

    /**
     * Convierte coordenadas del mundo a coordenadas de pantalla
     * @param {number} worldX
     * @param {number} worldY
     * @returns {{x: number, y: number}}
     */
    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    }

    /**
     * Establece los límites de la cámara
     * @param {number} minX
     * @param {number} maxX
     * @param {number} minY
     * @param {number} maxY
     */
    setBounds(minX, maxX, minY = 0, maxY = Infinity) {
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
    }

    /**
     * Activa el efecto de screen shake
     * @param {number} amount - Intensidad del shake (ej: 10)
     */
    shake(amount = 10) {
        this.shakeAmount = amount;
    }

    /**
     * Centra la cámara en una posición específica
     * @param {number} x
     * @param {number} y
     * @param {number} canvasWidth
     * @param {number} canvasHeight
     */
    centerOn(x, y, canvasWidth, canvasHeight) {
        this.targetX = x - canvasWidth / 2;
        this.targetY = y - canvasHeight / 2;
    }

    /**
     * Mueve la cámara instantáneamente (sin suavizado)
     * @param {number} x
     * @param {number} y
     */
    snapTo(x, y) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Camera;
}