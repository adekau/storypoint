import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { webSocketState } from '../atoms/websocket';
import { createWebSocket } from '../helpers/create-web-socket';
import { StoryPointEvent } from '../../../shared/types/story-point-event';
import { useGlobalToast } from './global-toast.hook';
import { useMessageHandler } from './message-handler.hook';

export function useWebSocket(): WebSocket {
    const [webSocket, setWebSocket] = useRecoilState(webSocketState);
    const { addServerConnectionErrorToast, addServerConnectedToast } = useGlobalToast();
    const handleMessageEvent = useMessageHandler();

    const setNewWebSocket = useCallback(
        (showOnlineToast?: boolean) => setWebSocket(createWebSocket({
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
            },
            onMessage: (msg) => {
                const data: StoryPointEvent = JSON.parse(msg.data);
                if (data)
                    handleMessageEvent(data);
            }
        })),
        [
            addServerConnectionErrorToast,
            addServerConnectedToast,
            setWebSocket,
            handleMessageEvent
        ]
    );

    useEffect(
        () => {
            if (!webSocket)
                setNewWebSocket();
        },
        [
            webSocket,
            setNewWebSocket
        ]
    );

    return webSocket!;
}