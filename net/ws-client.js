// net/ws-client.js
// Cliente WebSocket muy simple para enviar y recibir datos del juego

class WSClient {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.messageHandlers = [];
    }

    connect(url) {
        this.socket = new WebSocket(url);

        this.socket.addEventListener('open', () => {
            console.log('[WS] Conectado al servidor');
            this.connected = true;
        });

        this.socket.addEventListener('close', () => {
            console.log('[WS] Desconectado del servidor');
            this.connected = false;
        });

        this.socket.addEventListener('error', (err) => {
            console.error('[WS] Error:', err);
        });

        this.socket.addEventListener('message', (event) => {
            try {
                const data = JSON.parse(event.data);
                this.messageHandlers.forEach(h => h(data));
            } catch (e) {
                console.warn('[WS] Mensaje no válido:', event.data);
            }
        });
    }

    onMessage(handler) {
        this.messageHandlers.push(handler);
    }

    send(data) {
        if (this.connected && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        }
    }
}

// Instancia global
window.wsClient = new WSClient();