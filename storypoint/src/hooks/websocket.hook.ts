import { useEffect } from 'react';
import { SetterOrUpdater, useRecoilState } from 'recoil';

import { webSocketState } from '../atoms/websocket';

const onOpen = () => {
    console.log('Opened');
};

const onMsg = (msg: MessageEvent) => {
    console.log('Message received', msg);
};

const onError = (setter: SetterOrUpdater<WebSocket>) => (ws: WebSocket) => (error: unknown) => {
    console.error('WebSocket error', error);
    if (ws && !ws.CLOSED) {
        ws.close();
    }
    setter(new WebSocket('ws://localhost:8080/'));
}

export function useWebSocket(): WebSocket {
    const [webSocket, setWebSocket] = useRecoilState(webSocketState);
    useEffect(
        () => {
            console.log('using effect');
            const err = onError(setWebSocket)(webSocket);

            webSocket.addEventListener('open', onOpen);
            webSocket.addEventListener('message', onMsg);
            webSocket.addEventListener('error', err);

            return () => {
                webSocket.removeEventListener('open', onOpen);
                webSocket.removeEventListener('message', onMsg);
                webSocket.removeEventListener('error', err);
            };
        },
        [webSocket, setWebSocket]
    );
    return webSocket;
}