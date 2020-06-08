import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { webSocketState } from '../atoms/websocket';
import { createWebSocket } from '../helpers/create-web-socket';
import { useGlobalToast } from './useGlobalToast.hook';

export function useWebSocket(): WebSocket {
    const [webSocket, setWebSocket] = useRecoilState(webSocketState);
    const { addConnectionErrorToast, addConnectionOnlineToast } = useGlobalToast();

    useEffect(
        () => {
            const setNewWebSocket = (showOnlineToast?: boolean) => setWebSocket(createWebSocket({
                onError: (error) => {
                    const w = error.currentTarget as WebSocket;
                    if (w.readyState === 3) {
                        addConnectionErrorToast();
                        setTimeout(() => setNewWebSocket(true), 10000);
                    }
                },
                onOpen: () => {
                    if (showOnlineToast)
                        addConnectionOnlineToast();
                }
            }));

            if (!webSocket)
                setNewWebSocket();
        },
        [
            webSocket,
            setWebSocket,
            addConnectionErrorToast,
            addConnectionOnlineToast
        ]
    );

    return webSocket!;
}