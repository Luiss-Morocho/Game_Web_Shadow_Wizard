// engine/Entity.js
// Clase base para todas las entidades del juego

class Entity {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.active = true;
    }

    /**
     * Actualiza la lógica de la entidad
     * @param {number} deltaTime - Tiempo desde el último frame
     */
    update(deltaTime) {
        // Override en subclases
    }

    /**
     * Dibuja la entidad en el canvas
     * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
     */
    draw(ctx) {
        // Override en subclases
    }

    /**
     * Verifica colisión con otra entidad (AABB - Axis-Aligned Bounding Box)
     * @param {Entity} other - Otra entidad
     * @returns {boolean}
     */
    collidesWith(other) {
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }

    /**
     * Obtiene el centro de la entidad
     * @returns {{x: number, y: number}}
     */
    getCenter() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
    }

    /**
     * Obtiene la distancia al centro de otra entidad
     * @param {Entity} other
     * @returns {number}
     */
    distanceTo(other) {
        const myCenter = this.getCenter();
        const otherCenter = other.getCenter();
        const dx = otherCenter.x - myCenter.x;
        const dy = otherCenter.y - myCenter.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Verifica si la entidad está visible en la cámara
     * @param {number} cameraX - Posición X de la cámara
     * @param {number} canvasWidth - Ancho del canvas
     * @returns {boolean}
     */
    isVisible(cameraX, canvasWidth) {
        return (
            this.x + this.width > cameraX &&
            this.x < cameraX + canvasWidth
        );
    }

    /**
     * Establece la posición de la entidad
     * @param {number} x
     * @param {number} y
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Mueve la entidad por un delta
     * @param {number} dx - Delta X
     * @param {number} dy - Delta Y
     */
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Entity;
}