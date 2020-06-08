import { atom } from "recoil";

export const webSocketState = atom<WebSocket | null>({
    key: 'websocket',
    default: null
});