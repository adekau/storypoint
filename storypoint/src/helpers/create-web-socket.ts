export interface WebSocketEventCallbacks {
    onOpen?: (event: Event) => void;
    onError?: (error: Event) => void;
    onClose?: (event: CloseEvent) => void;
};

export function createWebSocket({ onOpen, onError, onClose }: WebSocketEventCallbacks): WebSocket {
    const ws = new WebSocket('ws://localhost:8080/');
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
        console.log('Got Message', msg);
    };

    return ws;
}