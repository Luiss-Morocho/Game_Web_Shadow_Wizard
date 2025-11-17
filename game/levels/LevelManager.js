// Gestiona la creación de niveles (plataformas, items, enemigos)

class LevelManager {
    constructor() {
        this.currentLevel = 1;
        this.OFFSET = 500;
        this.tileH = 24;
    }

    /**
     * Inicializa plataformas para el nivel actual
     */
    initPlatforms(canvas, platformImage) {
        const groundLevel = canvas.height - 170;
        
        switch(this.currentLevel) {
            case 1:
                return this.createLevel1Platforms(groundLevel, platformImage);
            case 2:
                return this.createLevel2Platforms(groundLevel, platformImage);
            case 3:
                return this.createLevel3Platforms(groundLevel, platformImage);
            default:
                return [];
        }
    }

    /**
     * Plataformas Nivel 1
     */
    createLevel1Platforms(groundLevel, img) {
        const platforms = [];
        const O = this.OFFSET;
        const tileH = this.tileH;

        // ⬇️ PLATAFORMA INICIAL (debajo del jugador al inicio)
        platforms.push(new Platform(100, groundLevel + 130, 25, img));
        
        // Resto de plataformas
        platforms.push(new Platform(400 + O, groundLevel - (tileH * 2), 10, img));
        platforms.push(new StairPlatform(700 + O, groundLevel - (tileH * 3), 1, img));
        platforms.push(new StairPlatform(748 + O, groundLevel - (tileH * 4), 1, img));
        platforms.push(new StairPlatform(796 + O, groundLevel - (tileH * 5), 1, img));
        platforms.push(new Platform(900 + O, groundLevel - (tileH * 8), 20, img));
        platforms.push(new StairPlatform(1300 + O, groundLevel - (tileH * 10), 1, img));
        platforms.push(new StairPlatform(1348 + O, groundLevel - (tileH * 12), 1, img));
        platforms.push(new StairPlatform(1396 + O, groundLevel - (tileH * 14), 1, img));
        platforms.push(new Platform(1500 + O, groundLevel - (tileH * 15), 15, img));
        platforms.push(new Platform(950 + O, groundLevel, 15, img));
        platforms.push(new Platform(1400 + O, groundLevel, 15, img));
        platforms.push(new FloatingPlatform(1900 + O, groundLevel - (tileH * 12), img));
        platforms.push(new FloatingPlatform(2000 + O, groundLevel - (tileH * 9), img));
        platforms.push(new FloatingPlatform(2100 + O, groundLevel - (tileH * 6), img));
        platforms.push(new Platform(2200 + O, groundLevel - (tileH * 3), 25, img));
        platforms.push(new Platform(3000 + O, groundLevel, 20, img));

        return platforms;
    }

    /**
     * Plataformas Nivel 2
     */
    createLevel2Platforms(groundLevel, img) {
        const platforms = [];
        const O = this.OFFSET;
        const tileH = this.tileH;

        // Plataforma inicial
        platforms.push(new Platform(100, groundLevel + 130, 25, img));

        // Escalera ascendente (3 escalones)
        platforms.push(new StairPlatform(750, groundLevel + 80, 2, img));
        platforms.push(new StairPlatform(850, groundLevel + 30, 2, img));
        platforms.push(new StairPlatform(950, groundLevel - 20, 2, img));

        // Plataforma flotante para el salto final
        platforms.push(new FloatingPlatform(1200, groundLevel - 30, img));

        // Plataforma destino
        platforms.push(new Platform(850 + O, groundLevel, 55, img));
        platforms.push(new Platform(1570 + O, groundLevel - tileH * 8, 15, img));
        platforms.push(new FloatingPlatform(2200 + O, groundLevel - tileH * 9, img));
        platforms.push(new FloatingPlatform(2300 + O, groundLevel - tileH * 11, img));
        platforms.push(new FloatingPlatform(2400 + O, groundLevel - tileH * 13, img));
        platforms.push(new Platform(2400 + O, groundLevel - tileH * 5, 6, img));
        platforms.push(new Platform(2600 + O, groundLevel - tileH * 13, 40, img));
        platforms.push(new Platform(3750 + O, groundLevel - tileH * 3, 8, img));

        return platforms;
    }

    /**
     * Plataformas Nivel 3
     */
    createLevel3Platforms(groundLevel, img) {
        const platforms = [];
        const O = this.OFFSET;
        const tileH = this.tileH;

        // ⬇️ PLATAFORMA INICIAL
        platforms.push(new Platform(100, groundLevel + 130, 25, img));
        platforms.push(new FloatingPlatform(350 + O, groundLevel, img));
        platforms.push(new FloatingPlatform(500 + O, groundLevel + 50, img));
        platforms.push(new FloatingPlatform(700 + O, groundLevel, img));
        platforms.push(new Platform(900 + O, groundLevel, 65, img));
        platforms.push(new Platform(1400 + O, groundLevel - tileH * 6, 15, img));
        platforms.push(new Platform(2000 + O, groundLevel - tileH * 10, 20, img));
        platforms.push(new Platform(2600 + O, groundLevel - tileH * 14, 15, img));
        platforms.push(new FloatingPlatform(3100 + O, groundLevel - tileH * 12, img));
        platforms.push(new FloatingPlatform(3200 + O, groundLevel - tileH * 9, img));
        platforms.push(new FloatingPlatform(3300 + O, groundLevel - tileH * 6, img));
        platforms.push(new Platform(3550 + O, groundLevel - tileH * 3, 18, img));
        platforms.push(new Platform(4200 + O, groundLevel, 10, img));

        return platforms;
    }

    /**
     * Inicializa items para el nivel actual
     */
    initItems(canvas, itemManager, coinImage, portalImage) {
        const groundLevel = canvas.height - 170;
        
        itemManager.clear();
        
        switch(this.currentLevel) {
            case 1:
                this.createLevel1Items(groundLevel, itemManager, coinImage, portalImage);
                break;
            case 2:
                this.createLevel2Items(groundLevel, itemManager, coinImage, portalImage);
                break;
            case 3:
                this.createLevel3Items(groundLevel, itemManager, coinImage, portalImage);
                break;
        }
    }

    /**
     * Items Nivel 1
     */
    createLevel1Items(groundLevel, im, coinImg, portalImg) {
        const O = this.OFFSET;
        const tileH = this.tileH;
        const coinH = 32;

        // Monedas plataforma 1
        const p1_y = groundLevel - (tileH * 2);
        im.addCoin(450 + O, p1_y - coinH, coinImg);
        im.addCoin(500 + O, p1_y - coinH, coinImg);
        im.addCoin(550 + O, p1_y - coinH, coinImg);

        // Monedas escaleras
        im.addCoin(700 + O, (groundLevel - (tileH * 3)) - coinH, coinImg);
        im.addCoin(748 + O, (groundLevel - (tileH * 4)) - coinH, coinImg);
        im.addCoin(796 + O, (groundLevel - (tileH * 5)) - coinH, coinImg);

        // Camino superior
        const p_super_y = groundLevel - (tileH * 8);
        for (let x = 950; x <= 1150; x += 50) {
            im.addCoin(x + O, p_super_y - coinH, coinImg);
        }

        // Camino inferior
        im.addCoin(1000 + O, groundLevel - coinH, coinImg);
        im.addCoin(1050 + O, groundLevel - coinH, coinImg);
        im.addCoin(1450 + O, groundLevel - coinH, coinImg);
        im.addCoin(1500 + O, groundLevel - coinH, coinImg);

        // Cima
        const p_cima_y = groundLevel - (tileH * 15);
        im.addCoin(1550 + O, p_cima_y - coinH, coinImg);
        im.addCoin(1600 + O, p_cima_y - coinH, coinImg);
        im.addCoin(1650 + O, p_cima_y - coinH, coinImg);

        // Plataforma final
        const p_final_y = groundLevel - (tileH * 3);
        im.addCoin(2250 + O, p_final_y - coinH, coinImg);
        im.addCoin(2300 + O, p_final_y - coinH, coinImg);
        im.addCoin(2350 + O, p_final_y - coinH, coinImg);

        // Portal
        const portalX = 3600 + O;
        const portalY = groundLevel - 308;
        im.setPortal(portalX, portalY, portalImg);
    }

    /**
     * Items Nivel 2
     */
    createLevel2Items(groundLevel, im, coinImg, portalImg) {
        const O = this.OFFSET;
        const tileH = this.tileH;
        const coinH = 32;

        // Suelo
        for (let x = 800; x <= 2200; x += 80) {
            im.addCoin(x + O, groundLevel - coinH - 10, coinImg);
        }

        // Plataforma media
        const y_mid = groundLevel - tileH * 9;
        for (let x = 1500; x <= 1900; x += 80) {
            im.addCoin(x + O, y_mid - coinH, coinImg);
        }

        // Escalera de monedas
        for (let i = 0; i < 6; i++) {
            im.addCoin(2150 + O + i * 80, groundLevel - (tileH * 9) - i * 45 - coinH, coinImg);
        }

        // Plataformas altas
        const y_high = groundLevel - tileH * 15;
        for (let x = 2600; x <= 3300; x += 70) {
            im.addCoin(x + O, y_high - coinH, coinImg);
        }

        // Portal
        im.setPortal(4500 + O, groundLevel - 178, portalImg);
    }

    /**
     * Items Nivel 3
     */
    createLevel3Items(groundLevel, im, coinImg, portalImg) {
        const O = this.OFFSET;
        const tileH = this.tileH;
        const coinH = 40;

        // Suelo
        for (let x = 900; x <= 2500; x += 70) {
            im.addCoin(x + O, groundLevel - coinH, coinImg);
        }

        // Plataformas intermedias
        const y_mid1 = groundLevel - tileH * 6;
        for (let x = 1400; x <= 1800; x += 80) {
            im.addCoin(x + O, y_mid1 - coinH, coinImg);
        }

        const y_mid2 = groundLevel - tileH * 10;
        for (let x = 2000; x <= 2400; x += 70) {
            im.addCoin(x + O, y_mid2 - coinH, coinImg);
        }

        // Plataforma superior
        const y_top = groundLevel - tileH * 14;
        for (let x = 2600; x <= 2900; x += 60) {
            im.addCoin(x + O, y_top - coinH, coinImg);
        }

        // Escaleras descendentes
        for (let i = 0; i < 5; i++) {
            im.addCoin(3100 + O + i * 80, groundLevel - (tileH * (12 - i * 2)) - coinH - 40, coinImg);
        }

        // Portal
        im.setPortal(4500 + O, groundLevel - 350, portalImg);
    }

    /**
     * Inicializa enemigos para el nivel actual
     */
    initEnemies(canvas, enemyManager, spriteSheet) {
        const groundLevel = canvas.height - 170;
        
        enemyManager.clear();
        
        switch(this.currentLevel) {
            case 1:
                this.createLevel1Enemies(groundLevel, enemyManager, spriteSheet);
                break;
            case 2:
                this.createLevel2Enemies(groundLevel, enemyManager, spriteSheet);
                break;
            case 3:
                this.createLevel3Enemies(groundLevel, enemyManager, spriteSheet);
                break;
        }
    }

    /**
     * Enemigos Nivel 1
     */
    createLevel1Enemies(groundLevel, em, sprite) {
        const O = this.OFFSET;
        const tileH = this.tileH;
        const enemyYOffset = 120;

        em.addEnemy(450 + O, groundLevel - (tileH * 2) - enemyYOffset, sprite, 'normal');
        em.addEnemy(1000 + O, groundLevel - (tileH * 8) - enemyYOffset, sprite, 'chaser');
        em.addEnemy(1500 + O, groundLevel - enemyYOffset, sprite, 'normal');
        em.addEnemy(1600 + O, groundLevel - (tileH * 15) - enemyYOffset, sprite, 'normal');
        em.addEnemy(1000 + O, groundLevel - enemyYOffset, sprite, 'chaser');
        em.addEnemy(2300 + O, groundLevel - (tileH * 3) - enemyYOffset, sprite, 'normal');
        em.addEnemy(3300 + O, groundLevel - enemyYOffset, sprite, 'chaser');
    }

    /**
     * Enemigos Nivel 2
     */
    createLevel2Enemies(groundLevel, em, sprite) {
        const O = this.OFFSET;
        const tileH = this.tileH;

        for (let x = 900; x <= 2000; x += 300) {
            em.addEnemy(x + O, groundLevel - 150, sprite, 'normal');
        }

        const y_mid = groundLevel - tileH * 7;
        for (let x = 1400; x <= 2200; x += 400) {
            em.addEnemy(x + O, y_mid - 150, sprite, 'normal');
        }

        const y_high = groundLevel - tileH * 12;
        for (let x = 2600; x <= 3300; x += 250) {
            em.addEnemy(x + O, y_high - 150, sprite, 'normal');
        }

        em.addEnemy(4400 + O, groundLevel - 150, sprite, 'chaser');
    }

    /**
     * Enemigos Nivel 3
     */
    createLevel3Enemies(groundLevel, em, sprite) {
        const O = this.OFFSET;
        const tileH = this.tileH;

        em.addEnemy(420 + O, groundLevel-100, sprite, 'normal');

        for (let x = 900; x <= 2300; x += 300) {
            em.addEnemy(x + O, groundLevel - 150, sprite, 'normal');
        }

        const y1 = groundLevel - tileH * 6;
        em.addEnemy(1500 + O, y1 - 150, sprite, 'chaser');
        em.addEnemy(1650 + O, y1 - 150, sprite, 'normal');

        const y2 = groundLevel - tileH * 10;
        em.addEnemy(2100 + O, y2 - 150, sprite, 'normal');
        em.addEnemy(2300 + O, y2 - 150, sprite, 'chaser');

        const y3 = groundLevel - tileH * 14;
        em.addEnemy(2600 + O, y3 - 150, sprite, 'chaser');
        em.addEnemy(2800 + O, y3 - 150, sprite, 'normal');

        for (let x = 3600; x <= 4100; x += 250) {
            em.addEnemy(x + O, groundLevel - 230, sprite, 'normal');
        }

        em.addEnemy(4300 + O, groundLevel - 180, sprite, 'chaser');
    }

    /**
     * Obtiene el tinte de color para el nivel actual
     */
    getLevelTint() {
        switch(this.currentLevel) {
            case 2:
                return "rgba(30, 60, 160, 0.40)"; // Azul
            case 3:
                return "rgba(150, 20, 20, 0.45)"; // Rojo
            default:
                return null;
        }
    }

    /**
     * Cambia al siguiente nivel
     */
    nextLevel() {
        if (this.currentLevel < 3) {
            this.currentLevel++;
            return true;
        }
        return false;
    }

    /**
     * Resetea al nivel 1
     */
    reset() {
        this.currentLevel = 1;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = LevelManager;
}