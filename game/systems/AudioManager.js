// Sistema de gestión de audio con soporte para música y efectos

class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = {};
        this.currentMusic = null;
        this.muted = false;
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
        
        // Cargar preferencia de mute desde localStorage
        const savedMute = localStorage.getItem('audioMuted');
        if (savedMute !== null) {
            this.muted = savedMute === 'true';
        }
    }

    /**
     * Carga un efecto de sonido
     * @param {string} key - Identificador del sonido
     * @param {string} src - Ruta del archivo de audio
     */
    loadSound(key, src) {
        const audio = new Audio(src);
        audio.volume = this.sfxVolume;
        this.sounds[key] = audio;
        console.log(`Sonido cargado: ${key}`);
    }

    /**
     * Carga música de fondo
     * @param {string} key - Identificador de la música
     * @param {string} src - Ruta del archivo de audio
     */
    loadMusic(key, src) {
        const audio = new Audio(src);
        audio.loop = true;
        audio.volume = this.musicVolume;
        this.music[key] = audio;
        console.log(`Música cargada: ${key}`);
    }

    /**
     * Reproduce un efecto de sonido
     * @param {string} key - Identificador del sonido
     */
    playSound(key) {
        if (this.muted || !this.sounds[key]) return;
        
        const sound = this.sounds[key].cloneNode();
        sound.volume = this.sfxVolume;
        sound.play().catch(e => console.warn(`Error reproduciendo ${key}:`, e));
    }

    /**
     * Reproduce música de fondo
     * @param {string} key - Identificador de la música
     * @param {boolean} fadeIn - Aplicar fade in
     */
    playMusic(key, fadeIn = true) {
        if (!this.music[key]) {
            console.warn(`Música no encontrada: ${key}`);
            return;
        }

        // Detener música actual con fade out
        if (this.currentMusic && this.currentMusic !== this.music[key]) {
            this.stopMusic(true);
        }

        this.currentMusic = this.music[key];
        
        if (this.muted) {
            this.currentMusic.volume = 0;
        } else if (fadeIn) {
            this.currentMusic.volume = 0;
            this.fadeIn(this.currentMusic);
        } else {
            this.currentMusic.volume = this.musicVolume;
        }

        this.currentMusic.currentTime = 0;
        this.currentMusic.play().catch(e => console.warn('Error reproduciendo música:', e));
    }

    /**
     * Detiene la música actual
     * @param {boolean} fadeOut - Aplicar fade out
     */
    stopMusic(fadeOut = true) {
        if (!this.currentMusic) return;

        if (fadeOut) {
            this.fadeOut(this.currentMusic, () => {
                this.currentMusic.pause();
                this.currentMusic.currentTime = 0;
            });
        } else {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }
    }

    /**
     * Pausa la música actual
     */
    pauseMusic() {
        if (this.currentMusic && !this.currentMusic.paused) {
            this.currentMusic.pause();
        }
    }

    /**
     * Reanuda la música pausada
     */
    resumeMusic() {
        if (this.currentMusic && this.currentMusic.paused && !this.muted) {
            this.currentMusic.play().catch(e => console.warn('Error reanudando música:', e));
        }
    }

    /**
     * Activa/desactiva el mute general
     */
    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('audioMuted', this.muted);

        if (this.muted) {
            if (this.currentMusic) {
                this.currentMusic.volume = 0;
            }
        } else {
            if (this.currentMusic) {
                this.currentMusic.volume = this.musicVolume;
                if (this.currentMusic.paused) {
                    this.currentMusic.play().catch(e => console.warn('Error:', e));
                }
            }
        }

        console.log(`Audio ${this.muted ? 'muteado' : 'activado'}`);
        return this.muted;
    }

    /**
     * Establece el volumen de la música
     * @param {number} volume - Volumen (0-1)
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.currentMusic && !this.muted) {
            this.currentMusic.volume = this.musicVolume;
        }
    }

    /**
     * Establece el volumen de los efectos
     * @param {number} volume - Volumen (0-1)
     */
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.sfxVolume;
        });
    }

    /**
     * Fade in gradual
     */
    fadeIn(audio) {
        audio.volume = 0;
        const targetVolume = this.musicVolume;
        const fadeStep = targetVolume / 50;
        
        const fadeInterval = setInterval(() => {
            if (audio.volume < targetVolume - fadeStep) {
                audio.volume += fadeStep;
            } else {
                audio.volume = targetVolume;
                clearInterval(fadeInterval);
            }
        }, 50);
    }

    /**
     * Fade out gradual
     */
    fadeOut(audio, callback) {
        const fadeStep = audio.volume / 50;
        
        const fadeInterval = setInterval(() => {
            if (audio.volume > fadeStep) {
                audio.volume -= fadeStep;
            } else {
                audio.volume = 0;
                clearInterval(fadeInterval);
                if (callback) callback();
            }
        }, 50);
    }

    /**
     * Obtiene el estado de mute
     */
    isMuted() {
        return this.muted;
    }

    /**
     * Precarga todos los recursos de audio
     */
    preloadAll() {
        console.log('Precargando audio...');
        
        // Música
        this.loadMusic('level1', 'assets/audio/music/level1.mp3');
        this.loadMusic('level2', 'assets/audio/music/level2.mp3');
        this.loadMusic('level3', 'assets/audio/music/level3.mp3');
        
        // Efectos
        this.loadSound('shoot', 'assets/audio/sfx/shoot.wav');
        this.loadSound('jump', 'assets/audio/sfx/jump.wav');
        this.loadSound('coin', 'assets/audio/sfx/coin.wav');
        this.loadSound('damage', 'assets/audio/sfx/damage.wav');
        this.loadSound('powerup', 'assets/audio/sfx/powerup.wav');
        this.loadSound('enemy-death', 'assets/audio/sfx/enemy-death.wav');
        this.loadSound('level-complete', 'assets/audio/sfx/level-complete.wav');
        this.loadSound('portal', 'assets/audio/sfx/portal.wav');
        console.log('Audio precargado completamente');
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}