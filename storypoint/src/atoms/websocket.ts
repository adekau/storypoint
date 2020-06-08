import { atom } from "recoil";

export const webSocketState = atom<WebSocket>({
    key: 'websocket',
    default: new WebSocket('ws://localhost:8080/')
});