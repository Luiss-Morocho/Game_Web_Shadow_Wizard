// Clases de enemigos y gestor de enemigos

class Enemy extends Entity {
    constructor(x, y, spriteSheet) {
        super(x, y, 200, 140);
        
        this.spriteSheet = spriteSheet;
        this.startX = x;
        
        // HITBOX AJUSTADA
        this.hitboxWidth = 120;
        this.hitboxHeight = 100;
        this.hitboxOffsetX = 40;
        this.hitboxOffsetY = 20;
        
        // Animación
        this.frame = 0;
        this.animationSpeed = 0.1;   // VELOCIDAD DE ANIMACIÓN (fps)
                                     // Valores más altos = animación más rápida
                                     // 0.1 = lento, 0.5 = rápido
        
        // Movimiento
        this.speed = 0.7;           // VELOCIDAD DEL ENEMIGO NORMAL
        this.direction = 1;
        this.patrolRange = 150;     // RANGO DE PATRULLA (distancia que recorre)
        
        // Estado
        this.health = 2;
        this.maxHealth = 2;
        this.alive = true;
    }

    /**
     * Obtiene la hitbox real del enemigo
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
        
        // Si el otro objeto tiene hitbox propia, usarla
        if (other.getHitbox) {
            const otherHitbox = other.getHitbox();
            return (
                hitbox.x < otherHitbox.x + otherHitbox.width &&
                hitbox.x + hitbox.width > otherHitbox.x &&
                hitbox.y < otherHitbox.y + otherHitbox.height &&
                hitbox.y + hitbox.height > otherHitbox.y
            );
        }
        
        // Si no, usar su posición directa
        return (
            hitbox.x < other.x + other.width &&
            hitbox.x + hitbox.width > other.x &&
            hitbox.y < other.y + other.height &&
            hitbox.y + hitbox.height > other.y
        );
    }

    /**
     * Actualiza el enemigo (patrulla)
     */
    update() {
        if (!this.alive) return;

        // Movimiento de patrulla
        this.x += this.speed * this.direction;
        
        // Cambiar dirección en los límites de patrulla
        if (this.x > this.startX + this.patrolRange) {
            this.direction = -1;
        } else if (this.x < this.startX - this.patrolRange) {
            this.direction = 1;
        }

        // Actualizar animación
        if (this.spriteSheet) {
            const maxFrames = this.spriteSheet.getFrameCount();
            this.frame = (this.frame + this.animationSpeed) % maxFrames;
        }
    }

    /**
     * Dibuja el enemigo
     */
    draw(ctx) {
        if (!this.alive || !this.spriteSheet) return;

        const frameIndex = Math.floor(this.frame);
        const flipX = this.direction === -1;

        this.spriteSheet.drawFrame(
            ctx, 
            frameIndex, 
            this.x, 
            this.y, 
            this.width, 
            this.height,
            flipX
        );

        // DEBUG: Descomentar para ver la hitbox
        // this.drawHitbox(ctx);
    }

    /**
     * Dibuja la hitbox para debugging
     */
    drawHitbox(ctx) {
        const hitbox = this.getHitbox();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
    }

    /**
     * Recibe daño
     */
    takeDamage(damage) {
        if (!this.alive) return false;

        this.health -= damage;
        
        if (this.health <= 0) {
            this.alive = false;
            return true;
        }
        
        return false;
    }
}

class ChaserEnemy extends Enemy {
    constructor(x, y, spriteSheet) {
        super(x, y, spriteSheet);
        
        this.width = 190;
        this.height = 120;
        
        // HITBOX AJUSTADA para perseguidor
        this.hitboxWidth = 110;
        this.hitboxHeight = 90;
        this.hitboxOffsetX = 40;
        this.hitboxOffsetY = 15;
        
        // Configuración específica del perseguidor
        this.animationSpeed = 0.25;     // VELOCIDAD DE ANIMACIÓN DEL CHASER
                                        // Más rápida porque es más agresivo
        this.speed = 0.9;              // VELOCIDAD AL PATRULLAR
        this.chaseSpeed = 1.4;         // VELOCIDAD AL PERSEGUIR
        this.detectionRange = 500;     // DISTANCIA PARA DETECTAR AL JUGADOR
        
        this.health = 4;
        this.maxHealth = 4;
        
        this.isChasing = false;
    }

    /**
     * Actualiza el perseguidor
     */
    update(player) {
        if (!this.alive) return;

        // Calcular distancia al jugador
        const dx = player.x - this.x;
        const distance = Math.abs(dx);

        // Decidir si perseguir o patrullar
        if (distance < this.detectionRange) {
            // PERSEGUIR
            this.isChasing = true;
            
            if (player.x > this.x) {
                this.x += this.chaseSpeed;
                this.direction = 1;
            } else {
                this.x -= this.chaseSpeed;
                this.direction = -1;
            }
        } else {
            // PATRULLAR
            this.isChasing = false;
            
            if (this.x > this.startX + this.patrolRange) {
                this.direction = -1;
            } else if (this.x < this.startX - this.patrolRange) {
                this.direction = 1;
            }
            
            this.x += this.speed * this.direction;
        }

        // Actualizar animación
        if (this.spriteSheet) {
            const maxFrames = this.spriteSheet.getFrameCount();
            this.frame = (this.frame + this.animationSpeed) % maxFrames;
        }
    }

    /**
     * Dibuja el perseguidor con tinte rojo
     */
    draw(ctx) {
        if (!this.alive || !this.spriteSheet) return;

        const frameIndex = Math.floor(this.frame);
        const flipX = this.direction === -1;

        // Aplicar filtro rojo para distinguirlo
        ctx.filter = 'hue-rotate(-30deg) saturate(2)';
        
        this.spriteSheet.drawFrame(
            ctx, 
            frameIndex, 
            this.x, 
            this.y, 
            this.width, 
            this.height,
            flipX
        );
        
        ctx.filter = 'none';

        // DEBUG: Descomentar para ver la hitbox
        // this.drawHitbox(ctx);
    }
}

// Manager para manejar todos los enemigos
class EnemyManager {
    constructor() {
        this.enemies = [];
    }

    addEnemy(x, y, spriteSheet, type = 'normal') {
        if (type === 'chaser') {
            this.enemies.push(new ChaserEnemy(x, y, spriteSheet));
        } else {
            this.enemies.push(new Enemy(x, y, spriteSheet));
        }
    }

    update(player) {
        this.enemies.forEach(enemy => {
            if (enemy instanceof ChaserEnemy) {
                enemy.update(player);
            } else {
                enemy.update();
            }
        });
        
        this.enemies = this.enemies.filter(e => e.alive);
    }

    draw(ctx) {
        this.enemies.forEach(e => e.draw(ctx));
    }

    checkProjectileCollisions(projectiles) {
        let enemiesKilled = 0;
        let hitProjectiles = [];

        // Iterar sobre cada proyectil
        for (let i = 0; i < projectiles.length; i++) {
            const proj = projectiles[i];
            if (!proj.active) continue;
            
            // Revisar colisión con cada enemigo
            for (let j = 0; j < this.enemies.length; j++) {
                const enemy = this.enemies[j];
                
                if (!enemy.alive) continue;
                
                // Verificar colisión usando hitboxes
                const projHitbox = {
                    x: proj.x,
                    y: proj.y,
                    width: proj.width,
                    height: proj.height
                };
                
                const enemyHitbox = enemy.getHitbox();
                
                const collision = (
                    projHitbox.x < enemyHitbox.x + enemyHitbox.width &&
                    projHitbox.x + projHitbox.width > enemyHitbox.x &&
                    projHitbox.y < enemyHitbox.y + enemyHitbox.height &&
                    projHitbox.y + projHitbox.height > enemyHitbox.y
                );
                
                if (collision) {
                    const died = enemy.takeDamage(proj.damage);
                    
                    if (died) {
                        enemiesKilled++;
                        console.log(`Enemigo eliminado! Total: ${enemiesKilled}`);
                    } else {
                        console.log(`Enemigo dañado. Vida restante: ${enemy.health}`);
                    }
                    
                    // Marcar proyectil para eliminación
                    if (!hitProjectiles.includes(i)) {
                        hitProjectiles.push(i);
                    }
                    
                    break; // Un proyectil solo puede golpear a un enemigo
                }
            }
        }

        return { enemiesKilled, hitProjectiles };
    }

    checkPlayerCollision(player) {
        if (player.invincible) return false;

        for (const enemy of this.enemies) {
            if (enemy.alive && enemy.collidesWith(player)) {
                return true;
            }
        }
        
        return false;
    }

    clear() {
        this.enemies = [];
    }

    getAliveCount() {
        return this.enemies.filter(e => e.alive).length;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Enemy, ChaserEnemy, EnemyManager };
}