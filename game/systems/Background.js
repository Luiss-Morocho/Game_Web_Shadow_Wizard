// Sistema de fondo con parallax y efectos

class Background {
    constructor(layers) {
        this.layers = [];
        
        // Configurar capas con diferentes velocidades de parallax
        if (layers.layer1) {
            this.layers.push({
                image: layers.layer1,
                x: 0,
                speed: 0.3,
                name: 'layer1'
            });
        }
        
        if (layers.layer2) {
            this.layers.push({
                image: layers.layer2,
                x: 0,
                speed: 0.5,
                name: 'layer2'
            });
        }
        
        if (layers.layer3) {
            this.layers.push({
                image: layers.layer3,
                x: 0,
                speed: 0.8,
                name: 'layer3'
            });
        }
    }

    /**
     * Actualiza la posición de las capas según la cámara
     * @param {number} cameraX - Posición X de la cámara
     */
    update(cameraX) {
        this.layers.forEach(layer => {
            layer.x = cameraX * layer.speed;
        });
    }

    /**
     * Dibuja todas las capas de fondo
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} canvasWidth
     * @param {number} canvasHeight
     */
    draw(ctx, canvasWidth, canvasHeight) {
        this.layers.forEach(layer => {
            if (!layer.image || !layer.image.complete) return;

            const offset = layer.x % canvasWidth;

            // Dibujar dos copias para el efecto seamless (sin costuras)
            ctx.drawImage(
                layer.image,
                -offset,
                0,
                canvasWidth,
                canvasHeight
            );

            ctx.drawImage(
                layer.image,
                -offset + canvasWidth,
                0,
                canvasWidth,
                canvasHeight
            );
        });
    }

    /**
     * Aplica un tinte de color al fondo
     * @param {CanvasRenderingContext2D} ctx
     * @param {string} color - Color en formato rgba
     * @param {number} canvasWidth
     * @param {number} canvasHeight
     */
    applyTint(ctx, color, canvasWidth, canvasHeight) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
    }

    /**
     * Establece una nueva velocidad de parallax para una capa
     * @param {number} layerIndex - Índice de la capa (0-2)
     * @param {number} speed - Nueva velocidad
     */
    setLayerSpeed(layerIndex, speed) {
        if (this.layers[layerIndex]) {
            this.layers[layerIndex].speed = speed;
        }
    }

    /**
     * Resetea las posiciones de todas las capas
     */
    reset() {
        this.layers.forEach(layer => {
            layer.x = 0;
        });
    }

    /**
     * Agrega una nueva capa de fondo
     * @param {Image} image
     * @param {number} speed
     * @param {string} name
     */
    addLayer(image, speed, name = 'custom') {
        this.layers.push({
            image: image,
            x: 0,
            speed: speed,
            name: name
        });
    }

    /**
     * Elimina una capa por nombre
     * @param {string} name
     */
    removeLayer(name) {
        this.layers = this.layers.filter(layer => layer.name !== name);
    }

    /**
     * Obtiene el número de capas
     */
    getLayerCount() {
        return this.layers.length;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Background;
}