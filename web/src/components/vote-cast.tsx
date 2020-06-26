import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiPanel } from '@elastic/eui';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { onlineState } from '../atoms/online';
import { WebSocketStatus } from '../atoms/websocketStatus';
import { useWebSocket } from '../hooks/websocket.hook';
import { VoteCastCard } from './vote-cast-card';

export interface VoteCastProps {
    options: number[];
}

export function VoteCast(props: VoteCastProps) {
    const [selected, setSelected] = useState<number | null>(null);
    const { webSocketStatus } = useWebSocket();
    const online = useRecoilValue(onlineState);
    const isLoading = webSocketStatus === WebSocketStatus.Connecting;
    const isDisabled = (webSocketStatus <= WebSocketStatus.Connecting) || !online || selected === null;

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
                                isLoading={isLoading}>
                                Cast Vote
                            </EuiButton>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiFlexItem>
            </EuiFlexGroup>
        </EuiPanel>
    );
}