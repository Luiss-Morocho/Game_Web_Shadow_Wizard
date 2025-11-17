// Clase principal del juego CON AUDIO

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Inicializar sistemas
        this.camera = new Camera();
        this.projectileSystem = new ProjectileSystem();
        this.itemManager = new ItemManager();
        this.enemyManager = new EnemyManager();
        this.levelManager = new LevelManager();
        this.audioManager = new AudioManager();

        // Estado del juego
        this.score = 0;
        this.lives = 3;
        this.enemiesKilled = 0;
        this.gameTimeInSeconds = 0;
        this.timerInterval = null;

        // Feed online (mensajes recibidos por WebSocket)
        this.onlineFeed = [];

        // Power-ups
        this.powerUpSpawnCounter = 0;
        this.powerUpSpawnInterval = 60 * 20; // 20 segundos

        // Controles
        this.keys = {};
        this.setupControls();

        // Nivel
        this.platforms = [];
        this.groundLevel = canvas.height - 170;

        // Player
        this.player = null;

        // Background
        this.background = null;

        // Resize
        window.addEventListener('resize', () => this.resizeCanvas());

        // Precargar audio
        this.audioManager.preloadAll();
    }

    init(resources) {
        this.player = new Player(100, this.groundLevel, {
            idle: resources.playerIdleSheet,
            walk: resources.playerWalkSheet,
            jump: resources.playerJumpSheet
        });

        this.background = new Background({
            layer1: resources.backgroundLayer1,
            layer2: resources.backgroundLayer2,
            layer3: resources.backgroundLayer3
        });

        this.resources = resources;
        this.loadLevel();
    }

    setupControls() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;

            // Disparar
            if ((e.key === 'd' || e.key === 'D' || e.key === 'f' || e.key === 'F') &&
                window.currentState === window.states.PLAYING) {
                this.projectileSystem.shoot(this.player, this.levelManager.currentLevel);
                this.audioManager.playSound('shoot');
            }

            // Toggle FPS monitor
            if (e.key === '3' && window.performanceMonitor) {
                window.performanceMonitor.toggle();
            }

            // Toggle mute
            if (e.key === '1') {
                this.audioManager.toggleMute();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    loadLevel() {
        this.resizeCanvas();

        this.camera.x = 0;
        this.camera.targetX = 0;
        this.projectileSystem.clear();
        this.itemManager.clear();
        this.enemyManager.clear();

        this.platforms = this.levelManager.initPlatforms(
            this.canvas,
            this.resources.tileset
        );

        this.levelManager.initItems(
            this.canvas,
            this.itemManager,
            this.resources.coin,
            this.resources.portalImage
        );

        this.levelManager.initEnemies(
            this.canvas,
            this.enemyManager,
            this.resources.enemySpriteSheet
        );

        // Reproducir música del nivel
        const musicKey = `level${this.levelManager.currentLevel}`;
        this.audioManager.playMusic(musicKey);

        console.log(`Nivel ${this.levelManager.currentLevel} cargado`);
        console.log(`- Plataformas: ${this.platforms.length}`);
        console.log(`- Monedas: ${this.itemManager.getCoinCount()}`);
        console.log(`- Enemigos: ${this.enemyManager.getAliveCount()}`);
        console.log(`- Portal activo: ${this.itemManager.portal ? 'Sí' : 'No'}`);
    }

    reset() {
        this.score = 0;
        this.lives = 3;
        this.enemiesKilled = 0;
        this.gameTimeInSeconds = 0;
        this.powerUpSpawnCounter = 0;

        if (this.player) {
            this.player.reset(100, this.groundLevel);
            this.player.lives = 3;
        }

        this.loadLevel();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.groundLevel = this.canvas.height - 170;
    }

    update() {
        if (window.currentState !== window.states.PLAYING) return;

        this.player.update(this.keys, this.groundLevel, this.platforms);
        this.player.updatePowerUp();

        this.camera.follow(this.player, this.canvas.width);
        this.camera.update();

        this.background.update(this.camera.x);

        this.projectileSystem.update(this.camera.x, this.canvas.width);

        this.itemManager.update(this.canvas.height);

        this.enemyManager.update(this.player);

        this.handleCollisions();

        this.handlePowerUpSpawn();

        window.cameraX = this.camera.x;
    }

    handleCollisions() {
        // 1. Colisiones con items
        const itemCollisions = this.itemManager.checkCollisions(this.player);

        if (itemCollisions.score > 0) {
            this.score += itemCollisions.score;
            this.audioManager.playSound('coin');
        }

        if (itemCollisions.powerUpCollected) {
            this.player.activatePowerUp();
            this.audioManager.playSound('powerup');
        }

        if (itemCollisions.portalEntered) {
            this.audioManager.playSound('portal');
            console.log('¡Nivel completado desde Game.js!');
            setTimeout(() => {
                this.onLevelComplete();
            }, 100);
        }

        // 2. Colisiones proyectil-enemigo
        const activeProjectiles = this.projectileSystem.getProjectiles();
        const projectileHits = this.enemyManager.checkProjectileCollisions(activeProjectiles);

        if (projectileHits.enemiesKilled > 0) {
            this.enemiesKilled += projectileHits.enemiesKilled;
            this.score += projectileHits.enemiesKilled * 50;
            this.audioManager.playSound('enemy-death');
            console.log(`Total enemigos eliminados: ${this.enemiesKilled}`);
        }

        if (projectileHits.hitProjectiles.length > 0) {
            this.projectileSystem.removeProjectiles(projectileHits.hitProjectiles);
        }

        // 3. Colisiones jugador-enemigo
        const playerHit = this.enemyManager.checkPlayerCollision(this.player);
        if (playerHit) {
            const died = this.player.takeDamage(1);
            this.audioManager.playSound('damage');
            if (died) {
                this.onGameOver();
            }
        }
    }

    handlePowerUpSpawn() {
        this.powerUpSpawnCounter++;

        if (this.powerUpSpawnCounter >= this.powerUpSpawnInterval) {
            this.powerUpSpawnCounter = 0;

            if (this.itemManager.powerUps.length === 0) {
                this.itemManager.spawnPowerUp(
                    this.camera.x,
                    this.canvas.width,
                    this.resources.powerup
                );
            }
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.background.draw(this.ctx, this.canvas.width, this.canvas.height);

        const tint = this.levelManager.getLevelTint();
        if (tint) {
            this.background.applyTint(this.ctx, tint, this.canvas.width, this.canvas.height);
        }

        this.ctx.save();
        this.camera.apply(this.ctx);

        this.itemManager.draw(this.ctx);

        this.platforms.forEach(p => p.draw(this.ctx));

        this.enemyManager.draw(this.ctx);

        this.player.draw(this.ctx);

        this.projectileSystem.draw(this.ctx);

        if (this.levelManager.currentLevel === 1 && this.camera.x < 400) {
            this.drawTutorial();
        }

        this.ctx.restore();

        // Dibujar el feed online en coordenadas de pantalla (sin cámara)
        this.drawOnlineFeed();
    }

    drawTutorial() {
        const x = 150;
        const y = this.groundLevel - 250;
        const lineHeight = 30;

        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 26px Arial";
        this.ctx.textAlign = "left";
        this.ctx.shadowColor = "black";
        this.ctx.shadowBlur = 5;

        this.ctx.fillText("¿Cómo Jugar?", x, y);
        this.ctx.font = "20px Arial";
        this.ctx.fillText("- Flechas = Moverse", x, y + lineHeight * 2);
        this.ctx.fillText("- Espacio = Saltar", x, y + lineHeight * 3);
        this.ctx.fillText("- Tecla 'D' = Disparar", x, y + lineHeight * 4);
        this.ctx.fillText("- Tecla 'M' = Misiones", x, y + lineHeight * 5);
        this.ctx.fillText("- 1 = Mute Audio", x, y + lineHeight * 6);
        this.ctx.font = "18px Arial";
        this.ctx.fillText("¡Recoge monedas y elimina enemigos!", x, y + lineHeight * 8);
        this.ctx.fillText("¡Coge la burbuja para un disparo potenciado!", x, y + lineHeight * 9);
        this.ctx.shadowBlur = 0;
    }

    // Panel del apartado online
    drawOnlineFeed() {
        if (!this.onlineFeed || this.onlineFeed.length === 0) return;

        const ctx = this.ctx;
        const panelY = 60; // <- más abajo para no tapar las vidas

        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = '#000';
        ctx.fillRect(10, panelY, 340, 110); // panel negro

        ctx.globalAlpha = 1;
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';

        ctx.fillText('ONLINE FEED', 20, panelY + 20);

        let y = panelY + 40;
        for (const msg of this.onlineFeed) {
            const level = (msg.level !== undefined && msg.level !== null) ? msg.level : '?';
            const player = (msg.player !== undefined && msg.player !== null) ? msg.player : 'Anon';
            const score = (msg.score !== undefined && msg.score !== null) ? msg.score : 0;

            const text = `Lv ${level} - ${player}: ${score} pts`;
            ctx.fillText(text, 20, y);
            y += 18;
        }

        ctx.restore();
    }



    onLevelComplete() {
        this.audioManager.playSound('level-complete');
        console.log("onLevelComplete llamado - cambiando estado...");
    }

    onGameOver() {
        this.audioManager.stopMusic();
        console.log("Game Over!");
    }

    startTimer(callback) {
        if (this.timerInterval) clearInterval(this.timerInterval);

        this.gameTimeInSeconds = 0;
        this.timerInterval = setInterval(() => {
            this.gameTimeInSeconds++;
            if (callback) callback(this.gameTimeInSeconds);
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    nextLevel() {
        const hasNext = this.levelManager.nextLevel();

        if (hasNext) {
            this.loadLevel();
            this.player.reset(100, this.groundLevel);
            return true;
        }

        return false;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Game;
}