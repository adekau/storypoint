import {
    EuiButton,
    EuiFieldText,
    EuiFlexGroup,
    EuiFlexItem,
    EuiForm,
    EuiFormRow,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentBody,
    EuiPageContentHeader,
    EuiPageContentHeaderSection,
    EuiSpacer,
    EuiTitle,
    EuiToolTip,
} from '@elastic/eui';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { onlineState } from '../atoms/online';
import { WebSocketStatus } from '../atoms/websocketStatus';
import { useWebSocket } from '../hooks/websocket.hook';

export default function CreateRoom() {
    const [loading, setLoading] = useState(false);
    const online = useRecoilValue(onlineState);
    const [roomName, setRoomName] = useState('');
    const [nickname, setNickname] = useState('');
    const { webSocket, webSocketStatus } = useWebSocket();
    const isLoading = loading || webSocketStatus === WebSocketStatus.Connecting;
    const isDisabled = (webSocketStatus <= WebSocketStatus.Connecting) || !online;

    const create = () => {
        if (webSocketStatus !== WebSocketStatus.Connected)
            return;

        setLoading(true);
        webSocket.send(JSON.stringify({
            event: 'create',
            roomName,
            nickname
        }));
    }

    return (
        <EuiPageBody
            component="div">
            <EuiPageContent
                verticalPosition="center"
                horizontalPosition="center"
                hasShadow
                paddingSize="l">
                <EuiPageContentHeader>
                    <EuiPageContentHeaderSection>
                        <EuiTitle>
                            <h2>Create a New Story Pointing Room</h2>
                        </EuiTitle>
                    </EuiPageContentHeaderSection>
                </EuiPageContentHeader>
                <EuiPageContentBody>
                    <EuiForm component="form">
                        <EuiFormRow label="Room Name">
                            <EuiFieldText
                                placeholder="Room Name"
                                id="roomName"
                                value={roomName}
                                onChange={name => setRoomName(name.target.value)}
                                required
                            />
                        </EuiFormRow>

                        <EuiSpacer size="m" />

                        <EuiFormRow label="Nickname" helpText="Your display name once in the room.">
                            <EuiFieldText
                                placeholder="Nickname"
                                id="nickname"
                                value={nickname}
                                onChange={nick => setNickname(nick.target.value)}
                                required
                            />
                        </EuiFormRow>

                        <EuiSpacer size="m" />

                        <EuiFlexGroup justifyContent="flexEnd">
                            <EuiFlexItem grow={false}>
                                <EuiToolTip
                                    content={ isDisabled ? <p>Unable to contact server.</p> : <p>Create Room</p>}>
                                    <EuiButton
                                        isLoading={isLoading}
                                        disabled={isDisabled}
                                        fill
                                        iconType="plusInCircleFilled"
                                        onClick={create}>
                                        Create
                                </EuiButton>
                                </EuiToolTip>
                            </EuiFlexItem>
                        </EuiFlexGroup>
                    </EuiForm>
                </EuiPageContentBody>
            </EuiPageContent>
        </EuiPageBody>
    );
}