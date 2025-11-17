window.states = {
    TITLE_SCREEN: 0,
    LEVEL_SELECT: 1,
    PLAYING: 2,
    PAUSED: 3,
    GAME_OVER: 4,
    LEVEL_COMPLETE: 5
};

window.currentState = window.states.TITLE_SCREEN;

function changeState(newState) {
    window.currentState = newState;
    console.log("Estado cambiado a: " + newState);
}

// Estas funciones solo loguearán, main.js hará el trabajo
function startGame() {
    console.log("Iniciando el juego...");
}

function showMenu() {
    console.log("Mostrando el menú...");
}

function showGameOver() {
    console.log("Mostrando Game Over...");
}