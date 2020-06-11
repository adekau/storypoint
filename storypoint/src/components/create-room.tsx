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
} from '@elastic/eui';
import React, { useState } from 'react';

import { useWebSocketIsConnecting } from '../hooks/websocket-is-connecting';
import { useWebSocket } from '../hooks/websocket.hook';

export default function CreateRoom() {
    const [loading, setLoading] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [nickname, setNickname] = useState('');
    const ws = useWebSocket();
    const { connecting, error } = useWebSocketIsConnecting(ws);

    const create = () => {
        setLoading(true);
        ws?.send(JSON.stringify({
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
                                <EuiButton
                                    isLoading={loading || connecting}
                                    disabled={!!error}
                                    type="submit"
                                    fill
                                    iconType="plusInCircleFilled"
                                    onClick={create}>
                                    Create
                                        </EuiButton>
                            </EuiFlexItem>
                        </EuiFlexGroup>
                    </EuiForm>
                </EuiPageContentBody>
            </EuiPageContent>
        </EuiPageBody>
    );
}