// Clase del jugador que hereda de Entity

class Player extends Entity {
    constructor(x, y, spriteSheets) {
        // Tamaño visual del sprite
        const visualWidth = 160;
        const visualHeight = 170;
        
        super(x, y, visualWidth, visualHeight);
        
        // Sprite sheets
        this.spriteSheets = {
            idle: spriteSheets.idle,
            walk: spriteSheets.walk,
            jump: spriteSheets.jump
        };
        
        // HITBOX AJUSTADA - más pequeña que el sprite visual
        this.hitboxWidth = 80;   // Aproximadamente 50% del ancho visual
        this.hitboxHeight = 120;  // Aproximadamente 82% de la altura visual
        this.hitboxOffsetX = 40;  // Centrar la hitbox horizontalmente
        this.hitboxOffsetY = 10;  // Ajustar para que los pies toquen el suelo
        
        // Animación
        this.currentAnimation = 'idle';
        this.frame = 0;
        this.animationSpeed = 0.5;
        
        // Físicas
        this.speed = 3;
        this.jumpSpeed = 8;
        this.gravity = 0.15;
        this.velocityY = 0;
        this.isJumping = false;
        this.onGround = false;
        
        // Estado
        this.lives = 3;
        this.invincible = false;
        this.invincibilityTimer = 0;
        this.power = 'normal';
        this.powerUpTimer = 0;
        this.facingRight = true;
        
        // Límites
        this.minX = 100;
        this.maxX = 6000;
    }

    /**
     * Obtiene la hitbox real del jugador
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
        return (
            hitbox.x < other.x + other.width &&
            hitbox.x + hitbox.width > other.x &&
            hitbox.y < other.y + other.height &&
            hitbox.y + hitbox.height > other.y
        );
    }

    /**
     * Actualiza el jugador
     */
    update(keys, groundLevel, platforms) {
        this.handleInput(keys);
        this.updatePhysics(groundLevel, platforms);
        this.updateAnimation();
        this.updateInvincibility();
    }

    /**
     * Maneja la entrada del jugador
     */
    handleInput(keys) {
        let isMoving = false;

        // Movimiento horizontal
        if (keys['ArrowRight'] && this.x < this.maxX) {
            this.x += this.speed;
            this.facingRight = true;
            isMoving = true;
        }
        if (keys['ArrowLeft'] && this.x > this.minX) {
            this.x -= this.speed;
            this.facingRight = false;
            isMoving = true;
        }

        // Salto
        if (keys[' '] && !this.isJumping && this.onGround) {
            this.isJumping = true;
            this.velocityY = this.jumpSpeed;
            this.onGround = false;
        }

        // Determinar animación
        if (this.isJumping) {
            this.currentAnimation = 'jump';
        } else if (isMoving) {
            this.currentAnimation = 'walk';
        } else {
            this.currentAnimation = 'idle';
        }
    }

    /**
     * Actualiza la física del jugador
     */
    updatePhysics(groundLevel, platforms) {
        // Aplicar gravedad
        if (this.isJumping || !this.onGround) {
            this.y -= this.velocityY;
            this.velocityY -= this.gravity;
        }

        // Verificar colisión con plataformas usando la hitbox
        this.onGround = false;
        const hitbox = this.getHitbox();
        const playerBottom = hitbox.y + hitbox.height;

        for (const platform of platforms) {
            const horizontallyInside =
                hitbox.x + hitbox.width > platform.x &&
                hitbox.x < platform.x + platform.width;

            if (horizontallyInside && this.velocityY <= 0) {
                if (playerBottom <= platform.y + 10 && playerBottom >= platform.y - 10) {
                    // Ajustar posición visual basada en la hitbox
                    this.y = platform.y - hitbox.height - this.hitboxOffsetY;
                    this.isJumping = false;
                    this.velocityY = 0;
                    this.onGround = true;
                    break;
                }
            }
        }

        // Colisión con el suelo
        if (this.y >= groundLevel) {
            this.y = groundLevel;
            this.isJumping = false;
            this.velocityY = 0;
            this.onGround = true;
        }

        // Caer del mapa
        if (this.y > groundLevel + 200) {
            this.takeDamage(this.lives);
        }
    }

    /**
     * Actualiza la animación
     */
    updateAnimation() {
        const spriteSheet = this.spriteSheets[this.currentAnimation];
        if (!spriteSheet) return;

        const maxFrames = spriteSheet.getFrameCount();

        if (this.currentAnimation === 'jump') {
            this.frame = Math.min(this.frame + this.animationSpeed, maxFrames - 1);
        } else {
            this.frame = (this.frame + this.animationSpeed) % maxFrames;
        }
    }

    /**
     * Actualiza invincibilidad
     */
    updateInvincibility() {
        if (this.invincible) {
            this.invincibilityTimer--;
            if (this.invincibilityTimer <= 0) {
                this.invincible = false;
            }
        }
    }

    /**
     * Dibuja el jugador
     */
    draw(ctx) {
        const spriteSheet = this.spriteSheets[this.currentAnimation];
        if (!spriteSheet) return;

        const frameIndex = Math.floor(this.frame);

        // Efecto de parpadeo cuando es invincible
        if (this.invincible) {
            if (Math.floor(this.invincibilityTimer / 10) % 2 === 0) {
                return;
            }
        }

        // Dibujar sprite
        spriteSheet.drawFrame(
            ctx, 
            frameIndex, 
            this.x, 
            this.y, 
            this.width, 
            this.height, 
            !this.facingRight
        );

        // DEBUG: Descomentar para ver la hitbox
        // this.drawHitbox(ctx);
    }

    /**
     * Dibuja la hitbox para debugging
     */
    drawHitbox(ctx) {
        const hitbox = this.getHitbox();
        ctx.strokeStyle = 'lime';
        ctx.lineWidth = 2;
        ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
    }

    /**
     * Recibe daño
     */
    takeDamage(amount = 1) {
        if (this.invincible) return false;

        this.lives -= amount;
        if (this.lives < 0) this.lives = 0;

        this.invincible = true;
        this.invincibilityTimer = 120;

        return this.lives <= 0;
    }

    /**
     * Activa power-up
     */
    activatePowerUp(duration = 600) {
        this.power = 'upgraded';
        this.powerUpTimer = duration;
    }

    /**
     * Actualiza power-up
     */
    updatePowerUp() {
        if (this.powerUpTimer > 0) {
            this.powerUpTimer--;
            if (this.powerUpTimer === 0) {
                this.power = 'normal';
            }
        }
    }

    /**
     * Resetea al jugador
     */
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.velocityY = 0;
        this.isJumping = false;
        this.onGround = false;
        this.currentAnimation = 'idle';
        this.invincible = false;
        this.invincibilityTimer = 0;
        this.power = 'normal';
        this.powerUpTimer = 0;
        this.facingRight = true;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Player;
}