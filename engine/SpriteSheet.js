// engine/SpriteSheet.js
// Clase para manejar sprite sheets (hojas de sprites)

class SpriteSheet {
    constructor(image, frameWidth, frameHeight, framesPerRow) {
        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.framesPerRow = framesPerRow;
        
        // Calcular el número total de frames
        this.totalFrames = Math.floor(image.width / frameWidth) * 
                          Math.floor(image.height / frameHeight);
    }

    /**
     * Dibuja un frame específico del sprite sheet
     * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
     * @param {number} frameIndex - Índice del frame a dibujar (0-based)
     * @param {number} x - Posición X en el canvas
     * @param {number} y - Posición Y en el canvas
     * @param {number} width - Ancho de dibujo (opcional, usa frameWidth por defecto)
     * @param {number} height - Alto de dibujo (opcional, usa frameHeight por defecto)
     * @param {boolean} flipX - Voltear horizontalmente (opcional)
     */
    drawFrame(ctx, frameIndex, x, y, width = null, height = null, flipX = false) {
        if (!this.image.complete) {
            console.warn('Imagen del sprite sheet no cargada completamente');
            return;
        }

        // Calcular la posición del frame en el sprite sheet
        const col = frameIndex % this.framesPerRow;
        const row = Math.floor(frameIndex / this.framesPerRow);
        
        const sx = col * this.frameWidth;
        const sy = row * this.frameHeight;
        
        // Usar dimensiones del frame si no se especifican
        const drawWidth = width || this.frameWidth;
        const drawHeight = height || this.frameHeight;
        
        if (flipX) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.image,
                sx, sy, this.frameWidth, this.frameHeight,
                -x - drawWidth, y, drawWidth, drawHeight
            );
            ctx.restore();
        } else {
            ctx.drawImage(
                this.image,
                sx, sy, this.frameWidth, this.frameHeight,
                x, y, drawWidth, drawHeight
            );
        }
    }

    /**
     * Obtiene el número total de frames disponibles
     */
    getFrameCount() {
        return this.totalFrames;
    }
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpriteSheet;
}