import {
    EuiButton,
    EuiFieldText,
    EuiFlexGroup,
    EuiFlexItem,
    EuiFormRow,
    EuiLoadingSpinner,
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageHeader,
    EuiPageHeaderSection,
    EuiTitle,
} from '@elastic/eui';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';

import { StoryPointEvent } from '../../../shared/types/story-point-event';
import { nicknameState } from '../atoms/nickname';
import { onlineState } from '../atoms/online';
import { roomState } from '../atoms/room';
import { WebSocketStatus } from '../atoms/websocketStatus';
import { useWebSocket } from '../hooks/websocket.hook';
import { VoteCard } from './vote-card';
import { VoteCast } from './vote-cast';

export default function Room() {
    const { roomId } = useParams();
    const [nickname, setNickname] = useRecoilState(nicknameState);
    const [nicknameField, setNicknameField] = useState(nickname);
    const room = useRecoilValue(roomState);
    const { webSocket, webSocketStatus } = useWebSocket();
    const online = useRecoilValue(onlineState);
    const isLoading = webSocketStatus === WebSocketStatus.Connecting;
    const isDisabled = (webSocketStatus <= WebSocketStatus.Connecting) || !online;

    useEffect(
        () => {
            console.log(webSocketStatus, webSocket);
            if (webSocketStatus !== WebSocketStatus.Connected)
                    return;
            const event: StoryPointEvent = {
                event: 'join',
                roomId,
                nickname
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
        [webSocketStatus, webSocket, roomId, nickname]
    );

    return (
        <EuiPage style={{ padding: 40, minHeight: `calc(100vh - 49px)` }} restrictWidth={1650}>
            <EuiPageBody component="div">
                <EuiPageHeader>
                    <EuiPageHeaderSection>
                        <EuiTitle size='m'>
                            <h1>{room?.roomName ?? <EuiLoadingSpinner size='l' />}</h1>
                        </EuiTitle>
                    </EuiPageHeaderSection>
                </EuiPageHeader>
                <EuiPageContent grow={true} panelPaddingSize="l" hasShadow>
                    <EuiFlexGroup gutterSize="l" direction="column" alignItems="center" justifyContent="spaceBetween" style={{ height: '100%' }}>
                        <EuiFlexItem grow={false}>
                            <EuiFlexGroup>
                                <EuiFlexItem>
                                    <EuiFormRow label="Nickname">
                                        <EuiFieldText
                                            value={nicknameField}
                                            onChange={(change) => setNicknameField(change.target.value)}></EuiFieldText>
                                    </EuiFormRow>
                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiFormRow hasEmptyLabelSpace>
                                        <EuiButton
                                            disabled={isDisabled}
                                            isLoading={isLoading}
                                            onClick={() => setNickname(nicknameField)}>
                                            Change
                                        </EuiButton>
                                    </EuiFormRow>
                                </EuiFlexItem>
                            </EuiFlexGroup>
                        </EuiFlexItem>

                        <EuiFlexItem grow={false}>
                            <EuiFlexGroup gutterSize="l" wrap={true}>
                                {(room?.users ?? []).map(user => {
                                    return (
                                        <EuiFlexItem grow={false} key={user.userId} style={{ minWidth: 140 }}>
                                            <VoteCard user={user} />
                                        </EuiFlexItem>
                                    );
                                })}
                            </EuiFlexGroup>
                        </EuiFlexItem>
                        <EuiFlexItem grow={false}>
                            <VoteCast options={[0, 0.5, 1, 2, 3, 5, 8, 13]} />
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiPageContent>
            </EuiPageBody>
        </EuiPage>
    );
}