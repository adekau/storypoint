import {
    EuiFlexGroup,
    EuiFlexItem,
    EuiLoadingSpinner,
    EuiPage,
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

import { nicknameState } from '../atoms/nickname';
import { roomState } from '../atoms/room';
import { selectedUserCardsState } from '../atoms/selected-vote-cards';
import { voteOptionsState } from '../atoms/vote-options';
import { WebSocketStatus } from '../atoms/websocketStatus';
import { useWebSocket } from '../hooks/websocket.hook';
import { StoryPointEvent } from '../types/story-point-event';
import { BottomBar } from './bottom-bar';
import RoomHeader from './room-header';
import { UserCard } from './user-card';
import { VoteCast } from './vote-cast';

export default function Room() {
    const { roomId } = useParams();
    const selectedCards = useRecoilValue(selectedUserCardsState);
    const voteOptions = useRecoilValue(voteOptionsState);
    const nickname = useRecoilValue(nicknameState);
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
    const users = room?.users;
    const host = room?.host;
    const hostObj = users?.find(u => u.userId === host);
    return (
        <>
            <EuiPage
                className={selectedCards.length ? 'bottomBar--open' : 'bottomBar--closed'}
                style={{ padding: 40 }}
                restrictWidth={1650}>
                <EuiPageBody component="div">
                    <EuiPageHeader>
                        <EuiPageHeaderSection>
                            <EuiTitle size='m'>
                                <h1>{room?.roomName ?? <EuiLoadingSpinner size='l' />}</h1>
                            </EuiTitle>
                        </EuiPageHeaderSection>
                    </EuiPageHeader>
                    <EuiPageContent grow={true} panelPaddingSize="l" hasShadow>
                        <EuiFlexGroup responsive={false} gutterSize="xl" direction="column" alignItems="center" justifyContent="spaceBetween" style={{ height: '100%' }}>
                            <EuiFlexItem grow={false} style={{ width: '100%', marginTop: 0 }}>
                                <RoomHeader host={hostObj} />
                            </EuiFlexItem>

                            <EuiFlexItem grow={false}>
                                <EuiFlexGroup justifyContent="center" direction="row" gutterSize="xl" responsive wrap={true} style={{ width: 'fit-content', margin: 'auto' }}>
                                    {(room?.users ?? []).map(user => {
                                        return (
                                            <EuiFlexItem key={user.userId} grow={false} style={{ maxWidth: 400 }}>
                                                <UserCard user={user} />
                                            </EuiFlexItem>
                                        );
                                    })}
                                </EuiFlexGroup>
                            </EuiFlexItem>

                            <EuiFlexItem grow={false}>
                                <VoteCast options={voteOptions} />
                            </EuiFlexItem>
                        </EuiFlexGroup>
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
            <BottomBar />
        </>
    );
}