// Sistema de persistencia con localStorage
// Guarda progreso, estadísticas y configuraciones del jugador

class SaveManager {
    /**
     * Guarda la finalización de un nivel
     * @param {number} level - Número de nivel (1-3)
     * @param {number} stars - Estrellas obtenidas (0-3)
     * @param {number} score - Puntaje obtenido
     * @param {number} time - Tiempo en segundos
     * @param {number} enemiesKilled - Enemigos eliminados
     */
    static saveLevelCompletion(level, stars, score, time, enemiesKilled) {
        const key = `level${level}`;
        const existing = this.getLevelInfo(level);
        
        // Guardar solo si es mejor que el anterior
        const newData = {
            level: level,
            stars: stars,
            bestStars: existing ? Math.max(existing.bestStars, stars) : stars,
            bestScore: existing ? Math.max(existing.bestScore, score) : score,
            bestTime: existing ? Math.min(existing.bestTime, time) : time,
            totalCompletions: existing ? existing.totalCompletions + 1 : 1,
            lastPlayed: Date.now(),
            enemiesKilled: enemiesKilled
        };
        
        localStorage.setItem(key, JSON.stringify(newData));
        
        // Desbloquear siguiente nivel
        if (level < 3) {
            this.unlockLevel(level + 1);
        }
        
        console.log(`Nivel ${level} guardado:`, newData);
        return newData;
    }

    /**
     * Obtiene información guardada de un nivel
     * @param {number} level - Número de nivel
     * @returns {Object|null}
     */
    static getLevelInfo(level) {
        const key = `level${level}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    /**
     * Desbloquea un nivel
     * @param {number} level - Número de nivel a desbloquear
     */
    static unlockLevel(level) {
        const unlockedLevels = this.getUnlockedLevels();
        if (!unlockedLevels.includes(level)) {
            unlockedLevels.push(level);
            localStorage.setItem('unlockedLevels', JSON.stringify(unlockedLevels));
            console.log(`Nivel ${level} desbloqueado`);
        }
    }

    /**
     * Obtiene los niveles desbloqueados
     * @returns {Array<number>}
     */
    static getUnlockedLevels() {
        const data = localStorage.getItem('unlockedLevels');
        // Por defecto, nivel 1 siempre está desbloqueado
        return data ? JSON.parse(data) : [1];
    }

    /**
     * Guarda el high score global
     * @param {number} score - Puntaje a guardar
     * @returns {boolean} - true si es un nuevo récord
     */
    static saveHighScore(score) {
        const currentHighScore = this.getHighScore();
        
        if (score > currentHighScore) {
            localStorage.setItem('highScore', score.toString());
            console.log(`¡NUEVO RÉCORD! ${score} puntos`);
            return true;
        }
        
        return false;
    }

    /**
     * Obtiene el high score global
     * @returns {number}
     */
    static getHighScore() {
        const score = localStorage.getItem('highScore');
        return score ? parseInt(score) : 0;
    }

    /**
     * Guarda estadísticas globales del jugador
     * @param {number} enemiesKilled - Enemigos eliminados en esta sesión
     * @param {number} coinsCollected - Monedas recogidas
     * @param {number} timePlayed - Tiempo jugado en segundos
     */
    static updateGlobalStats(enemiesKilled, coinsCollected, timePlayed) {
        const stats = this.getGlobalStats();
        
        stats.totalEnemiesKilled += enemiesKilled;
        stats.totalCoinsCollected += coinsCollected;
        stats.totalTimePlayed += timePlayed;
        stats.totalGamesPlayed += 1;
        stats.lastPlayed = Date.now();
        
        localStorage.setItem('globalStats', JSON.stringify(stats));
        console.log('Estadísticas globales actualizadas:', stats);
        return stats;
    }

    /**
     * Obtiene las estadísticas globales
     * @returns {Object}
     */
    static getGlobalStats() {
        const data = localStorage.getItem('globalStats');
        
        if (data) {
            return JSON.parse(data);
        }
        
        // Estadísticas por defecto
        return {
            totalEnemiesKilled: 0,
            totalCoinsCollected: 0,
            totalTimePlayed: 0,
            totalGamesPlayed: 0,
            lastPlayed: null
        };
    }

    /**
     * Guarda preferencias del usuario
     * @param {string} key - Nombre de la preferencia
     * @param {any} value - Valor a guardar
     */
    static savePreference(key, value) {
        const prefs = this.getPreferences();
        prefs[key] = value;
        localStorage.setItem('preferences', JSON.stringify(prefs));
    }

    /**
     * Obtiene una preferencia específica
     * @param {string} key - Nombre de la preferencia
     * @param {any} defaultValue - Valor por defecto
     * @returns {any}
     */
    static getPreference(key, defaultValue = null) {
        const prefs = this.getPreferences();
        return prefs.hasOwnProperty(key) ? prefs[key] : defaultValue;
    }

    /**
     * Obtiene todas las preferencias
     * @returns {Object}
     */
    static getPreferences() {
        const data = localStorage.getItem('preferences');
        return data ? JSON.parse(data) : {
            soundEnabled: true,
            musicEnabled: true,
            volume: 0.7
        };
    }

    /**
     * Resetea el progreso de un nivel específico
     * @param {number} level - Número de nivel
     */
    static resetLevel(level) {
        const key = `level${level}`;
        localStorage.removeItem(key);
        console.log(`Progreso del nivel ${level} reseteado`);
    }

    /**
     * Resetea TODO el progreso del juego
     */
    static resetAllProgress() {
        // Eliminar datos de niveles
        for (let i = 1; i <= 3; i++) {
            localStorage.removeItem(`level${i}`);
        }
        
        // Resetear niveles desbloqueados
        localStorage.setItem('unlockedLevels', JSON.stringify([1]));
        
        // Resetear high score
        localStorage.removeItem('highScore');
        
        // Resetear estadísticas
        localStorage.removeItem('globalStats');
        
        console.log('TODO el progreso ha sido reseteado');
    }

    /**
     * Exporta todos los datos guardados
     * @returns {Object}
     */
    static exportSaveData() {
        const saveData = {
            levels: {},
            highScore: this.getHighScore(),
            unlockedLevels: this.getUnlockedLevels(),
            globalStats: this.getGlobalStats(),
            preferences: this.getPreferences(),
            exportDate: new Date().toISOString()
        };
        
        // Agregar datos de cada nivel
        for (let i = 1; i <= 3; i++) {
            const levelData = this.getLevelInfo(i);
            if (levelData) {
                saveData.levels[`level${i}`] = levelData;
            }
        }
        
        return saveData;
    }

    /**
     * Importa datos guardados
     * @param {Object} saveData - Datos a importar
     * @returns {boolean} - true si se importó correctamente
     */
    static importSaveData(saveData) {
        try {
            // Validar estructura básica
            if (!saveData || typeof saveData !== 'object') {
                throw new Error('Datos inválidos');
            }
            
            // Importar high score
            if (saveData.highScore) {
                localStorage.setItem('highScore', saveData.highScore.toString());
            }
            
            // Importar niveles desbloqueados
            if (saveData.unlockedLevels) {
                localStorage.setItem('unlockedLevels', JSON.stringify(saveData.unlockedLevels));
            }
            
            // Importar estadísticas
            if (saveData.globalStats) {
                localStorage.setItem('globalStats', JSON.stringify(saveData.globalStats));
            }
            
            // Importar preferencias
            if (saveData.preferences) {
                localStorage.setItem('preferences', JSON.stringify(saveData.preferences));
            }
            
            // Importar datos de niveles
            if (saveData.levels) {
                for (const [key, value] of Object.entries(saveData.levels)) {
                    localStorage.setItem(key, JSON.stringify(value));
                }
            }
            
            console.log('Datos importados correctamente');
            return true;
        } catch (error) {
            console.error('Error al importar datos:', error);
            return false;
        }
    }

    /**
     * Obtiene un resumen del progreso
     * @returns {Object}
     */
    static getProgressSummary() {
        const summary = {
            highScore: this.getHighScore(),
            unlockedLevels: this.getUnlockedLevels(),
            totalStars: 0,
            levelsCompleted: 0,
            globalStats: this.getGlobalStats()
        };
        
        for (let i = 1; i <= 3; i++) {
            const levelInfo = this.getLevelInfo(i);
            if (levelInfo) {
                summary.totalStars += levelInfo.bestStars;
                summary.levelsCompleted++;
            }
        }
        
        return summary;
    }

    /**
     * Verifica si hay datos guardados
     * @returns {boolean}
     */
    static hasSaveData() {
        return localStorage.getItem('highScore') !== null ||
               localStorage.getItem('level1') !== null ||
               localStorage.getItem('globalStats') !== null;
    }

    /**
     * Obtiene el tamaño aproximado de los datos guardados (en KB)
     * @returns {number}
     */
    static getSaveDataSize() {
        let totalSize = 0;
        
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += localStorage[key].length + key.length;
            }
        }
        
        // Convertir a KB
        return (totalSize / 1024).toFixed(2);
    }
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SaveManager;
}