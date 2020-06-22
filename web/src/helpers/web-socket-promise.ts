export function createWebSocketPromise(ws: WebSocket): Promise<WebSocket> {
    if (!ws)
        return Promise.reject();

    if (ws.readyState !== 0) {
        switch (ws.readyState) {
            case 1:
                return Promise.resolve(ws);
            case 2:
            case 3:
            default:
                return Promise.reject('closed');
        }
    }

    return new Promise((resolve, reject) => {
        const open = () => {
            removeEventListeners();
            resolve(ws);
        };
        const error = (err: Event) => {
            removeEventListeners();
            reject(err);
        };
        const removeEventListeners = () => {
            ws.removeEventListener('open', open);
            ws.removeEventListener('error', error);
        };
        ws.addEventListener('open', open);
        ws.addEventListener('error', error);
    });
};