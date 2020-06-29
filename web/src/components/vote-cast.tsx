import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiPanel } from '@elastic/eui';
import React, { useCallback, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { onlineState } from '../atoms/online';
import { userIdState } from '../atoms/user-id';
import { WebSocketStatus } from '../atoms/websocketStatus';
import { useWebSocket } from '../hooks/websocket.hook';
import { StoryPointEvent } from '../types/story-point-event';
import { VoteCastCard } from './vote-cast-card';

export interface VoteCastProps {
    options: number[];
}

export function VoteCast(props: VoteCastProps) {
    const [selected, setSelected] = useState<number | null>(null);
    const { webSocket, webSocketStatus } = useWebSocket();
    const online = useRecoilValue(onlineState);
    const userId = useRecoilValue(userIdState);
    const isLoading = webSocketStatus === WebSocketStatus.Connecting;
    const isDisabled = (webSocketStatus <= WebSocketStatus.Connecting) || !online || selected === null;

    const castVote = useCallback(() => {
        if (webSocketStatus !== WebSocketStatus.Connected || !userId || !selected)
            return;
        const event: StoryPointEvent = {
            event: 'vote',
            userId,
            vote: selected
        }
        webSocket.send(JSON.stringify(event));
    }, [webSocket, userId, selected, webSocketStatus]);

    return (
        <EuiPanel betaBadgeLabel={'Cast Vote'} paddingSize="l">
            <EuiFlexGroup direction="column" gutterSize="l">
                <EuiFlexItem>
                    <EuiFlexGroup gutterSize="l" wrap={true}>
                        {props.options.map(opt => <VoteCastCard onClick={(v) => setSelected(v)} key={opt} value={opt} selected={opt === selected} />)}
                    </EuiFlexGroup>
                </EuiFlexItem>

                <EuiFlexItem>
                    <EuiFlexGroup justifyContent="center">
                        <EuiFlexItem grow={false}>
                            <EuiButton
                                disabled={isDisabled}
                                isLoading={isLoading}
                                onClick={castVote}>
                                Cast Vote
                            </EuiButton>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiFlexItem>
            </EuiFlexGroup>
        </EuiPanel>
    );
}