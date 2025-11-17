# Shadow Wizard 🧙‍♂️✨

Proyecto I B – Aplicaciones Web  
Videojuego 2D desarrollado con **HTML5 + Canvas + JavaScript**.

---

## 🎮 Descripción general

**Shadow Wizard** es un juego web donde controlas a un mago que debe avanzar por distintos escenarios llenos de criaturas y obstáculos para llegar al portal final.  
El objetivo es **sobrevivir**, esquivar o eliminar enemigos y completar el nivel sin perder toda la vida.

El juego está pensado como práctica de los conceptos vistos en clase: bucle de juego, manejo de sprites, colisiones, estados, y organización modular del código.

---

## 🕹️ Cómo jugar

- Mueve al mago con las teclas de movimiento configuradas en el juego (por defecto, flechas o WASD según el código).
- Dispara proyectiles mágicos para eliminar enemigos.
- Evita el contacto directo con las criaturas y los peligros del escenario.
- Llega al **portal** para completar el nivel.

> Los controles específicos (teclas de movimiento, disparo, pausa, etc.) están definidos en el código de `main.js` / archivo de entrada del juego.

---

## ✨ Características principales

- Motor de juego basado en **HTML5 Canvas**.
- Bucle de juego con **`requestAnimationFrame`**.
- Sistema de **disparo** del mago y manejo de proyectiles.
- Enemigos con movimiento básico y detección de colisión.
- Fondos y elementos gráficos personalizados (sprites).
- Sistema de estados básico (por ejemplo: menú / juego / game over) según implementación.

---

## 🧩 Tecnologías utilizadas

- **HTML5** – estructura de la página y contenedor del Canvas.  
- **CSS3** – estilos básicos del layout y del lienzo del juego.  
- **JavaScript (ES6)** – lógica del juego, animaciones, colisiones y control del jugador.  
- **Canvas 2D API** – renderizado de sprites, fondos y efectos visuales.

---

## 📁 Estructura del proyecto (ejemplo)

> La estructura puede variar según cómo esté organizado el código, pero la idea general es:

```bash
Game_Web_Shadow_Wizard/
├── index.html          # Punto de entrada del juego
├── js/
│   ├── main.js         # Bucle principal y lógica general
│   ├── player.js       # Lógica del mago
│   ├── enemies.js      # Lógica de enemigos
│   ├── levels.js       # Definición de niveles
│   └── utils.js        # Funciones de apoyo
├── assets/
│   ├── img/            # Sprites, fondos, portales, criaturas
│   └── audio/          # Música y efectos de sonido (si aplica)
├── css/
│   └── styles.css      # Estilos del canvas / layout
└── README.md
