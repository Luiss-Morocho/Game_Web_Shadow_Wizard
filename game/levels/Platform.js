// Clases de plataformas

class Platform {
    constructor(x, y, tileCount, image) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.tileCount = Math.max(tileCount, 2);
        this.tileWidth = 24;
        this.tileHeight = 24;

        this.topLeft_sx = 0;
        this.topMid_sx = 24;
        this.topRight_sx = 48;
        this.top_sy = 0;
        this.botLeft_sx = 0;
        this.botMid_sx = 24;
        this.botRight_sx = 48;
        this.bot_sy = 24;

        this.width = this.tileCount * this.tileWidth;
        this.height = 2 * this.tileHeight;
    }

    draw(ctx) {
        // Esquina superior izquierda
        ctx.drawImage(
            this.image,
            this.topLeft_sx, this.top_sy, this.tileWidth, this.tileHeight,
            this.x, this.y, this.tileWidth, this.tileHeight
        );

        // Esquina inferior izquierda
        ctx.drawImage(
            this.image,
            this.botLeft_sx, this.bot_sy, this.tileWidth, this.tileHeight,
            this.x, this.y + this.tileHeight, this.tileWidth, this.tileHeight
        );

        // Tiles del medio
        for (let i = 1; i < this.tileCount - 1; i++) {
            let currentX = this.x + (i * this.tileWidth);
            
            // Tile superior
            ctx.drawImage(
                this.image,
                this.topMid_sx, this.top_sy, this.tileWidth, this.tileHeight,
                currentX, this.y, this.tileWidth, this.tileHeight
            );
            
            // Tile inferior
            ctx.drawImage(
                this.image,
                this.botMid_sx, this.bot_sy, this.tileWidth, this.tileHeight,
                currentX, this.y + this.tileHeight, this.tileWidth, this.tileHeight
            );
        }

        // Esquina superior derecha
        let rightEdgeX = this.x + (this.tileCount - 1) * this.tileWidth;
        ctx.drawImage(
            this.image,
            this.topRight_sx, this.top_sy, this.tileWidth, this.tileHeight,
            rightEdgeX, this.y, this.tileWidth, this.tileHeight
        );

        // Esquina inferior derecha
        ctx.drawImage(
            this.image,
            this.botRight_sx, this.bot_sy, this.tileWidth, this.tileHeight,
            rightEdgeX, this.y + this.tileHeight, this.tileWidth, this.tileHeight
        );
    }
}

class FloatingPlatform {
    constructor(x, y, image) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.tileWidth = 24;
        this.tileHeight = 24;

        this.top_sx = 144;
        this.top_sy = 0;
        this.bot_sx = 144;
        this.bot_sy = 24;

        this.width = this.tileWidth;
        this.height = this.tileHeight * 2;
    }

    draw(ctx) {
        // Tile superior
        ctx.drawImage(
            this.image,
            this.top_sx, this.top_sy, this.tileWidth, this.tileHeight,
            this.x, this.y, this.tileWidth, this.tileHeight
        );

        // Tile inferior
        ctx.drawImage(
            this.image,
            this.bot_sx, this.bot_sy, this.tileWidth, this.tileHeight,
            this.x, this.y + this.tileHeight, this.tileWidth, this.tileHeight
        );
    }
}

class StairPlatform {
    constructor(x, y, tileCount, image) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.tileCount = Math.max(tileCount, 1);
        this.tileWidth = 24;
        this.tileHeight = 24;

        this.topLeft_sx = 0;
        this.topMid_sx = 24;
        this.topRight_sx = 48;
        this.top_sy = 0;

        this.width = this.tileCount * this.tileWidth;
        this.height = this.tileHeight;
    }

    draw(ctx) {
        // Tile izquierdo
        ctx.drawImage(
            this.image,
            this.topLeft_sx, this.top_sy, this.tileWidth, this.tileHeight,
            this.x, this.y, this.tileWidth, this.tileHeight
        );

        // Tiles del medio
        for (let i = 1; i < this.tileCount - 1; i++) {
            let currentX = this.x + (i * this.tileWidth);
            ctx.drawImage(
                this.image,
                this.topMid_sx, this.top_sy, this.tileWidth, this.tileHeight,
                currentX, this.y, this.tileWidth, this.tileHeight
            );
        }

        // Tile derecho (solo si hay más de 1 tile)
        if (this.tileCount > 1) {
            let rightEdgeX = this.x + (this.tileCount - 1) * this.tileWidth;
            ctx.drawImage(
                this.image,
                this.topRight_sx, this.top_sy, this.tileWidth, this.tileHeight,
                rightEdgeX, this.y, this.tileWidth, this.tileHeight
            );
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Platform, FloatingPlatform, StairPlatform };
}