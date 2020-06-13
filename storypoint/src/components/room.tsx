import {
    EuiCard,
    EuiLoadingSpinner,
    EuiPageBody,
    EuiPageContent,
    EuiPageHeader,
    EuiPageHeaderSection,
    EuiTitle,
} from '@elastic/eui';
import React from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { StoryPointEvent } from '../../../shared/types/story-point-event';
import { roomState } from '../atoms/room';
import { WebSocketStatus } from '../atoms/websocketStatus';
import { useWebSocket } from '../hooks/websocket.hook';

export default function Room() {
    const { roomId } = useParams();
    const room = useRecoilValue(roomState);
    const { webSocket, webSocketStatus } = useWebSocket();

    useEffect(
        () => {
            if (webSocketStatus !== WebSocketStatus.Connected)
                return;
            const event: StoryPointEvent = {
                event: 'join',
                roomId
            };
            webSocket.send(JSON.stringify(event));

            return () => {
                if (webSocketStatus !== WebSocketStatus.Connected)
                    return;
                const event: StoryPointEvent = {
                    event: 'leave',
                    roomId
                };
                webSocket.send(JSON.stringify(event));
            };
        },
        [webSocketStatus, webSocket, roomId]
    );

    return (
        <EuiPageBody component="div">
            <EuiPageHeader>
                <EuiPageHeaderSection>
                    <EuiTitle size='m'>
                        <h1>{room?.roomName ?? <EuiLoadingSpinner size='l' />}</h1>
                    </EuiTitle>
                </EuiPageHeaderSection>
            </EuiPageHeader>
            <EuiPageContent grow={true} panelPaddingSize="l" hasShadow>
                <EuiCard title={'Hello'} description={'World'} />
            </EuiPageContent>
        </EuiPageBody>
    );
}