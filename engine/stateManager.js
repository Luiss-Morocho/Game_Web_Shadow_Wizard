// engine/stateManager.js

// Usamos 'const' en lugar de 'var' para un módulo moderno
const stateManager = {
    states: {},
    currentState: null,
    
    addState: function(name, state) {
        this.states[name] = state;
    },
    
    setState: function(name) {
        if (this.states[name]) {
            this.currentState = this.states[name];
            if (this.currentState.enter) {
                this.currentState.enter(); // Llama al método enter del estado
            }
        }
    },
    
    update: function(dt) {
        if (this.currentState && this.currentState.update) {
            this.currentState.update(dt);
        }
    },
    
    render: function() {
        if (this.currentState && this.currentState.render) {
            this.currentState.render();
        }
    }
};

// Exportamos tu objeto 'stateManager' como el "default"
export default stateManager;