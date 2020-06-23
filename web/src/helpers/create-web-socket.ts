export interface WebSocketEventCallbacks {
    onOpen?: (event: Event) => void;
    onError?: (error: Event) => void;
    onClose?: (event: CloseEvent) => void;
    onMessage?: (event: MessageEvent) => void;
};

export function createWebSocket({ onOpen, onError, onClose, onMessage }: WebSocketEventCallbacks): WebSocket {
    const ws = new WebSocket('ws://localhost/ws');
    ws.onerror = (error) => {
        if (onError)
            onError(error);
    };

    ws.onopen = (event: Event) => {
        if (onOpen)
            onOpen(event);
    };

    ws.onclose = (event) => {
        if (onClose)
            onClose(event);
    };

    ws.onmessage = (msg) => {
        if (onMessage)
            onMessage(msg);
    };

    return ws;
}