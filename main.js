// Punto de entrada del juego - maneja UI y game loop
// VERSIÓN CON AUDIO, TOUCH CONTROLS Y PERSISTENCIA

// ===============================
// ESTADOS DEL JUEGO
// ===============================
window.states = {
    TITLE_SCREEN: 'TITLE_SCREEN',
    LEVEL_SELECT: 'LEVEL_SELECT',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    GAME_OVER: 'GAME_OVER',
    LEVEL_COMPLETE: 'LEVEL_COMPLETE'
};


window.currentState = window.states.TITLE_SCREEN;

function changeState(newState) {
    window.currentState = newState;
    console.log('Estado cambiado a:', newState);
}

// ===============================
// Nombre de jugador 
// ===============================  

// Nombre del jugador (persistente)
window.playerName = localStorage.getItem('playerName') || '';

function savePlayerName(name) {
    const trimmed = (name || '').trim();
    window.playerName = trimmed || '';
    localStorage.setItem('playerName', window.playerName);
}



window.onload = function() {
    const canvas = document.getElementById('gameCanvas');

    // Referencias UI
    const ui = {
        titleScreen: document.getElementById('titleScreen'),
        levelSelectScreen: document.getElementById('levelSelectScreen'),
        pauseScreen: document.getElementById('pauseScreen'),
        gameOverScreen: document.getElementById('gameOverScreen'),
        levelCompleteScreen: document.getElementById('levelCompleteScreen'),
        hud: document.getElementById('hud'),
        missionsPanel: document.getElementById('missionsPanel'),

        // HUD elements
        livesContainer: document.getElementById('livesContainer'),
        timerValue: document.getElementById('timerValue'),
        scoreValue: document.getElementById('scoreValue'),
        highScoreValue: document.getElementById('highScoreValue'),
        muteButton: document.getElementById('muteButton'),

        // Level complete elements
        star1: document.getElementById('star1'),
        star2: document.getElementById('star2'),
        star3: document.getElementById('star3'),
        resultEnemies: document.getElementById('result-enemies'),
        resultScore: document.getElementById('result-score')
    };

    // Instancias globales
    window.game = null;
    window.touchControls = null;
    window.performanceMonitor = null;

    // ===============================
    // CONECTAR NOMBRE DE JUGADOR 
    // ===============================

    // Nombre del jugador (input en Selección de Nivel)
    const playerNameInput = document.getElementById('playerNameInput');
    if (playerNameInput) {
        // Cargar el nombre guardado
        playerNameInput.value = window.playerName;

        // Guardar cada vez que lo cambie
        playerNameInput.addEventListener('input', () => {
            savePlayerName(playerNameInput.value);
        });
    }


    // ===============================
    // FUNCIONES DE UI
    // ===============================

    function showTitleScreen() {
        ui.titleScreen.classList.remove('hidden');
        ui.levelSelectScreen.classList.add('hidden');
        ui.pauseScreen.classList.add('hidden');
        ui.hud.classList.add('hidden');
        ui.missionsPanel.classList.add('hidden');
        ui.gameOverScreen.classList.add('hidden');
        ui.levelCompleteScreen.classList.add('hidden');

        if (window.touchControls) {
            window.touchControls.setVisible(false);
        }

        changeState(window.states.TITLE_SCREEN);

        // Actualizar high score en pantalla título
        updateHighScoreDisplay();
    }

    function showLevelSelect() {
        ui.titleScreen.classList.add('hidden');
        ui.levelSelectScreen.classList.remove('hidden');

        // Actualizar botones de nivel según progreso
        updateLevelButtons();

        changeState(window.states.LEVEL_SELECT);
    }

    // Mostrar puntajes globales (top 10)
    function showGlobalScores() {
        const scores = window.globalScores || [];

        if (scores.length === 0) {
            alert('Aún no hay puntajes globales.\nCompleta un nivel para enviar tu primer resultado online.');
            return;
        }

        let msg = '🏆 Puntajes globales (Top 10)\n\n';

        scores.forEach((s, i) => {
            const player = s.player || 'Jugador';
            const level = s.level || '?';

            const stars = (s.stars !== undefined && s.stars !== null) ? s.stars : 0;
            const score = (s.score !== undefined && s.score !== null) ? s.score : 0;

            msg += `${i + 1}. ${player} - Nivel ${level} - ${score} pts - ⭐${stars}\n`;
        });

        alert(msg);
    }


    function startGame(level = 1) {
        if (game) {
            game.levelManager.currentLevel = level;
            game.reset();
            updateHUD();
        }

        // Ocultar TODAS las pantallas
        ui.titleScreen.classList.add('hidden');
        ui.levelSelectScreen.classList.add('hidden');
        ui.pauseScreen.classList.add('hidden');
        ui.gameOverScreen.classList.add('hidden');
        ui.levelCompleteScreen.classList.add('hidden');
        ui.missionsPanel.classList.add('hidden');

        // Mostrar HUD y controles táctiles
        ui.hud.classList.remove('hidden');
        if (window.touchControls) {
            window.touchControls.setVisible(true);
        }

        changeState(window.states.PLAYING);

        game.startTimer(updateTimer);
    }

    function showPauseMenu() {
        ui.pauseScreen.classList.remove('hidden');
        changeState(window.states.PAUSED);
        game.stopTimer();
        game.audioManager.pauseMusic();
    }

    function resumeGame() {
        ui.pauseScreen.classList.add('hidden');
        changeState(window.states.PLAYING);
        game.startTimer(updateTimer);
        game.audioManager.resumeMusic();
    }

    function showGameOver() {
        ui.hud.classList.add('hidden');
        ui.pauseScreen.classList.add('hidden');
        ui.missionsPanel.classList.add('hidden');
        ui.gameOverScreen.classList.remove('hidden');

        if (window.touchControls) {
            window.touchControls.setVisible(false);
        }

        changeState(window.states.GAME_OVER);
        game.stopTimer();

        // Guardar estadísticas
        SaveManager.updateGlobalStats(
            game.enemiesKilled,
            Math.floor(game.score / 10),
            game.gameTimeInSeconds
        );
    }

    function showLevelComplete() {
        ui.hud.classList.add('hidden');
        ui.gameOverScreen.classList.add('hidden');
        ui.pauseScreen.classList.add('hidden');
        ui.missionsPanel.classList.add('hidden');
        ui.levelCompleteScreen.classList.remove('hidden');

        if (window.touchControls) {
            window.touchControls.setVisible(false);
        }

        changeState(window.states.LEVEL_COMPLETE);
        game.stopTimer();

        checkObjectives();
    }

    function returnToMainMenu() {
        game.levelManager.reset();
        game.reset();
        showTitleScreen();
    }

    function toggleMissionsPanel() {
        ui.missionsPanel.classList.toggle('hidden');

        if (!ui.missionsPanel.classList.contains('hidden')) {
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
        ui.missionsPanel.classList.add('hidden');
        if (window.currentState === window.states.PAUSED) {
            resumeGame();
        }
    }

    // ===============================
    // ACTUALIZACIÓN DE HUD
    // ===============================

    function updateHUD() {
        updateLivesDisplay();
        updateScoreDisplay();
        updateHighScoreDisplay();
        updateTimerDisplay();
        updateMissions();
        updateMuteButton();
    }

    function updateLivesDisplay() {
        if (!game) return;
        ui.livesContainer.innerHTML = '';
        for (let i = 0; i < game.player.lives; i++) {
            ui.livesContainer.innerHTML += '❤️';
        }
    }

    function updateScoreDisplay() {
        if (!game) return;
        ui.scoreValue.textContent = game.score;
    }

    function updateHighScoreDisplay() {
        if (ui.highScoreValue) {
            ui.highScoreValue.textContent = SaveManager.getHighScore();
        }
    }

    function updateTimer(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        ui.timerValue.textContent =
            `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function updateTimerDisplay() {
        if (!game) return;
        updateTimer(game.gameTimeInSeconds);
    }

    function updateMissions() {
        if (!game) return;

        const level = game.levelManager.currentLevel;
        const enemyCount = game.enemyManager.getAliveCount();
        const coinCount = game.itemManager.getCoinCount();
        const scoreTarget = coinCount * 10;

        const titleElement = document.getElementById('missionsPanelTitle');
        if (titleElement) {
            titleElement.textContent = `Misiones del Nivel ${level}`;
        }

        const listElement = document.getElementById('missionsList');
        if (listElement) {
            listElement.innerHTML = `
                <li>Encuentra la salida (portal).</li>
                <li>Derrota a ${enemyCount} enemigos.</li>
                <li>Recoge ${coinCount} monedas.</li>
                <li>Consigue ${scoreTarget} puntos.</li>
            `;
        }
    }

    function updateMuteButton() {
        if (!ui.muteButton || !game) return;
        ui.muteButton.textContent = game.audioManager.isMuted() ? '🔇' : '🔊';
    }

    function updateLevelButtons() {
        const unlockedLevels = SaveManager.getUnlockedLevels();

        ['level1Button', 'level2Button', 'level3Button'].forEach((id, index) => {
            const level = index + 1;
            const button = document.getElementById(id);
            if (button) {
                button.disabled = !unlockedLevels.includes(level);

                const levelInfo = SaveManager.getLevelInfo(level);
                if (levelInfo) {
                    button.textContent = `Nivel ${level} ⭐${levelInfo.bestStars}`;
                }
            }
        });
    }

    // ===============================
    // OBJETIVOS Y GUARDADO
    // ===============================

    function checkObjectives() {
        if (!game) return;

        const level = game.levelManager.currentLevel;
        const totalEnemies = getTotalEnemiesForLevel(level);
        const totalCoins = getTotalCoinsForLevel(level);
        const scoreTarget = totalCoins * 10;

        const objective1 = game.enemiesKilled >= totalEnemies;
        const objective2 = game.score >= scoreTarget;
        const objective3 = true;

        let stars = 0;
        if (objective3) stars++;
        if (objective1) stars++;
        if (objective2) stars++;

        ui.resultEnemies.textContent = `Enemigos derrotados: ${game.enemiesKilled} / ${totalEnemies}`;
        ui.resultScore.textContent = `Puntaje obtenido: ${game.score} / ${scoreTarget}`;

        ui.star1.classList.toggle('filled', stars >= 1);
        ui.star2.classList.toggle('filled', stars >= 2);
        ui.star3.classList.toggle('filled', stars >= 3);

        // Guardar progreso
        SaveManager.saveLevelCompletion(
            level,
            stars,
            game.score,
            game.gameTimeInSeconds,
            game.enemiesKilled
        );

        // ===== APARTADO ONLINE: ENVIAR RESULTADOS =====
        if (window.wsClient && wsClient.connected) {
            wsClient.send({
                type: 'level_complete',
                player: window.playerName || "Sin Nombre",
                level: level,
                stars: stars,
                score: game.score,
                time: game.gameTimeInSeconds,
                enemiesKilled: game.enemiesKilled,
                timestamp: Date.now()
            });
        }

        // Guardar high score
        const isNewRecord = SaveManager.saveHighScore(game.score);
        if (isNewRecord) {
            console.log('¡NUEVO RÉCORD!');
        }

        // Guardar estadísticas globales
        SaveManager.updateGlobalStats(
            game.enemiesKilled,
            Math.floor(game.score / 10),
            game.gameTimeInSeconds
        );
    }

    function getTotalEnemiesForLevel(level) {
        switch (level) {
            case 1:
                return 7;
            case 2:
                return 8;
            case 3:
                return 11;
            default:
                return 5;
        }
    }

    function getTotalCoinsForLevel(level) {
        switch (level) {
            case 1:
                return 25;
            case 2:
                return 30;
            case 3:
                return 35;
            default:
                return 20;
        }
    }

    // ===============================
    // CONTROLES GLOBALES
    // ===============================

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (ui.missionsPanel && !ui.missionsPanel.classList.contains('hidden')) {
                closeMissionsPanel();
            } else if (window.currentState === window.states.PLAYING) {
                showPauseMenu();
            } else if (window.currentState === window.states.PAUSED) {
                resumeGame();
            }
        }

        if (e.key === 'm' || e.key === 'M') {
            if (window.currentState === window.states.PLAYING ||
                window.currentState === window.states.PAUSED) {
                toggleMissionsPanel();
            }
        }
    });

    // ===============================
    // BOTONES UI
    // ===============================

    document.getElementById('playButton').onclick = () => showLevelSelect();
    document.getElementById('level1Button').onclick = () => startGame(1);
    document.getElementById('level2Button').onclick = () => startGame(2);
    document.getElementById('level3Button').onclick = () => startGame(3);
    document.getElementById('backToTitleButton').onclick = () => showTitleScreen();
    document.getElementById('globalScoresButton').onclick = () => showGlobalScores();

    document.getElementById('resumeButton').onclick = () => resumeGame();
    document.getElementById('restartButton').onclick = () => startGame(game.levelManager.currentLevel);
    document.getElementById('pauseBackToMenuButton').onclick = () => returnToMainMenu();

    document.getElementById('missionsButton').onclick = () => toggleMissionsPanel();
    document.getElementById('closeMissionsButton').onclick = () => closeMissionsPanel();

    if (ui.muteButton) {
        ui.muteButton.onclick = () => {
            game.audioManager.toggleMute();
            updateMuteButton();
        };
    }

    document.getElementById('gameOverBackToMenuButton').onclick = () => returnToMainMenu();

    document.getElementById('nextLevelButton').onclick = () => {
        ui.levelCompleteScreen.classList.add('hidden');

        if (game.levelManager.currentLevel < 3) {
            startGame(game.levelManager.currentLevel + 1);
        } else {
            returnToMainMenu();
        }
    };

    document.getElementById('levelCompleteBackToMenuButton').onclick = () => returnToMainMenu();

    // ===============================
    // GAME LOOP
    // ===============================

    function gameLoop() {
        if (game) {
            // Actualizar monitor de rendimiento
            if (window.performanceMonitor) {
                window.performanceMonitor.update();
            }

            if (window.currentState === window.states.PLAYING) {
                game.update();

                const itemCollisions = game.itemManager.checkCollisions(game.player);
                if (itemCollisions.portalEntered) {
                    console.log('Portal detectado en gameLoop');
                    showLevelComplete();
                }

                if (game.player && game.player.lives <= 0) {
                    showGameOver();
                }

                updateLivesDisplay();
                updateScoreDisplay();
                updateHighScoreDisplay();

                game.render();
            } else {
                game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);

                if (game.background) {
                    game.background.draw(game.ctx, game.canvas.width, game.canvas.height);

                    const tint = game.levelManager.getLevelTint();
                    if (tint) {
                        game.background.applyTint(game.ctx, tint, game.canvas.width, game.canvas.height);
                    }
                }
            }
        }

        requestAnimationFrame(gameLoop);
    }

    // ===============================
    // INICIALIZACIÓN
    // ===============================

    loadResources(function(resources) {
        console.log("Recursos cargados. Inicializando juego...");

        // Crear instancia del juego
        window.game = new Game(canvas);
        game.init(resources);

        // ==== ONLINE (WebSocket) ====
        // Conectar al servidor WebSocket

        window.globalScores = [];
        const WS_URL = 'wss://shadowwizard-online-server.onrender.com';
        wsClient.connect(WS_URL);

        // Cuando llegan mensajes del servidor (scores de otros jugadores, etc.)
        wsClient.onMessage((msg) => {
            // 1) Mensajes individuales de nivel completo → ONLINE FEED + RANKING LOCAL
            if (msg.type === 'level_complete') {
                // Feed visual
                if (!game.onlineFeed) game.onlineFeed = [];
                game.onlineFeed.unshift(msg);
                game.onlineFeed = game.onlineFeed.slice(0, 5); // máximo 5 mensajes

                // Actualizar ranking global local (Top 10 por score)
                const entry = {
                    player: msg.player ? msg.player : 'Jugador',
                    level: msg.level ? msg.level : '?',
                    stars: (msg.stars !== undefined && msg.stars !== null) ? msg.stars : 0,
                    score: (msg.score !== undefined && msg.score !== null) ? msg.score : 0,
                    time: (msg.time !== undefined && msg.time !== null) ? msg.time : 0,
                };

                window.globalScores.push(entry);
                window.globalScores.sort((a, b) => (b.score || 0) - (a.score || 0));
                window.globalScores = window.globalScores.slice(0, 10);
            }

            // 2) Si algún día el servidor envía snapshot, también lo usamos
            if (msg.type === 'scores_snapshot' && Array.isArray(msg.scores)) {
                window.globalScores = msg.scores.slice();
            }
        });



        // Inicializar controles táctiles
        window.touchControls = new TouchControls();
        window.touchControls.init();

        // Inicializar monitor de rendimiento
        window.performanceMonitor = new PerformanceMonitor();

        // Mostrar pantalla de título
        showTitleScreen();

        // Iniciar game loop
        gameLoop();

        console.log("Juego iniciado correctamente");
        console.log("Progreso guardado:", SaveManager.getProgressSummary());
    });
};