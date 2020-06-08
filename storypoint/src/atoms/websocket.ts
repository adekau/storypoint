import { atom } from "recoil";

export const webSocketState = atom<WebSocket>({
    key: 'websocket',
    default: (() => {
        const ws = new WebSocket('ws://localhost:8080/');
        ws.addEventListener('error', (err) => {
            if ((err.target as WebSocket).readyState === 3) {
                console.log('unable to open')
            }
        });
        return ws;
    })()
});