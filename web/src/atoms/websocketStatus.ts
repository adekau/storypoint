import { atom } from "recoil";

export enum WebSocketStatus {
    Errored,
    Closed,
    Connecting,
    Connected
}

export const webSocketStatusState = atom({
    key: 'webSocketStatus',
    default: WebSocketStatus.Closed
});