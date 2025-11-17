window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // ======================================================
    // CLASES DE ITEMS
    // ======================================================

    window.coins = [];
    window.powerups = [];
    window.portal = null; // Objeto portal del nivel

    class Coin {
        constructor(x, y, image) {
            this.x = x;
            this.y = y;
            this.image = image;
            this.width = 32;
            this.height = 32;
            this.isCollected = false;
        }
        draw(ctx) {
            if (!this.isCollected) {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            }
        }
    }

    class PowerUp {
        constructor(x, y, image) {
            this.x = x;
            this.y = y;
            this.image = image;
            this.width = 140;
            this.height = 100;
            this.speedY = 1.0;
            this.isCollected = false;
        }
        update(canvas) {
            this.y += this.speedY;
            if (this.y > canvas.height) {
                this.isCollected = true;
            }
        }
        draw(ctx) {
            if (!this.isCollected) {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            }
        }
    }

    class Portal {
        constructor(x, y, image) {
            this.x = x;
            this.y = y;
            this.image = image;
            this.width = 275;
            this.height = 300;
        }
        draw(ctx) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    // ======================================================
    // ITEMS NIVEL 1
    // ======================================================
    function initItems(canvas, coinImage, portalImage) {
        window.coins = [];
        window.powerups = [];
        window.portal = null;

        const OFFSET = 500;
        const tileH = 24;
        const groundLevel = canvas.height - 170; // altura del jugador
        const coinHeight = 32;

        // Monedas plataforma 1
        const p1_y = groundLevel - (tileH * 2);
        window.coins.push(new Coin(450 + OFFSET, p1_y - coinHeight, coinImage));
        window.coins.push(new Coin(500 + OFFSET, p1_y - coinHeight, coinImage));
        window.coins.push(new Coin(550 + OFFSET, p1_y - coinHeight, coinImage));

        // Monedas escaleras
        window.coins.push(new Coin(700 + OFFSET, (groundLevel - (tileH * 3)) - coinHeight, coinImage));
        window.coins.push(new Coin(748 + OFFSET, (groundLevel - (tileH * 4)) - coinHeight, coinImage));
        window.coins.push(new Coin(796 + OFFSET, (groundLevel - (tileH * 5)) - coinHeight, coinImage));

        // Monedas camino superior
        const p_super_y = groundLevel - (tileH * 8);
        window.coins.push(new Coin(950 + OFFSET, p_super_y - coinHeight, coinImage));
        window.coins.push(new Coin(1000 + OFFSET, p_super_y - coinHeight, coinImage));
        window.coins.push(new Coin(1050 + OFFSET, p_super_y - coinHeight, coinImage));
        window.coins.push(new Coin(1100 + OFFSET, p_super_y - coinHeight, coinImage));
        window.coins.push(new Coin(1150 + OFFSET, p_super_y - coinHeight, coinImage));

        // Monedas camino inferior
        const p_inferior_y = groundLevel;
        window.coins.push(new Coin(1000 + OFFSET, p_inferior_y - coinHeight, coinImage));
        window.coins.push(new Coin(1050 + OFFSET, p_inferior_y - coinHeight, coinImage));
        window.coins.push(new Coin(1450 + OFFSET, p_inferior_y - coinHeight, coinImage));
        window.coins.push(new Coin(1500 + OFFSET, p_inferior_y - coinHeight, coinImage));

        // Monedas cima
        const p_cima_y = groundLevel - (tileH * 15);
        window.coins.push(new Coin(1550 + OFFSET, p_cima_y - coinHeight, coinImage));
        window.coins.push(new Coin(1600 + OFFSET, p_cima_y - coinHeight, coinImage));
        window.coins.push(new Coin(1650 + OFFSET, p_cima_y - coinHeight, coinImage));

        // Monedas plataforma final
        const p_final_y = groundLevel - (tileH * 3);
        window.coins.push(new Coin(2250 + OFFSET, p_final_y - coinHeight, coinImage));
        window.coins.push(new Coin(2300 + OFFSET, p_final_y - coinHeight, coinImage));
        window.coins.push(new Coin(2350 + OFFSET, p_final_y - coinHeight, coinImage));

        const portalWidth = 128;
        const portalHeight = 128;

        let portalX = 3600 + OFFSET; // si quieres más lejos, aumenta este valor
        const portalY = groundLevel + (170 - portalHeight) - 180; // base alineada con pies del player

        if (portalImage) {
            window.portal = new Portal(portalX, portalY, portalImage);
            console.log(`(Nivel 1) Items: ${window.coins.length} monedas y 1 portal.`);
        } else {
            console.log(`(Nivel 1) Items: ${window.coins.length} monedas. (Portal no cargado)`);
        }
    }

    // ======================================================
    // ITEMS NIVEL 2
    // ======================================================
    function initItemsLevel2(canvas, coinImage, portalImage) {
        window.coins = [];
        window.powerups = [];
        window.portal = null;

        const OFFSET = 500;
        const tileH = 24;
        const groundLevel = canvas.height - 170;
        const coinHeight = 32;

        // -------------------------
        // MONEDAS EN EL SUELO
        // -------------------------
        for (let x = 800; x <= 2200; x += 80) {
            window.coins.push(new Coin(x + OFFSET, groundLevel - coinHeight, coinImage));
        }

        // -------------------------
        // PLATAFORMA MEDIA
        // -------------------------
        const y_mid = groundLevel - tileH * 7;
        for (let x = 1500; x <= 1900; x += 80) {
            window.coins.push(new Coin(x + OFFSET, y_mid - coinHeight, coinImage));
        }

        // -------------------------
        // ESCALERA DE MONEDAS
        // -------------------------
        let stepX = 2300 + OFFSET;
        let stepY = groundLevel - tileH * 5;
        for (let i = 0; i < 7; i++) {
            window.coins.push(new Coin(stepX + i * 70, stepY - i * 45 - coinHeight, coinImage));
        }

        // -------------------------
        // PLATAFORMAS ALTAS – MUCHAS MONEDAS
        // -------------------------
        const y_high = groundLevel - tileH * 12;
        for (let x = 2600; x <= 3300; x += 70) {
            window.coins.push(new Coin(x + OFFSET, y_high - coinHeight, coinImage));
        }

        // -------------------------
        // PORTAL FINAL NIVEL 2
        // -------------------------
        const portalWidth = 128;
        const portalHeight = 128;
        const portalX = 4500 + OFFSET;
        const portalY = groundLevel + (170 - portalHeight);

        window.portal = new Portal(portalX, portalY, portalImage);
    }

    // ======================================================
    // ITEMS NIVEL 3
    // ======================================================
    function initItemsLevel3(canvas, coinImage, portalImage) {
        window.coins = [];
        window.powerups = [];
        window.portal = null;

        const OFFSET = 500;
        const tileH = 24;
        const groundLevel = canvas.height - 170;
        const coinH = 32;

        // Suelo lleno de monedas
        for (let x = 900; x <= 2500; x += 70) {
            window.coins.push(new Coin(x + OFFSET, groundLevel - coinH, coinImage));
        }

        // Plataforma media izquierda
        const y_mid1 = groundLevel - tileH * 6;
        for (let x = 1400; x <= 1800; x += 80) {
            window.coins.push(new Coin(x + OFFSET, y_mid1 - coinH, coinImage));
        }

        // Plataforma alta media
        const y_mid2 = groundLevel - tileH * 10;
        for (let x = 2000; x <= 2400; x += 70) {
            window.coins.push(new Coin(x + OFFSET, y_mid2 - coinH, coinImage));
        }

        // Plataforma superior
        const y_top = groundLevel - tileH * 14;
        for (let x = 2600; x <= 3000; x += 60) {
            window.coins.push(new Coin(x + OFFSET, y_top - coinH, coinImage));
        }

        // Escaleras descendentes
        for (let i = 0; i < 5; i++) {
            window.coins.push(new Coin(3000 + OFFSET + i * 80, groundLevel - (tileH * (12 - i * 3)) - coinH, coinImage));
        }

        // Portal final en suelo
        const portalWidth = 128;
        const portalHeight = 128;
        const portalX = 4500 + OFFSET;
        const portalY = groundLevel + (170 - portalHeight);

        window.portal = new Portal(portalX, portalY, portalImage);

        console.log(`Items Nivel 3: ${window.coins.length} monedas.`);
    }



    function spawnPowerUp(canvas, powerUpImage) {
        const randomX = Math.random() * (canvas.width - 40);
        const spawnX = randomX + window.cameraX;
        window.powerups.push(new PowerUp(spawnX, -50, powerUpImage));
    }

    // ===============================
    // REFERENCIAS A LA UI
    // ===============================
    const titleScreen = document.getElementById('titleScreen');
    const levelSelectScreen = document.getElementById('levelSelectScreen');
    const playButton = document.getElementById('playButton');
    const level1Button = document.getElementById('level1Button');
    const level2Button = document.getElementById('level2Button');
    const level3Button = document.getElementById('level3Button');
    const backToTitleButton = document.getElementById('backToTitleButton');

    const pauseScreen = document.getElementById('pauseScreen');
    const resumeButton = document.getElementById('resumeButton');
    const restartButton = document.getElementById('restartButton');
    const pauseBackToMenuButton = document.getElementById('pauseBackToMenuButton');

    const hud = document.getElementById('hud');
    const livesContainer = document.getElementById('livesContainer');
    const timerValue = document.getElementById('timerValue');
    const scoreValue = document.getElementById('scoreValue');
    const missionsButton = document.getElementById('missionsButton');
    const missionsPanel = document.getElementById('missionsPanel');
    const closeMissionsButton = document.getElementById('closeMissionsButton');

    const gameOverScreen = document.getElementById('gameOverScreen');
    const gameOverBackToMenuButton = document.getElementById('gameOverBackToMenuButton');

    const levelCompleteScreen = document.getElementById('levelCompleteScreen');
    const nextLevelButton = document.getElementById('nextLevelButton');
    const levelCompleteBackToMenuButton = document.getElementById('levelCompleteBackToMenuButton');
    const star1 = document.getElementById('star1');
    const star2 = document.getElementById('star2');
    const star3 = document.getElementById('star3');
    const resultEnemies = document.getElementById('result-enemies');
    const resultScore = document.getElementById('result-score');

    // ===============================
    // VARIABLES DE JUEGO
    // ===============================
    window.cameraX = 0;
    let score = 0;
    let lives = 3;
    let gameTimeInSeconds = 0;
    let timerInterval = null;
    let playerPower = 'normal';
    let powerUpTimer = 0;
    let powerUpSpawnCounter = 0;
    let isPlayerInvincible = false;
    let invincibilityTimer = 0;
    let enemiesKilled = 0;

    // Nivel actual
    let currentLevel = 1;
    window.currentLevel = 1;

    // Límite del nivel 
    const LEVEL_END_X = 6000;

    // ===============================
    // DEFINICIÓN DEL JUGADOR
    // ===============================
    const player = {
        x: 100,
        y: 0,
        width: 160,
        height: 170,
        speed: 3,
        frame: 0
    };

    const playerSprites = [];
    const jumpSprites = [];
    const totalFrames = 20;
    const totalJumpFrames = 7;
    let isJumping = false;
    let jumpSpeed = 8;
    let gravity = 0.15;
    let jumpHeight = 0;
    let groundLevel = canvas.height - player.height;
    player.y = groundLevel;

    // ===============================
    // SPRITES DE ENEMIGOS
    // ===============================
    const enemySprites = [];
    const totalEnemyFrames = 5;

    // -------------------------------
    // Ajuste de tamaño del canvas
    // -------------------------------
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        groundLevel = canvas.height - player.height;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // -------------------------------
    // Cargar sprites
    // -------------------------------
    function loadPlayerSprites() {
        for (let i = 0; i < totalFrames; i++) {
            const img = new Image();
            img.src = `assets/character/DuendeWalk/Walk${i}.png`;
            playerSprites.push(img);
        }
    }

    function loadJumpSprites() {
        for (let i = 0; i < totalJumpFrames; i++) {
            const img = new Image();
            img.src = `assets/character/DuendeJump/jump${i}.png`;
            jumpSprites.push(img);
        }
    }

    function loadEnemySprites() {
        for (let i = 0; i < totalEnemyFrames; i++) {
            const img = new Image();
            img.src = `assets/character/Enemy/Enemy${i}.png`;
            enemySprites.push(img);
        }
    }

    // -------------------------------
    // DIBUJAR JUGADOR
    // -------------------------------
    function drawPlayer(ctx, walkSprites, jumpSprites) {
        let spriteArray = isJumping ? jumpSprites : walkSprites;
        if (isJumping && jumpSprites.length === 0) {
            spriteArray = walkSprites;
        }
        const currentFrame = spriteArray[Math.floor(player.frame)] || spriteArray[0];

        if (isPlayerInvincible) {
            if (Math.floor(invincibilityTimer / 10) % 2 === 0) {
                // parpadeo (no dibuja)
            } else if (currentFrame) {
                ctx.drawImage(currentFrame, player.x, player.y, player.width, player.height);
            }
        } else if (currentFrame) {
            ctx.drawImage(currentFrame, player.x, player.y, player.width, player.height);
        }
    }

    // ===============================
    // TUTORIAL
    // ===============================
    function drawTutorial(ctx) {
        const x = 150;
        const y = groundLevel - 250;
        const lineHeight = 30;

        ctx.fillStyle = "white";
        ctx.font = "bold 26px Arial";
        ctx.textAlign = "left";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 5;

        ctx.fillText("¿Cómo Jugar?", x, y);
        ctx.font = "20px Arial";
        ctx.fillText("- Flechas = Moverse", x, y + lineHeight * 2);
        ctx.fillText("- Espacio = Saltar", x, y + lineHeight * 3);
        ctx.fillText("- Tecla 'D' = Disparar", x, y + lineHeight * 4);
        ctx.fillText("- Tecla 'M' = Misiones", x, y + lineHeight * 5);
        ctx.font = "18px Arial";
        ctx.fillText("¡Recoge monedas y elimina enemigos!", x, y + lineHeight * 7);
        ctx.fillText("¡Coge la burbuja para un disparo potenciado!", x, y + lineHeight * 8);
        ctx.shadowBlur = 0;
    }

    // ===============================
    // FONDO PARALLAX
    // ===============================
    let bg1X = 0,
        bg2X = 0,
        bg3X = 0;

    function updateBackground() {
        if (window.currentState === window.states.PLAYING) {
            const bgSpeedFactor = 0.3;
            const bgSpeedFactor2 = 0.5;
            const bgSpeedFactor3 = 0.8;
            bg1X = window.cameraX * bgSpeedFactor;
            bg2X = window.cameraX * bgSpeedFactor2;
            bg3X = window.cameraX * bgSpeedFactor3;
        }
    }

    function drawBackground(ctx, backgroundLayer1, backgroundLayer2, backgroundLayer3, canvasWidth, canvasHeight) {
        if (backgroundLayer1) {
            let bg1Offset = bg1X % canvasWidth;
            ctx.drawImage(backgroundLayer1, -bg1Offset, 0, canvasWidth, canvasHeight);
            ctx.drawImage(backgroundLayer1, -bg1Offset + canvasWidth, 0, canvasWidth, canvasHeight);
        }
        if (backgroundLayer2) {
            let bg2Offset = bg2X % canvasWidth;
            ctx.drawImage(backgroundLayer2, -bg2Offset, 0, canvasWidth, canvasHeight);
            ctx.drawImage(backgroundLayer2, -bg2Offset + canvasWidth, 0, canvasWidth, canvasHeight);
        }
        if (backgroundLayer3) {
            let bg3Offset = bg3X % canvasWidth;
            ctx.drawImage(backgroundLayer3, -bg3Offset, 0, canvasWidth, canvasHeight);
            ctx.drawImage(backgroundLayer3, -bg3Offset + canvasWidth, 0, canvasWidth, canvasHeight);
        }
    }

    // ===============================
    // CONTROLES / MOVIMIENTO
    // ===============================
    let keys = {};

    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;

        if (e.key === 'Escape') {
            if (missionsPanel && !missionsPanel.classList.contains('hidden')) {
                closeMissionsPanel();
            } else if (window.currentState === window.states.PLAYING) {
                showPauseMenu();
            } else if (window.currentState === window.states.PAUSED) {
                resumeGame();
            }
        }

        if (e.key === 'm' || e.key === 'M') {
            if (window.currentState === window.states.PLAYING || window.currentState === window.states.PAUSED) {
                toggleMissionsPanel();
            }
        }
    });

    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });

    function updatePlayer() {
        let isMoving = false;

        if (keys['ArrowRight'] && player.x < LEVEL_END_X) {
            player.x += player.speed;
            isMoving = true;
        }
        if (keys['ArrowLeft']) {
            player.x -= player.speed;
            isMoving = true;
        }

        if (keys[' '] && !isJumping) {
            isJumping = true;
            jumpHeight = jumpSpeed;
        }

        if (isJumping || player.y < groundLevel) {
            player.y -= jumpHeight;
            jumpHeight -= gravity;
        }

        detectPlatformCollision(player);
        player.x = Math.max(100, player.x);

        if (player.y > canvas.height + 50) {
            playerTakeDamage(lives);
        }

        if (isJumping) {
            player.frame = Math.min(player.frame + 0.5, totalJumpFrames - 1);
        } else if (isMoving) {
            player.frame = (player.frame + 0.5) % totalFrames;
        } else {
            player.frame = 0;
        }

        if (isPlayerInvincible) {
            invincibilityTimer--;
            if (invincibilityTimer <= 0) {
                isPlayerInvincible = false;
            }
        }
    }

    // ===============================
    // CÁMARA
    // ===============================
    function updateCamera() {
        const targetCameraX = player.x - (canvas.width * 0.3);
        window.cameraX += (targetCameraX - window.cameraX) * 0.1;
        if (window.cameraX < 0) {
            window.cameraX = 0;
        }
    }

    // ===============================
    // COLISIÓN CON PLATAFORMAS
    // ===============================
    function detectPlatformCollision(player) {
        let onPlatform = false;
        const playerBottom = player.y + player.height;

        if (window.platforms) {
            for (const platform of window.platforms) {
                const horizontallyInside =
                    player.x + player.width > platform.x &&
                    player.x < platform.x + platform.width;

                if (horizontallyInside) {
                    if (jumpHeight <= 0 && playerBottom <= platform.y + 10 && playerBottom >= platform.y - 10) {
                        player.y = platform.y - player.height;
                        isJumping = false;
                        jumpHeight = 0;
                        onPlatform = true;
                        break;
                    }
                }
            }
        }

        if (player.y >= groundLevel && !onPlatform) {
            player.y = groundLevel;
            isJumping = false;
            jumpHeight = 0;
            onPlatform = true;
        }

        if (!onPlatform && !isJumping) {
            isJumping = true;
            jumpHeight = 0;
        }
    }

    // ===============================
    // PROYECTILES
    // ===============================
    let projectiles = [];

    function shootProjectile() {
        // Solo dispara cuando se presiona D
        if (!(keys['d'] || keys['D'])) return;

        let proj = {
            x: player.x + player.width,
            y: player.y + player.height / 2,
        };

        // ¿Tiene power-up?
        if (playerPower === 'upgraded') {

            // Nivel 2: bala especial azul tenebrosa
            if (currentLevel === 2) {
                proj.speed = 14;
                proj.width = 40;
                proj.height = 12;
                proj.color = '#99CCFF'; // azul claro
                proj.innerColor = 'white'; // núcleo brillante
                proj.damage = 3;

                // Nivel 1: bala azul normal
            } else {
                proj.speed = 12;
                proj.width = 30;
                proj.height = 10;
                proj.color = 'cyan';
                proj.damage = 2;
            }

            // Disparo normal (sin power-up)
        } else {
            proj.speed = 10;
            proj.width = 15;
            proj.height = 5;
            proj.color = 'yellow';
            proj.damage = 1;
        }

        projectiles.push(proj);
        keys['d'] = false;
        keys['D'] = false;
    }


    function drawProjectiles(ctx) {
        projectiles.forEach((p) => {
            // Proyectil normal
            if (!p.innerColor) {
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, p.width, p.height);
            }
            // Proyectil del nivel 2 (núcleo brillante)
            else {
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, p.width, p.height);

                ctx.fillStyle = p.innerColor;
                ctx.fillRect(p.x + 8, p.y + 3, p.width - 16, p.height - 6);
            }

            p.x += p.speed;
        });
    }


    // ===============================
    // LÓGICA DE ESTADOS / MENÚS
    // ===============================
    function showTitleScreen() {
        titleScreen.classList.remove('hidden');
        levelSelectScreen.classList.add('hidden');
        pauseScreen.classList.add('hidden');
        hud.classList.add('hidden');
        missionsPanel.classList.add('hidden');
        if (gameOverScreen) gameOverScreen.classList.add('hidden');
        if (levelCompleteScreen) levelCompleteScreen.classList.add('hidden');
        changeState(window.states.TITLE_SCREEN);
    }

    function showLevelSelect() {
        titleScreen.classList.add('hidden');
        levelSelectScreen.classList.remove('hidden');
        changeState(window.states.LEVEL_SELECT);
    }

    function startGameLogic() {
        titleScreen.classList.add('hidden');
        levelSelectScreen.classList.add('hidden');
        hud.classList.remove('hidden');
        changeState(window.states.PLAYING);
        resetGame();

        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
    }

    function showPauseMenu() {
        pauseScreen.classList.remove('hidden');
        changeState(window.states.PAUSED);
        clearInterval(timerInterval);
    }

    function resumeGame() {
        pauseScreen.classList.add('hidden');
        changeState(window.states.PLAYING);

        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
    }

    function restartLevel() {
        resetGame();
        resumeGame();
    }

    function returnToMainMenu() {
        resetGame();
        showTitleScreen();
        clearInterval(timerInterval);
    }

    function showGameOver() {
        hud.classList.add('hidden');
        pauseScreen.classList.add('hidden');
        missionsPanel.classList.add('hidden');
        gameOverScreen.classList.remove('hidden');
        changeState(window.states.GAME_OVER);
        clearInterval(timerInterval);
    }

    function showLevelComplete() {
        hud.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
        pauseScreen.classList.add('hidden');
        missionsPanel.classList.add('hidden');
        levelCompleteScreen.classList.remove('hidden');

        changeState(window.states.LEVEL_COMPLETE);
        clearInterval(timerInterval);

        checkObjectives();
    }

    function resetGame() {
        player.x = 100;
        player.y = groundLevel;
        player.frame = 0;
        isJumping = false;
        jumpHeight = 0;

        window.cameraX = 0;
        projectiles = [];

        playerPower = 'normal';
        powerUpTimer = 0;
        powerUpSpawnCounter = 0;
        isPlayerInvincible = false;
        invincibilityTimer = 0;
        enemiesKilled = 0;
        window.portal = null;

        // Plataformas según nivel
        // Plataformas
        if (currentLevel === 1) initPlatforms(canvas, ctx, window.tileset);
        if (currentLevel === 2) initPlatformsLevel2(canvas, ctx, window.tileset);
        if (currentLevel === 3) initPlatformsLevel3(canvas, ctx, window.tileset);

        // Items
        if (currentLevel === 1) initItems(canvas, window.coin, window.portalImage);
        if (currentLevel === 2) initItemsLevel2(canvas, window.coin, window.portalImage);
        if (currentLevel === 3) initItemsLevel3(canvas, window.coin, window.portalImage);

        // Enemigos
        if (currentLevel === 1) initEnemies(enemySprites, canvas);
        if (currentLevel === 2) initEnemiesLevel2(enemySprites, canvas);
        if (currentLevel === 3) initEnemiesLevel3(enemySprites, canvas);


        console.log(`Juego Reiniciado. Nivel actual: ${currentLevel}`);

        score = 0;
        lives = 3;
        gameTimeInSeconds = 0;
        updateScoreDisplay();
        updateLivesDisplay();
        updateTimerDisplay();
    }

    function toggleMissionsPanel() {
        missionsPanel.classList.toggle('hidden');
        if (!missionsPanel.classList.contains('hidden')) {
            if (window.currentState === window.states.PLAYING) {
                showPauseMenu();
            }
        } else {
            if (window.currentState === window.states.PAUSED) {
                resumeGame();
            }
        }
    }

    function closeMissionsPanel() {
        missionsPanel.classList.add('hidden');
        if (window.currentState === window.states.PAUSED) {
            resumeGame();
        }
    }

    // HUD
    function updateLivesDisplay() {
        livesContainer.innerHTML = '';
        for (let i = 0; i < lives; i++) {
            livesContainer.innerHTML += '❤️';
        }
    }

    function updateScoreDisplay() {
        scoreValue.textContent = score;
    }

    function updateTimer() {
        gameTimeInSeconds++;
        updateTimerDisplay();
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(gameTimeInSeconds / 60);
        const seconds = gameTimeInSeconds % 60;
        const formattedTime =
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        timerValue.textContent = formattedTime;
    }

    // ===============================
    // COLISIONES / LÓGICA
    // ===============================
    function checkRectCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }

    function playerTakeDamage(damageAmount) {
        if (isPlayerInvincible) return;
        if (window.currentState === window.states.GAME_OVER || window.currentState === window.states.LEVEL_COMPLETE) return;

        lives -= (damageAmount || 1);
        if (lives < 0) lives = 0;
        updateLivesDisplay();

        isPlayerInvincible = true;
        invincibilityTimer = 120;

        if (lives <= 0) {
            console.log("GAME OVER");
            showGameOver();
        }
    }

    function checkItemCollisions() {
        if (window.coins) {
            for (let i = window.coins.length - 1; i >= 0; i--) {
                const coin = window.coins[i];
                if (!coin.isCollected && checkRectCollision(player, coin)) {
                    coin.isCollected = true;
                    score += 10;
                    updateScoreDisplay();
                }
            }
            window.coins = window.coins.filter(coin => !coin.isCollected);
        }
        if (window.powerups) {
            for (let i = window.powerups.length - 1; i >= 0; i--) {
                const powerup = window.powerups[i];
                if (!powerup.isCollected && checkRectCollision(player, powerup)) {
                    powerup.isCollected = true;
                    playerPower = 'upgraded';
                    powerUpTimer = 60 * 10;
                }
            }
        }
    }

    function checkProjectileCollisions() {
        for (let i = projectiles.length - 1; i >= 0; i--) {
            const proj = projectiles[i];
            let projectileHit = false;

            if (window.enemies) {
                for (let j = window.enemies.length - 1; j >= 0; j--) {
                    const enemy = window.enemies[j];

                    if (enemy.isAlive && checkRectCollision(proj, enemy)) {
                        projectileHit = true;

                        const enemyDied = enemy.takeDamage(proj.damage);
                        if (enemyDied) {
                            score += 50;
                            enemiesKilled++;
                            updateScoreDisplay();
                        }
                        break;
                    }
                }
            }

            if (projectileHit || proj.x > window.cameraX + canvas.width) {
                projectiles.splice(i, 1);
            }
        }

        if (window.enemies) {
            window.enemies = window.enemies.filter(enemy => enemy.isAlive);
        }
    }

    function checkPlayerEnemyCollision() {
        if (isPlayerInvincible) return;

        if (window.enemies) {
            for (const enemy of window.enemies) {
                if (enemy.isAlive && checkRectCollision(player, enemy)) {
                    playerTakeDamage(1);
                    break;
                }
            }
        }
    }

    function managePowerUps() {
        if (powerUpTimer > 0) {
            powerUpTimer--;
            if (powerUpTimer === 0) {
                playerPower = 'normal';
            }
        }
        powerUpSpawnCounter++;
        if (powerUpSpawnCounter > 60 * 20) {
            powerUpSpawnCounter = 0;
            if (window.powerups && window.powerups.length === 0 && typeof spawnPowerUp !== 'undefined') {
                spawnPowerUp(canvas, window.powerup);
            }
        }
        if (window.powerups) {
            for (let i = window.powerups.length - 1; i >= 0; i--) {
                window.powerups[i].update(canvas);
                if (window.powerups[i].isCollected) {
                    window.powerups.splice(i, 1);
                }
            }
        }
    }

    function checkPortalCollision() {
        if (!window.portal || window.currentState !== window.states.PLAYING) return;

        if (checkRectCollision(player, window.portal)) {
            showLevelComplete();
        }
    }

    // ===============================
    // OBJETIVOS 
    // ===============================
    function checkObjectives() {
        const objective1 = enemiesKilled >= 5;
        const objective2 = score >= 250;
        const objective3 = true;

        let stars = 0;
        if (objective1) stars++;
        if (objective2) stars++;
        if (objective3) stars++;

        resultEnemies.textContent = `Enemigos derrotados: ${enemiesKilled} / 5`;
        resultScore.textContent = `Puntaje obtenido: ${score} / 250`;

        star1.classList.toggle('filled', stars >= 1);
        star2.classList.toggle('filled', stars >= 2);
        star3.classList.toggle('filled', stars >= 3);
    }

    // ===============================
    // BUCLE PRINCIPAL
    // ===============================
    function update() {
        if (window.currentState !== window.states.PLAYING) return;

        updatePlayer();
        updateCamera();
        updateBackground();
        shootProjectile();

        managePowerUps();
        checkItemCollisions();
        checkProjectileCollisions();
        checkPlayerEnemyCollision();
        checkPortalCollision();

        if (window.enemies) {
            window.enemies.forEach(e => e.update(player));
        }
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Fondo con parallax
        if (window.backgroundLayer1) {
            drawBackground(ctx, window.backgroundLayer1, window.backgroundLayer2, window.backgroundLayer3, canvas.width, canvas.height);
        }

        // Tinte azulado para el nivel 2
        if (currentLevel === 2) {
            ctx.save();
            ctx.fillStyle = "rgba(30, 60, 160, 0.40)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
        }

        // Filtro rojo para Nivel 3
        if (currentLevel === 3) {
            ctx.save();
            ctx.fillStyle = "rgba(150, 20, 20, 0.45)"; // rojo profundo y oscuro
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
        }



        if (
            window.currentState === window.states.PLAYING ||
            window.currentState === window.states.PAUSED ||
            window.currentState === window.states.LEVEL_COMPLETE
        ) {
            ctx.save();
            ctx.translate(-window.cameraX, 0);

            if (window.coins) {
                window.coins.forEach(c => c.draw(ctx));
            }
            if (window.powerups) {
                window.powerups.forEach(p => p.draw(ctx));
            }

            if (window.portal) {
                window.portal.draw(ctx);
            }

            if (window.platforms) {
                window.platforms.forEach(p => p.draw(ctx));
            }
            if (window.enemies) {
                window.enemies.forEach(e => e.draw(ctx));
            }

            if (window.cameraX < 400 && currentLevel === 1) {
                drawTutorial(ctx);
            }

            drawPlayer(ctx, playerSprites, jumpSprites);
            drawProjectiles(ctx);

            ctx.restore();
        }
    }

    function gameLoop() {
        update();
        render();
        requestAnimationFrame(gameLoop);
    }

    // ===============================
    // INICIO DEL JUEGO
    // ===============================
    loadResources(function() {
        console.log("Todos los recursos cargados. Inicializando assets.");

        // Por defecto se inicializa el nivel 1
        initPlatforms(canvas, ctx, window.tileset);
        loadPlayerSprites();
        loadJumpSprites();
        loadEnemySprites();
        initEnemies(enemySprites, canvas);
        initItems(canvas, window.coin, window.portalImage);

        // Botones
        if (playButton) {
            playButton.onclick = function() {
                showLevelSelect();
                this.blur();
            };
        }
        if (level1Button) {
            level1Button.onclick = function() {
                currentLevel = 1;
                window.currentLevel = 1;
                startGameLogic();
                this.blur();
            };
        }
        if (level2Button) {
            level2Button.onclick = function() {
                currentLevel = 2;
                window.currentLevel = 2;
                startGameLogic();
                this.blur();
            };
        }

        if (level3Button) {
            level3Button.onclick = function() {
                currentLevel = 3;
                window.currentLevel = 3;
                startGameLogic();
            };
        }
        if (backToTitleButton) {
            backToTitleButton.onclick = function() {
                showTitleScreen();
                this.blur();
            };
        }
        if (resumeButton) {
            resumeButton.onclick = function() {
                resumeGame();
                this.blur();
            };
        }
        if (restartButton) {
            restartButton.onclick = function() {
                restartLevel();
                this.blur();
            };
        }
        if (pauseBackToMenuButton) {
            pauseBackToMenuButton.onclick = function() {
                returnToMainMenu();
                this.blur();
            };
        }
        if (missionsButton) {
            missionsButton.onclick = function() {
                toggleMissionsPanel();
                this.blur();
            };
        }
        if (closeMissionsButton) {
            closeMissionsButton.onclick = function() {
                closeMissionsPanel();
                this.blur();
            };
        }
        if (gameOverBackToMenuButton) {
            gameOverBackToMenuButton.onclick = function() {
                returnToMainMenu();
                this.blur();
            };
        }
        if (levelCompleteBackToMenuButton) {
            levelCompleteBackToMenuButton.onclick = function() {
                returnToMainMenu();
                this.blur();
            };
        }
        if (nextLevelButton) {
            nextLevelButton.onclick = function() {
                if (currentLevel === 1) {
                    currentLevel = 2;
                    window.currentLevel = 2;
                    startGameLogic();
                } else {
                    returnToMainMenu();
                }
                this.blur();
            };
        }

        showTitleScreen();
        gameLoop();
    });
};