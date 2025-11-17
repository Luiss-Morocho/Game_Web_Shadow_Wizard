const resources = {
    backgroundLayer1: 'assets/background/background_layer_1.png',
    backgroundLayer2: 'assets/background/background_layer_2.png',
    backgroundLayer3: 'assets/background/background_layer_3.png',
    player: 'assets/character/char_blue.png',
    shop: 'assets/decorations/shop.png',
    lamp: 'assets/decorations/lamp.png',
    tileset: 'assets/oak_woods_tileset.png',

    coin: 'assets/items/coin.png',
    powerup: 'assets/items/powerup.png',

    portalImage: 'assets/portal/portalx.png'
};

let loadedResources = 0;
const totalResources = Object.keys(resources).length;

function loadResources(callback) {
    const cacheBuster = Date.now();

    for (let key in resources) {
        const img = new Image();


        img.src = `${resources[key]}?v=${cacheBuster}`;
        img.onload = function() {
            loadedResources++;
            console.log(`${key} cargado correctamente`);
            if (loadedResources === totalResources) {
                callback();
            }
        };
        window[key] = img;
    }
}