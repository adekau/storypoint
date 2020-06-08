export function createWebSocket({ onOpen, onError }: { onOpen?: () => void, onError?: (error: Event) => void }): WebSocket {
    const ws = new WebSocket('ws://localhost:8080/');
    ws.onerror = (error) => {
        if (onError)
            onError(error);
    };

    ws.onopen = () => {
        console.log('WebSocket Opened.');
        if (onOpen)
            onOpen();
    };

    ws.onmessage = (msg) => {
        console.log('Got Message', msg);
    };

    return ws;
}