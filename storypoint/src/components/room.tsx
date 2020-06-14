import {
    EuiCard,
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
    EuiButton,
} from '@elastic/eui';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';

import { StoryPointEvent } from '../../../shared/types/story-point-event';
import { nicknameState } from '../atoms/nickname';
import { roomState } from '../atoms/room';
import { WebSocketStatus } from '../atoms/websocketStatus';
import { useWebSocket } from '../hooks/websocket.hook';
import { VoteCard } from './vote-card';

export default function Room() {
    const { roomId } = useParams();
    const [nickname, setNickname] = useRecoilState(nicknameState);
    const [nicknameField, setNicknameField] = useState(nickname);
    const room = useRecoilValue(roomState);
    const { webSocket, webSocketStatus } = useWebSocket();

    useEffect(
        () => {
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
                    <EuiFlexGroup gutterSize="l" direction="column" alignItems="center">
                        <EuiFlexItem>
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
                                            onClick={() => setNickname(nicknameField)}>
                                            Change
                                        </EuiButton>
                                    </EuiFormRow>
                                </EuiFlexItem>
                            </EuiFlexGroup>
                        </EuiFlexItem>

                        <EuiFlexItem>
                            <EuiFlexGroup gutterSize="l">
                                {room?.users.map(user => {
                                    return (
                                        <EuiFlexItem key={user.userId} style={{ width: 140 }}>
                                            <VoteCard user={user} />
                                        </EuiFlexItem>
                                    );
                                })}
                            </EuiFlexGroup>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiPageContent>
            </EuiPageBody>
        </EuiPage>
    );
}