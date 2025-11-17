// Sistema de controles táctiles para dispositivos móviles

class TouchControls {
    constructor() {
        this.container = null;
        this.buttons = {
            left: null,
            right: null,
            jump: null,
            shoot: null
        };
        
        this.touchStates = {
            left: false,
            right: false,
            jump: false,
            shoot: false
        };
        
        // IDs de los toques activos para cada botón
        this.activeTouches = {
            left: null,
            right: null,
            jump: null,
            shoot: null
        };
        
        this.enabled = this.isTouchDevice();
        this.visible = false;
    }

    /**
     * Detecta si el dispositivo tiene capacidades táctiles
     * @returns {boolean}
     */
    isTouchDevice() {
        return (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0
        );
    }

    /**
     * Inicializa los controles táctiles
     */
    init() {
        if (!this.enabled) {
            console.log('Touch controls deshabilitados (no es dispositivo táctil)');
            return;
        }

        this.createControls();
        this.setupEventListeners();
        
        console.log('Touch controls inicializados');
    }

    /**
     * Crea los elementos HTML de los controles
     */
    createControls() {
        // Contenedor principal
        this.container = document.createElement('div');
        this.container.id = 'touchControls';
        this.container.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 200px;
            pointer-events: none;
            z-index: 200;
            display: none;
        `;

        // Botón IZQUIERDA
        this.buttons.left = this.createButton('◄', {
            left: '20px',
            bottom: '20px',
            width: '80px',
            height: '80px'
        });

        // Botón DERECHA
        this.buttons.right = this.createButton('►', {
            left: '120px',
            bottom: '20px',
            width: '80px',
            height: '80px'
        });

        // Botón SALTAR
        this.buttons.jump = this.createButton('↑', {
            right: '120px',
            bottom: '20px',
            width: '80px',
            height: '80px'
        });

        // Botón DISPARAR
        this.buttons.shoot = this.createButton('D', {
            right: '20px',
            bottom: '20px',
            width: '80px',
            height: '80px'
        });

        // Agregar botones al contenedor
        Object.values(this.buttons).forEach(button => {
            this.container.appendChild(button);
        });

        // Agregar al DOM
        document.body.appendChild(this.container);
    }

    /**
     * Crea un botón táctil individual
     * @param {string} label - Texto del botón
     * @param {Object} position - Posición CSS
     * @returns {HTMLElement}
     */
    createButton(label, position) {
        const button = document.createElement('div');
        button.className = 'touch-button';
        button.textContent = label;
        
        // Aplicar estilos de posición
        Object.assign(button.style, {
            position: 'absolute',
            background: 'rgba(255, 255, 255, 0.2)',
            border: '3px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            color: 'white',
            textShadow: '2px 2px 4px black',
            pointerEvents: 'auto',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            touchAction: 'none',
            ...position
        });

        return button;
    }

    /**
     * Configura los event listeners para los controles táctiles
     */
    setupEventListeners() {
        // Mapeo de botones a teclas del teclado
        const buttonKeyMap = {
            left: 'ArrowLeft',
            right: 'ArrowRight',
            jump: ' ',
            shoot: 'd'
        };

        // Configurar cada botón
        Object.entries(this.buttons).forEach(([action, button]) => {
            // Touch Start
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                
                const touch = e.changedTouches[0];
                this.activeTouches[action] = touch.identifier;
                this.touchStates[action] = true;
                
                // Simular keydown
                this.simulateKeyEvent('keydown', buttonKeyMap[action]);
                
                // Efecto visual
                button.style.background = 'rgba(255, 255, 255, 0.5)';
                button.style.transform = 'scale(0.95)';
            });

            // Touch End
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                
                const touch = e.changedTouches[0];
                if (this.activeTouches[action] === touch.identifier) {
                    this.activeTouches[action] = null;
                    this.touchStates[action] = false;
                    
                    // Simular keyup
                    this.simulateKeyEvent('keyup', buttonKeyMap[action]);
                    
                    // Restaurar visual
                    button.style.background = 'rgba(255, 255, 255, 0.2)';
                    button.style.transform = 'scale(1)';
                }
            });

            // Touch Cancel (cuando se pierde el toque)
            button.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                
                const touch = e.changedTouches[0];
                if (this.activeTouches[action] === touch.identifier) {
                    this.activeTouches[action] = null;
                    this.touchStates[action] = false;
                    
                    // Simular keyup
                    this.simulateKeyEvent('keyup', buttonKeyMap[action]);
                    
                    // Restaurar visual
                    button.style.background = 'rgba(255, 255, 255, 0.2)';
                    button.style.transform = 'scale(1)';
                }
            });
        });

        // Prevenir el comportamiento por defecto en todo el contenedor
        this.container.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
    }

    /**
     * Simula un evento de teclado
     * @param {string} type - 'keydown' o 'keyup'
     * @param {string} key - Tecla a simular
     */
    simulateKeyEvent(type, key) {
        if (!window.game || !window.game.keys) return;

        // Actualizar el estado de las teclas del juego
        if (type === 'keydown') {
            window.game.keys[key] = true;
        } else if (type === 'keyup') {
            window.game.keys[key] = false;
        }
    }

    /**
     * Muestra u oculta los controles
     * @param {boolean} visible
     */
    setVisible(visible) {
        if (!this.enabled || !this.container) return;

        this.visible = visible;
        this.container.style.display = visible ? 'block' : 'none';
        
        // Resetear estados si se ocultan
        if (!visible) {
            this.resetAllStates();
        }
    }

    /**
     * Resetea todos los estados de los botones
     */
    resetAllStates() {
        Object.keys(this.touchStates).forEach(key => {
            this.touchStates[key] = false;
            this.activeTouches[key] = null;
        });

        Object.values(this.buttons).forEach(button => {
            button.style.background = 'rgba(255, 255, 255, 0.2)';
            button.style.transform = 'scale(1)';
        });

        // Resetear teclas del juego
        if (window.game && window.game.keys) {
            window.game.keys['ArrowLeft'] = false;
            window.game.keys['ArrowRight'] = false;
            window.game.keys[' '] = false;
            window.game.keys['d'] = false;
        }
    }

    /**
     * Obtiene el estado de un botón específico
     * @param {string} action - 'left', 'right', 'jump', 'shoot'
     * @returns {boolean}
     */
    isPressed(action) {
        return this.touchStates[action] || false;
    }

    /**
     * Cambia el tamaño de los botones
     * @param {number} size - Tamaño en píxeles
     */
    setButtonSize(size) {
        Object.values(this.buttons).forEach(button => {
            button.style.width = `${size}px`;
            button.style.height = `${size}px`;
            button.style.fontSize = `${size * 0.35}px`;
        });
    }

    /**
     * Cambia la opacidad de los botones
     * @param {number} opacity - Valor entre 0 y 1
     */
    setOpacity(opacity) {
        const clampedOpacity = Math.max(0, Math.min(1, opacity));
        Object.values(this.buttons).forEach(button => {
            button.style.opacity = clampedOpacity.toString();
        });
    }

    /**
     * Destruye los controles táctiles
     */
    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        
        this.container = null;
        this.buttons = {};
        this.touchStates = {};
        this.activeTouches = {};
    }

    /**
     * Obtiene información de estado para debugging
     * @returns {Object}
     */
    getDebugInfo() {
        return {
            enabled: this.enabled,
            visible: this.visible,
            touchStates: { ...this.touchStates },
            activeTouches: { ...this.activeTouches }
        };
    }
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TouchControls;
}