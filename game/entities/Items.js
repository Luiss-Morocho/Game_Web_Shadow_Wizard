// Clases para items coleccionables y portal en el juego

class Coin extends Entity {
    constructor(x, y, image) {
        super(x, y, 32, 32);
        this.image = image;
        this.collected = false;
        this.value = 10;
        
        // HITBOX AJUSTADA - un poco más pequeña que el sprite
        this.hitboxWidth = 28;
        this.hitboxHeight = 28;
        this.hitboxOffsetX = 2;
        this.hitboxOffsetY = 2;
        
        this.animationFrame = 0;
    }

    /**
     * Obtiene la hitbox de la moneda
     */
    getHitbox() {
        return {
            x: this.x + this.hitboxOffsetX,
            y: this.y + this.hitboxOffsetY,
            width: this.hitboxWidth,
            height: this.hitboxHeight
        };
    }

    /**
     * Verifica colisión usando la hitbox ajustada
     */
    collidesWith(other) {
        const hitbox = this.getHitbox();
        
        if (other.getHitbox) {
            const otherHitbox = other.getHitbox();
            return (
                hitbox.x < otherHitbox.x + otherHitbox.width &&
                hitbox.x + hitbox.width > otherHitbox.x &&
                hitbox.y < otherHitbox.y + otherHitbox.height &&
                hitbox.y + hitbox.height > otherHitbox.y
            );
        }
        
        return (
            hitbox.x < other.x + other.width &&
            hitbox.x + hitbox.width > other.x &&
            hitbox.y < other.y + other.height &&
            hitbox.y + hitbox.height > other.y
        );
    }

    update() {
        this.animationFrame += 0.1;
    }

    draw(ctx) {
        if (!this.collected && this.image) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    collect() {
        if (!this.collected) {
            this.collected = true;
            return this.value;
        }
        return 0;
    }
}

class PowerUp extends Entity {
    constructor(x, y, image) {
        super(x, y, 140, 100);
        this.image = image;
        this.collected = false;
        this.speedY = 1.0;
        
        // HITBOX AJUSTADA - mucho más pequeña que el sprite visual
        this.hitboxWidth = 70;
        this.hitboxHeight = 50;
        this.hitboxOffsetX = 35;
        this.hitboxOffsetY = 25;
    }

    /**
     * Obtiene la hitbox del power-up
     */
    getHitbox() {
        return {
            x: this.x + this.hitboxOffsetX,
            y: this.y + this.hitboxOffsetY,
            width: this.hitboxWidth,
            height: this.hitboxHeight
        };
    }

    /**
     * Verifica colisión usando la hitbox ajustada
     */
    collidesWith(other) {
        const hitbox = this.getHitbox();
        
        if (other.getHitbox) {
            const otherHitbox = other.getHitbox();
            return (
                hitbox.x < otherHitbox.x + otherHitbox.width &&
                hitbox.x + hitbox.width > otherHitbox.x &&
                hitbox.y < otherHitbox.y + otherHitbox.height &&
                hitbox.y + hitbox.height > otherHitbox.y
            );
        }
        
        return (
            hitbox.x < other.x + other.width &&
            hitbox.x + hitbox.width > other.x &&
            hitbox.y < other.y + other.height &&
            hitbox.y + hitbox.height > other.y
        );
    }

    update(canvasHeight) {
        this.y += this.speedY;
        
        if (this.y > canvasHeight) {
            this.collected = true;
        }
    }

    draw(ctx) {
        if (!this.collected && this.image) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    collect() {
        if (!this.collected) {
            this.collected = true;
            return true;
        }
        return false;
    }
}

class Portal extends Entity {
    constructor(x, y, image) {
        super(x, y, 275, 300);
        this.image = image;
        this.active = true;
        
        // HITBOX AJUSTADA - área central del portal
        this.hitboxWidth = 120;
        this.hitboxHeight = 200;
        this.hitboxOffsetX = 77;
        this.hitboxOffsetY = 50;
        
        this.animationFrame = 0;
        this.animationSpeed = 0.1;
    }

    /**
     * Obtiene la hitbox del portal
     */
    getHitbox() {
        return {
            x: this.x + this.hitboxOffsetX,
            y: this.y + this.hitboxOffsetY,
            width: this.hitboxWidth,
            height: this.hitboxHeight
        };
    }

    /**
     * Verifica colisión usando la hitbox ajustada
     */
    collidesWith(other) {
        const hitbox = this.getHitbox();
        
        if (other.getHitbox) {
            const otherHitbox = other.getHitbox();
            return (
                hitbox.x < otherHitbox.x + otherHitbox.width &&
                hitbox.x + hitbox.width > otherHitbox.x &&
                hitbox.y < otherHitbox.y + otherHitbox.height &&
                hitbox.y + hitbox.height > otherHitbox.y
            );
        }
        
        return (
            hitbox.x < other.x + other.width &&
            hitbox.x + hitbox.width > other.x &&
            hitbox.y < other.y + other.height &&
            hitbox.y + hitbox.height > other.y
        );
    }

    update() {
        this.animationFrame += this.animationSpeed;
    }

    draw(ctx) {
        if (this.active && this.image) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            
            // DEBUG: Descomentar para ver la hitbox
            // this.drawHitbox(ctx);
        }
    }

    /**
     * Dibuja la hitbox para debugging
     */
    drawHitbox(ctx) {
        const hitbox = this.getHitbox();
        ctx.strokeStyle = 'cyan';
        ctx.lineWidth = 2;
        ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
    }

    enter() {
        return this.active;
    }
}

// Manager para manejar todos los items
class ItemManager {
    constructor() {
        this.coins = [];
        this.powerUps = [];
        this.portal = null;
    }

    addCoin(x, y, image) {
        this.coins.push(new Coin(x, y, image));
    }

    spawnPowerUp(cameraX, canvasWidth, image) {
        const randomX = Math.random() * (canvasWidth - 40);
        const spawnX = randomX + cameraX;
        this.powerUps.push(new PowerUp(spawnX, -50, image));
    }

    setPortal(x, y, image) {
        this.portal = new Portal(x, y, image);
    }

    update(canvasHeight) {
        this.coins.forEach(c => {
            if (!c.collected) c.update();
        });
        
        this.powerUps.forEach(p => {
            if (!p.collected) p.update(canvasHeight);
        });
        
        if (this.portal) {
            this.portal.update();
        }
        
        this.coins = this.coins.filter(c => !c.collected);
        this.powerUps = this.powerUps.filter(p => !p.collected);
    }

    draw(ctx) {
        this.coins.forEach(c => c.draw(ctx));
        this.powerUps.forEach(p => p.draw(ctx));
        if (this.portal) {
            this.portal.draw(ctx);
        }
    }

    checkCollisions(player) {
        let score = 0;
        let powerUpCollected = false;
        let portalEntered = false;

        // Colisión con monedas
        this.coins.forEach(coin => {
            if (!coin.collected && coin.collidesWith(player)) {
                score += coin.collect();
                console.log(`Moneda recogida! +${coin.value} puntos`);
            }
        });

        // Colisión con power-ups
        this.powerUps.forEach(powerUp => {
            if (!powerUp.collected && powerUp.collidesWith(player)) {
                if (powerUp.collect()) {
                    powerUpCollected = true;
                    console.log('Power-up recogido!');
                }
            }
        });

        // Colisión con portal - MEJORADA
        if (this.portal && this.portal.active) {
            const playerHitbox = player.getHitbox();
            const portalHitbox = this.portal.getHitbox();
            
            const collision = (
                playerHitbox.x < portalHitbox.x + portalHitbox.width &&
                playerHitbox.x + playerHitbox.width > portalHitbox.x &&
                playerHitbox.y < portalHitbox.y + portalHitbox.height &&
                playerHitbox.y + playerHitbox.height > portalHitbox.y
            );
            
            if (collision) {
                portalEntered = this.portal.enter();
                console.log('¡Portal activado! Nivel completado');
            }
        }

        return { score, powerUpCollected, portalEntered };
    }

    clear() {
        this.coins = [];
        this.powerUps = [];
        this.portal = null;
    }

    getCoinCount() {
        return this.coins.length;
    }

    getPowerUpCount() {
        return this.powerUps.length;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Coin, PowerUp, Portal, ItemManager };
}