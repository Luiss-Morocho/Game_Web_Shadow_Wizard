window.enemies = [];

class Enemy {
    constructor(x, y, sprites) {
        this.sprites = sprites;
        this.x = x;
        this.y = y;
        this.startX = x;

        this.width = 200;
        this.height = 140;

        this.frame = 0;
        this.animationSpeed = 0.2;

        this.speed = 0.7;
        this.direction = 1;
        this.patrolRange = 150;

        this.health = 3; // Vida estándar
        this.isAlive = true;
    }

    /**
     * Actualiza la lógica del enemigo (movimiento y animación)
     * Acepta 'player' para que la llamada sea uniforme, aunque no lo usa.
     */
    update(player) {
        if (!this.isAlive) return;

        // 1. Actualizar Movimiento (Patrulla)
        this.x += this.speed * this.direction;
        if (this.x > this.startX + this.patrolRange) {
            this.direction = -1;
        } else if (this.x < this.startX - this.patrolRange) {
            this.direction = 1;
        }

        // 2. Actualizar Animación
        this.frame = (this.frame + this.animationSpeed) % this.sprites.length;
    }

    draw(ctx) {
        if (!this.isAlive) return;
        const currentFrame = this.sprites[Math.floor(this.frame)];
        if (currentFrame) {
            ctx.drawImage(
                currentFrame,
                this.x,
                this.y,
                this.width,
                this.height
            );
        }
    }

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.isAlive = false;
            return true; // Murió
        }
        return false; // Sigue vivo
    }
}


// ======================================================
// CHASER ENEMY (Perseguidor)
// ======================================================
class ChaserEnemy {
    constructor(x, y, sprites) {
        this.sprites = sprites;
        this.x = x;
        this.y = y;
        this.startX = x; // Posición original para volver

        this.width = 190;
        this.height = 120;

        this.frame = 0;
        this.animationSpeed = 0.4; // Se anima más rápido

        this.speed = 0.9; // Velocidad de patrulla
        this.chaseSpeed = 1.4; // ¡Más rápido al perseguir!
        this.direction = 1;
        this.patrolRange = 100;
        this.detectionRange = 500; // Rango de visión (en píxeles)

        this.health = 5; // Más fuerte
        this.isAlive = true;
    }

    /**
     * Actualiza la lógica del enemigo (persecución o patrulla)
     */
    update(player) {
        if (!this.isAlive) return;

        // Calcular distancia al jugador
        const dx = player.x - this.x;
        const distance = Math.abs(dx);

        // 1. Lógica de Movimiento
        if (distance < this.detectionRange) {
            // ¡PERSEGUIR!
            if (player.x > this.x) {
                this.x += this.chaseSpeed;
                this.direction = 1;
            } else {
                this.x -= this.chaseSpeed;
                this.direction = -1;
            }
        } else {
            // PATRULLAR (Volver a la zona de inicio si se alejó)
            if (this.x > this.startX + this.patrolRange) {
                this.direction = -1;
            } else if (this.x < this.startX - this.patrolRange) {
                this.direction = 1;
            }
            this.x += this.speed * this.direction;
        }

        // 2. Actualizar Animación
        this.frame = (this.frame + this.animationSpeed) % this.sprites.length;
    }

    draw(ctx) {
        if (!this.isAlive) return;
        const currentFrame = this.sprites[Math.floor(this.frame)];
        if (currentFrame) {
            // Opcional: Tinte rojo para que se vea diferente
            ctx.filter = 'hue-rotate(-30deg) saturate(2)';
            ctx.drawImage(
                currentFrame,
                this.x,
                this.y,
                this.width,
                this.height
            );
            ctx.filter = 'none'; // Resetear filtro
        }
    }

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.isAlive = false;
            return true; // Murió
        }
        return false; // Sigue vivo
    }
}


function initEnemies(enemySprites, canvas) {

    window.enemies = [];
    const groundLevel = canvas.height - 170; // player.height
    const tileH = 24;
    const enemyH = 100;
    const enemyYOffset = enemyH + 20;
    const OFFSET = 500; // MISMO OFFSET

    // Enemigo 1: Patrullero en la primera plataforma (x ≈ 400 + OFFSET)
    window.enemies.push(
        new Enemy(450 + OFFSET, groundLevel - (tileH * 2) - enemyYOffset, enemySprites)
    );

    // Enemigo 2: PERSEGUIDOR en el camino superior medio (x ≈ 900 + OFFSET)
    window.enemies.push(
        new ChaserEnemy(1000 + OFFSET, groundLevel - (tileH * 8) - enemyYOffset, enemySprites)
    );

    // Enemigo 3: Patrullero en el camino inferior (x ≈ 1400 + OFFSET)
    window.enemies.push(
        new Enemy(1500 + OFFSET, groundLevel - enemyYOffset, enemySprites)
    );

    // Enemigo 4: Patrullero en la "Cima" (x ≈ 1500 + OFFSET)
    window.enemies.push(
        new Enemy(1600 + OFFSET, groundLevel - (tileH * 15) - enemyYOffset, enemySprites)
    );

    // Enemigo 5: PERSEGUIDOR en el camino inferior (x ≈ 950 + OFFSET)
    window.enemies.push(
        new ChaserEnemy(1000 + OFFSET, groundLevel - enemyYOffset, enemySprites)
    );

    // Enemigo 6: Patrullero en la plataforma de conexión (x ≈ 2200 + OFFSET)
    window.enemies.push(
        new Enemy(2300 + OFFSET, groundLevel - (tileH * 3) - enemyYOffset, enemySprites)
    );

    // Enemigo 7: Guardián del portal (en el suelo, cerca del portal)
    window.enemies.push(
        new ChaserEnemy(3300 + OFFSET, groundLevel - enemyYOffset, enemySprites)
    );

    console.log(`Enemigos inicializados: ${window.enemies.length} creados.`);
}

// ======================================================
// ENEMIGOS NIVEL 2
// ======================================================
function initEnemiesLevel2(enemySprites, canvas) {
    window.enemies = [];

    const OFFSET = 500;
    const groundLevel = canvas.height - 170;

    // Enemigos en el suelo
    for (let x = 900; x <= 2000; x += 300) {
        window.enemies.push(new Enemy(x + OFFSET, groundLevel - 80, enemySprites));
    }

    // Enemigos en plataformas medias
    const y_mid = groundLevel - 24 * 7;
    for (let x = 1400; x <= 1800; x += 200) {
        window.enemies.push(new Enemy(x + OFFSET, y_mid - 80, enemySprites));
    }

    // Enemigos en plataformas altas
    const y_high = groundLevel - 24 * 12;
    for (let x = 2600; x <= 3300; x += 250) {
        window.enemies.push(new Enemy(x + OFFSET, y_high - 80, enemySprites));
    }

    // Enemigo fuerte cerca del portal
    window.enemies.push(new Enemy(4400 + OFFSET, groundLevel - 80, enemySprites));
}

// ======================================================
// ENEMIGOS NIVEL 3 (Más agresivo)
// ======================================================
function initEnemiesLevel3(enemySprites, canvas) {
    window.enemies = [];

    const OFFSET = 500;
    const groundLevel = canvas.height - 170;

    // Suelo: patrulleros
    for (let x = 900; x <= 2300; x += 300) {
        window.enemies.push(new Enemy(x + OFFSET, groundLevel - 100, enemySprites));
    }

    // Plataforma media izquierda
    const y1 = groundLevel - 24 * 6;
    window.enemies.push(new ChaserEnemy(1500 + OFFSET, y1 - 100, enemySprites));
    window.enemies.push(new Enemy(1650 + OFFSET, y1 - 100, enemySprites));

    // Plataforma media alta
    const y2 = groundLevel - 24 * 10;
    window.enemies.push(new Enemy(2100 + OFFSET, y2 - 100, enemySprites));
    window.enemies.push(new ChaserEnemy(2300 + OFFSET, y2 - 100, enemySprites));

    // Plataforma superior
    const y3 = groundLevel - 24 * 14;
    window.enemies.push(new ChaserEnemy(2600 + OFFSET, y3 - 100, enemySprites));
    window.enemies.push(new Enemy(2800 + OFFSET, y3 - 100, enemySprites));

    // Escalera descendente
    for (let x = 3000; x <= 3300; x += 150) {
        window.enemies.push(new Enemy(x + OFFSET, groundLevel - 150, enemySprites));
    }

    // Guardián del portal (muy fuerte)
    window.enemies.push(new ChaserEnemy(4300 + OFFSET, groundLevel - 100, enemySprites));

    console.log(`Enemigos Nivel 3: ${window.enemies.length}`);
}