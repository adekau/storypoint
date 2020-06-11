import { EuiText } from '@elastic/eui';
import React from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { StoryPointEvent } from '../../../shared/types/story-point-event';
import { roomState } from '../atoms/room';
import { useWebSocketIsConnecting } from '../hooks/websocket-is-connecting';
import { useWebSocket } from '../hooks/websocket.hook';

export default function Room() {
    const { roomId } = useParams();
    const room = useRecoilValue(roomState);
    const ws = useWebSocket();
    const { connecting } = useWebSocketIsConnecting(ws);

    useEffect(
        () => {
            if (!connecting) {
                const event: StoryPointEvent = {
                    event: 'join',
                    roomId
                };
                ws.send(JSON.stringify(event));
            }
        },
        [connecting, ws, roomId]
    );

    return (
        <>
            <EuiText>
                <h2>Welcome to room {room?.roomName}</h2>

                <span>Users: {room?.users.map((user: any) => <p>{user.userId}</p>)}</span>
            </EuiText>
        </>
    );
}