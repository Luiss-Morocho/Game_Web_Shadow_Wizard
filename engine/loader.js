// engine/loader.js
// Carga de recursos con soporte para sprite sheets

const resources = {
    backgroundLayer1: 'assets/background/background_layer_1.png',
    backgroundLayer2: 'assets/background/background_layer_2.png',
    backgroundLayer3: 'assets/background/background_layer_3.png',
    
    // Sprite sheets del jugador
    playerIdle: 'assets/character/idle.png',
    playerWalk: 'assets/character/walk.png',
    playerJump: 'assets/character/jump.png',
    
    // Sprite sheet de enemigos
    enemySprite: 'assets/character/enemy.png',
    
    // Decoraciones (por si las usas después)
    shop: 'assets/decorations/shop.png',
    lamp: 'assets/decorations/lamp.png',
    
    // Tileset
    tileset: 'assets/oak_woods_tileset.png',

    // Items
    coin: 'assets/items/coin.png',
    powerup: 'assets/items/powerup.png',

    // Portal
    portalImage: 'assets/portal/portalx.png'
};

/**
 * CONFIGURACIÓN DE SPRITE SHEETS
 * Ajusta estos valores según tus imágenes reales
 */
const SPRITE_CONFIG = {
    playerWalk: {
        frameWidth: 512,    // Ancho de cada frame
        frameHeight: 512,   // Alto de cada frame
        framesPerRow: 20   // Frames por fila en la imagen
    },
    playerJump: {
        frameWidth: 512,
        frameHeight: 512,
        framesPerRow: 8
    },
    playerIdle: {
        frameWidth: 512,
        frameHeight: 512,
        framesPerRow: 20
    },
    enemySprite: {
        frameWidth: 519,
        frameHeight: 512,
        framesPerRow: 5
    }
};

let loadedResources = 0;
const totalResources = Object.keys(resources).length;

/**
 * Carga todos los recursos
 * @param {Function} callback - Función a ejecutar cuando todo esté cargado
 */
function loadResources(callback) {
    const cacheBuster = Date.now();
    const loadedImages = {};

    for (let key in resources) {
        const img = new Image();
        img.src = `${resources[key]}?v=${cacheBuster}`;
        
        img.onload = function() {
            loadedResources++;
            loadedImages[key] = img;
            
            console.log(`${key} cargado (${loadedResources}/${totalResources})`);
            
            if (loadedResources === totalResources) {
                console.log('Todos los recursos cargados. Inicializando sprite sheets...');
                
                // Inicializar sprite sheets
                const spriteSheets = initializeSpriteSheets(loadedImages);
                
                // Combinar imágenes y sprite sheets
                const allResources = {
                    ...loadedImages,
                    ...spriteSheets
                };
                
                callback(allResources);
            }
        };
        
        img.onerror = function() {
            console.error(`ERROR: No se pudo cargar ${key} desde ${resources[key]}`);
            console.error('Verifica que la ruta del archivo sea correcta.');
        };
    }
}

/**
 * Inicializa los objetos SpriteSheet después de cargar las imágenes
 * @param {Object} images - Objeto con todas las imágenes cargadas
 * @returns {Object} - Objeto con los SpriteSheets creados
 */
function initializeSpriteSheets(images) {
    const sheets = {};
    
    // Crear sprite sheet de caminar
    if (images.playerWalk) {
        sheets.playerWalkSheet = new SpriteSheet(
            images.playerWalk,
            SPRITE_CONFIG.playerWalk.frameWidth,
            SPRITE_CONFIG.playerWalk.frameHeight,
            SPRITE_CONFIG.playerWalk.framesPerRow
        );
        console.log(`  - playerWalkSheet: ${sheets.playerWalkSheet.getFrameCount()} frames`);
    }
    
    // Crear sprite sheet de salto
    if (images.playerJump) {
        sheets.playerJumpSheet = new SpriteSheet(
            images.playerJump,
            SPRITE_CONFIG.playerJump.frameWidth,
            SPRITE_CONFIG.playerJump.frameHeight,
            SPRITE_CONFIG.playerJump.framesPerRow
        );
        console.log(`  - playerJumpSheet: ${sheets.playerJumpSheet.getFrameCount()} frames`);
    }
    
    // Crear sprite sheet idle
    if (images.playerIdle) {
        sheets.playerIdleSheet = new SpriteSheet(
            images.playerIdle,
            SPRITE_CONFIG.playerIdle.frameWidth,
            SPRITE_CONFIG.playerIdle.frameHeight,
            SPRITE_CONFIG.playerIdle.framesPerRow
        );
        console.log(`  - playerIdleSheet: ${sheets.playerIdleSheet.getFrameCount()} frames`);
    }
    
    // Crear sprite sheet de enemigo
    if (images.enemySprite) {
        sheets.enemySpriteSheet = new SpriteSheet(
            images.enemySprite,
            SPRITE_CONFIG.enemySprite.frameWidth,
            SPRITE_CONFIG.enemySprite.frameHeight,
            SPRITE_CONFIG.enemySprite.framesPerRow
        );
        console.log(`  - enemySpriteSheet: ${sheets.enemySpriteSheet.getFrameCount()} frames`);
    }
    
    return sheets;
}

/**
 * Utilidad para obtener información de una imagen cargada
 * Útil para debugging
 */
function getImageInfo(image) {
    if (!image || !image.complete) {
        return "Imagen no cargada";
    }
    return `${image.width}x${image.height}px`;
}