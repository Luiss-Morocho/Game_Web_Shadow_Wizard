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
        ctx.drawImage(this.image, this.topLeft_sx, this.top_sy, this.tileWidth, this.tileHeight, this.x, this.y, this.tileWidth, this.tileHeight);
        ctx.drawImage(this.image, this.botLeft_sx, this.bot_sy, this.tileWidth, this.tileHeight, this.x, this.y + this.tileHeight, this.tileWidth, this.tileHeight);

        for (let i = 1; i < this.tileCount - 1; i++) {
            let currentX = this.x + (i * this.tileWidth);
            ctx.drawImage(this.image, this.topMid_sx, this.top_sy, this.tileWidth, this.tileHeight, currentX, this.y, this.tileWidth, this.tileHeight);
            ctx.drawImage(this.image, this.botMid_sx, this.bot_sy, this.tileWidth, this.tileHeight, currentX, this.y + this.tileHeight, this.tileWidth, this.tileHeight);
        }

        let rightEdgeX = this.x + (this.tileCount - 1) * this.tileWidth;
        ctx.drawImage(this.image, this.topRight_sx, this.top_sy, this.tileWidth, this.tileHeight, rightEdgeX, this.y, this.tileWidth, this.tileHeight);
        ctx.drawImage(this.image, this.botRight_sx, this.bot_sy, this.tileWidth, this.tileHeight, rightEdgeX, this.y + this.tileHeight, this.tileWidth, this.tileHeight);
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
        ctx.drawImage(this.image, this.top_sx, this.top_sy, this.tileWidth, this.tileHeight, this.x, this.y, this.tileWidth, this.tileHeight);
        ctx.drawImage(this.image, this.bot_sx, this.bot_sy, this.tileWidth, this.tileHeight, this.x, this.y + this.tileHeight, this.tileWidth, this.tileHeight);
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
        ctx.drawImage(this.image, this.topLeft_sx, this.top_sy, this.tileWidth, this.tileHeight, this.x, this.y, this.tileWidth, this.tileHeight);
        for (let i = 1; i < this.tileCount - 1; i++) {
            let currentX = this.x + (i * this.tileWidth);
            ctx.drawImage(this.image, this.topMid_sx, this.top_sy, this.tileWidth, this.tileHeight, currentX, this.y, this.tileWidth, this.tileHeight);
        }
        if (this.tileCount > 1) {
            let rightEdgeX = this.x + (this.tileCount - 1) * this.tileWidth;
            ctx.drawImage(this.image, this.topRight_sx, this.top_sy, this.tileWidth, this.tileHeight, rightEdgeX, this.y, this.tileWidth, this.tileHeight);
        }
    }
}

let platforms = [];
window.platforms = platforms;

function initPlatforms(canvas, ctx, platformImage) {
    platforms = [];

    const OFFSET = 500; // <<=== NUEVO DESPLAZAMIENTO GLOBAL
    const playerHeight = 170;
    const groundLevel = canvas.height - playerHeight;
    const tileH = 24;

    platforms.push(new Platform(400 + OFFSET, groundLevel - (tileH * 2), 10, platformImage));

    platforms.push(new StairPlatform(700 + OFFSET, groundLevel - (tileH * 3), 1, platformImage));
    platforms.push(new StairPlatform(748 + OFFSET, groundLevel - (tileH * 4), 1, platformImage));
    platforms.push(new StairPlatform(796 + OFFSET, groundLevel - (tileH * 5), 1, platformImage));

    platforms.push(new Platform(900 + OFFSET, groundLevel - (tileH * 8), 20, platformImage));

    platforms.push(new StairPlatform(1300 + OFFSET, groundLevel - (tileH * 10), 1, platformImage));
    platforms.push(new StairPlatform(1348 + OFFSET, groundLevel - (tileH * 12), 1, platformImage));
    platforms.push(new StairPlatform(1396 + OFFSET, groundLevel - (tileH * 14), 1, platformImage));

    platforms.push(new Platform(1500 + OFFSET, groundLevel - (tileH * 15), 15, platformImage));

    platforms.push(new Platform(950 + OFFSET, groundLevel, 15, platformImage));
    platforms.push(new Platform(1400 + OFFSET, groundLevel, 15, platformImage));

    platforms.push(new FloatingPlatform(1900 + OFFSET, groundLevel - (tileH * 12), platformImage));
    platforms.push(new FloatingPlatform(2000 + OFFSET, groundLevel - (tileH * 9), platformImage));
    platforms.push(new FloatingPlatform(2100 + OFFSET, groundLevel - (tileH * 6), platformImage));

    platforms.push(new Platform(2200 + OFFSET, groundLevel - (tileH * 3), 25, platformImage));

    platforms.push(new Platform(3000 + OFFSET, groundLevel, 10, platformImage));

    window.platforms = platforms;
}

// ======================================================
// INICIALIZAR PLATAFORMAS NIVEL 2
// ======================================================
function initPlatformsLevel2(canvas, ctx, platformImage) {
    platforms = [];

    const OFFSET = 500;
    const playerHeight = 170;
    const groundLevel = canvas.height - playerHeight;
    const tileH = 24;

    // Camino inferior más largo
    platforms.push(
        new Platform(
            900 + OFFSET,
            groundLevel,
            20,
            platformImage
        )
    );

    // Plataforma media izquierda (para saltos desde el suelo)
    platforms.push(
        new Platform(
            1300 + OFFSET,
            groundLevel - tileH * 5,
            6,
            platformImage
        )
    );

    // Plataforma alta central
    platforms.push(
        new Platform(
            1600 + OFFSET,
            groundLevel - tileH * 8,
            10,
            platformImage
        )
    );

    // Escaleras flotantes hacia la derecha (parkour vertical)
    platforms.push(new FloatingPlatform(2100 + OFFSET, groundLevel - tileH * 9, platformImage));
    platforms.push(new FloatingPlatform(2200 + OFFSET, groundLevel - tileH * 11, platformImage));
    platforms.push(new FloatingPlatform(2300 + OFFSET, groundLevel - tileH * 13, platformImage));

    // Plataforma superior derecha grande
    platforms.push(
        new Platform(
            2500 + OFFSET,
            groundLevel - tileH * 13,
            12,
            platformImage
        )
    );

    // Pequeña plataforma antes del portal (para que no sea solo caminar recto)
    platforms.push(
        new Platform(
            4000 + OFFSET,
            groundLevel - tileH * 3,
            8,
            platformImage
        )
    );

    window.platforms = platforms;
    console.log(`Plataformas nivel 2: ${window.platforms.length} creadas.`);
}

// ======================================================
// PLATAFORMAS NIVEL 3 (Rojo Infernal)
// ======================================================
function initPlatformsLevel3(canvas, ctx, platformImage) {
    platforms = [];

    const OFFSET = 500;
    const tileH = 24;
    const playerHeight = 170;
    const groundLevel = canvas.height - playerHeight;

    // Camino inferior EXTREMADAMENTE largo
    platforms.push(
        new Platform(
            900 + OFFSET,
            groundLevel,
            40, // larguísimo
            platformImage
        )
    );

    // Plataforma media izquierda
    platforms.push(
        new Platform(
            1400 + OFFSET,
            groundLevel - tileH * 6,
            8,
            platformImage
        )
    );

    // Plataforma media alta
    platforms.push(
        new Platform(
            2000 + OFFSET,
            groundLevel - tileH * 10,
            10,
            platformImage
        )
    );

    // Plataforma superior central
    platforms.push(
        new Platform(
            2600 + OFFSET,
            groundLevel - tileH * 14,
            8,
            platformImage
        )
    );

    // Escaleras de descenso
    platforms.push(new FloatingPlatform(3000 + OFFSET, groundLevel - tileH * 12, platformImage));
    platforms.push(new FloatingPlatform(3100 + OFFSET, groundLevel - tileH * 9, platformImage));
    platforms.push(new FloatingPlatform(3200 + OFFSET, groundLevel - tileH * 6, platformImage));

    // Plataforma final antes del portal
    platforms.push(
        new Platform(
            3500 + OFFSET,
            groundLevel - tileH * 3,
            12,
            platformImage
        )
    );

    // Plataforma del portal
    platforms.push(
        new Platform(
            4200 + OFFSET,
            groundLevel,
            10,
            platformImage
        )
    );

    window.platforms = platforms;
    console.log(`Plataformas nivel 3: ${window.platforms.length} creadas.`);
}