import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { webSocketState } from '../atoms/websocket';
import { createWebSocket } from '../helpers/create-web-socket';
import { StoryPointEvent } from '../types/story-point-event';
import { useGlobalToast } from './global-toast.hook';
import { useMessageHandler } from './message-handler.hook';

export function useWebSocket(): WebSocket {
    const [webSocket, setWebSocket] = useRecoilState(webSocketState);
    const { addServerConnectionErrorToast, addServerConnectedToast } = useGlobalToast();
    const handleMessageEvent = useMessageHandler();

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
                },
                onMessage: (msg) => {
                    const data: StoryPointEvent = JSON.parse(msg.data);
                    if (data)
                        handleMessageEvent(data);
                }
            }));

            if (!webSocket)
                setNewWebSocket();
        },
        [
            webSocket,
            setWebSocket,
            addServerConnectionErrorToast,
            addServerConnectedToast,
            handleMessageEvent
        ]
    );

    return webSocket!;
}