import { EuiBottomBar, EuiButton, EuiButtonEmpty, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import React from 'react';
import { useRecoilState } from 'recoil';

import { selectedUserCardsState } from '../atoms/selected-vote-cards';
import { WebSocketStatus } from '../atoms/websocketStatus';
import { useWebSocket } from '../hooks/websocket.hook';
import { StoryPointEvent } from '../types/story-point-event';

export function BottomBar() {
    const [selectedCards, setSelectedCards] = useRecoilState(selectedUserCardsState);
    const { webSocket, webSocketStatus } = useWebSocket();

    const kickSelection = () => {
        const event: StoryPointEvent = {
            event: 'kick',
            userIds: [...selectedCards]
        };

        if (webSocketStatus === WebSocketStatus.Connected) {
            webSocket.send(JSON.stringify(event));
            setSelectedCards([]);
        }
    }

    if (selectedCards.length === 0)
        return <></>;
    return (
        <EuiBottomBar>
            <EuiFlexGroup gutterSize="none" justifyContent="spaceBetween">
                <EuiFlexItem grow={false}>
                    <EuiButton
                        fill
                        color="ghost"
                        onClick={kickSelection}>
                        Kick
                    </EuiButton>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <EuiButtonEmpty
                        color="ghost"
                        onClick={() => setSelectedCards([])}>
                        Cancel Selection
                    </EuiButtonEmpty>
                </EuiFlexItem>
            </EuiFlexGroup>
        </EuiBottomBar>
    );
}