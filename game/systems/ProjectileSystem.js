// Sistema de proyectiles completo con cooldown y diferentes tipos

class Projectile extends Entity {
    constructor(x, y, config) {
        super(x, y, config.width, config.height);
        
        this.speed = config.speed;
        this.color = config.color;
        this.innerColor = config.innerColor || null;
        this.damage = config.damage;
        this.lifetime = config.lifetime || 300; // frames antes de desaparecer
        this.age = 0;
    }

    update() {
        this.x += this.speed;
        this.age++;
        
        // Desactivar si es muy viejo
        if (this.age > this.lifetime) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (!this.active) return;

        if (this.innerColor) {
            // Proyectil especial con núcleo brillante
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Núcleo brillante
            ctx.fillStyle = this.innerColor;
            ctx.fillRect(
                this.x + 8, 
                this.y + 3, 
                this.width - 16, 
                this.height - 6
            );
        } else {
            // Proyectil normal
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Verifica si el proyectil está fuera de pantalla
     */
    isOffScreen(cameraX, canvasWidth) {
        return this.x > cameraX + canvasWidth + 100 || this.x < cameraX - 100;
    }
}

class ProjectileSystem {
    constructor() {
        this.projectiles = [];
        this.canShoot = true;
        this.shootCooldown = 0;
        this.maxCooldown = 15; // frames entre disparos
    }

    /**
     * Dispara un proyectil
     * @param {Object} player - Objeto del jugador
     * @param {number} currentLevel - Nivel actual
     */
    shoot(player, currentLevel) {
        if (!this.canShoot) return;

        const config = this.getProjectileConfig(player.power, currentLevel);
        
        const projectile = new Projectile(
            player.x + player.width,
            player.y + player.height / 2 - config.height / 2,
            config
        );

        this.projectiles.push(projectile);
        
        // Activar cooldown
        this.canShoot = false;
        this.shootCooldown = this.maxCooldown;
    }

    /**
     * Obtiene la configuración del proyectil según poder y nivel
     */
    getProjectileConfig(power, level) {
        if (power === 'upgraded') {
            if (level === 2) {
                // Nivel 2: Bala especial azul tenebrosa
                return {
                    speed: 14,
                    width: 40,
                    height: 12,
                    color: '#99CCFF',
                    innerColor: 'white',
                    damage: 3,
                    lifetime: 350
                };
            } else {
                // Nivel 1 y 3: Bala azul mejorada
                return {
                    speed: 12,
                    width: 30,
                    height: 10,
                    color: 'cyan',
                    damage: 2,
                    lifetime: 300
                };
            }
        } else {
            // Disparo normal
            return {
                speed: 10,
                width: 15,
                height: 5,
                color: 'yellow',
                damage: 1,
                lifetime: 250
            };
        }
    }

    /**
     * Actualiza todos los proyectiles
     */
    update(cameraX, canvasWidth) {
        // Actualizar cooldown
        if (this.shootCooldown > 0) {
            this.shootCooldown--;
            if (this.shootCooldown === 0) {
                this.canShoot = true;
            }
        }

        // Actualizar proyectiles
        this.projectiles.forEach(p => {
            if (p.active) {
                p.update();
                
                // Desactivar si está fuera de pantalla
                if (p.isOffScreen(cameraX, canvasWidth)) {
                    p.active = false;
                }
            }
        });

        // Eliminar proyectiles inactivos
        this.projectiles = this.projectiles.filter(p => p.active);
    }

    /**
     * Dibuja todos los proyectiles
     */
    draw(ctx) {
        this.projectiles.forEach(p => {
            if (p.active) {
                p.draw(ctx);
            }
        });
    }

    /**
     * Elimina proyectiles por índices
     */
    removeProjectiles(indices) {
        // Ordenar índices de mayor a menor para eliminar correctamente
        indices.sort((a, b) => b - a);
        indices.forEach(i => {
            if (i >= 0 && i < this.projectiles.length) {
                this.projectiles.splice(i, 1);
            }
        });
    }

    /**
     * Obtiene todos los proyectiles activos
     */
    getProjectiles() {
        return this.projectiles.filter(p => p.active);
    }

    /**
     * Limpia todos los proyectiles
     */
    clear() {
        this.projectiles = [];
        this.canShoot = true;
        this.shootCooldown = 0;
    }

    /**
     * Obtiene el número de proyectiles activos
     */
    getActiveCount() {
        return this.projectiles.filter(p => p.active).length;
    }

    /**
     * Cambia la velocidad de disparo
     * @param {number} cooldown - Nuevo cooldown en frames
     */
    setFireRate(cooldown) {
        this.maxCooldown = cooldown;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectileSystem;
}