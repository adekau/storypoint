import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { webSocketState } from '../atoms/websocket';
import { createWebSocket } from '../helpers/create-web-socket';
import { useGlobalToast } from './global-toast.hook';

export function useWebSocket(): WebSocket {
    const [webSocket, setWebSocket] = useRecoilState(webSocketState);
    const { addServerConnectionErrorToast, addServerConnectedToast } = useGlobalToast();

    useEffect(
        () => {
            const setNewWebSocket = (showOnlineToast?: boolean) => setWebSocket(createWebSocket({
                onOpen: () => {
                    if (showOnlineToast)
                        addServerConnectedToast();
                },
                onClose: (event) => {
                    const ws = event.currentTarget as WebSocket;
                    if (ws.readyState === 3) {
                        addServerConnectionErrorToast();
                        setTimeout(() => setNewWebSocket(true), 10000);
                    }
                }
            }));

            if (!webSocket)
                setNewWebSocket();
        },
        [
            webSocket,
            setWebSocket,
            addServerConnectionErrorToast,
            addServerConnectedToast
        ]
    );

    return webSocket!;
}