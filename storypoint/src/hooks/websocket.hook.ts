import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { StoryPointEvent } from '../../../shared/types/story-point-event';
import { webSocketState } from '../atoms/websocket';
import { WebSocketStatus, webSocketStatusState } from '../atoms/websocketStatus';
import { createWebSocket } from '../helpers/create-web-socket';
import { useGlobalToast } from './global-toast.hook';
import { useMessageHandler } from './message-handler.hook';

export function useWebSocket() {
    const [webSocket, setWebSocket] = useRecoilState(webSocketState);
    const [webSocketStatus, setWebSocketStatus] = useRecoilState(webSocketStatusState);
    const [error, setError] = useState<Event | null>(null);
    const { addServerConnectionErrorToast, addServerConnectedToast } = useGlobalToast();
    const handleMessageEvent = useMessageHandler();

    useEffect(
        () => {
            const setNewWebSocket = (showOnlineToast?: boolean) => {
                setWebSocketStatus(WebSocketStatus.Connecting);

                setWebSocket(createWebSocket({
                    onOpen: () => {
                        setWebSocketStatus(WebSocketStatus.Connected);
                        if (showOnlineToast) 
                            addServerConnectedToast();
                    },
                    onError: (e) => {
                        setWebSocketStatus(WebSocketStatus.Errored);
                        setError(e);
                    },
                    onClose: (event) => {
                        const ws = event.currentTarget as WebSocket;
                        setWebSocketStatus(WebSocketStatus.Closed);

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
            }

            if (!webSocket)
                setNewWebSocket();
        },
        [
            addServerConnectedToast,
            addServerConnectionErrorToast,
            handleMessageEvent,
            setWebSocket,
            setWebSocketStatus,
            webSocket,
            setError
        ]
    );

    return { webSocket: webSocket!, webSocketStatus, error };
}