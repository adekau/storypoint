import {
    EuiDescriptionList,
    EuiHeader,
    EuiHeaderSection,
    EuiHeaderSectionItem,
    EuiHeaderSectionItemButton,
    EuiHealth,
    EuiIcon,
    EuiToolTip,
} from '@elastic/eui';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { onlineState } from '../atoms/online';
import { userIdState } from '../atoms/user-id';
import { WebSocketStatus } from '../atoms/websocketStatus';
import { useWebSocket } from '../hooks/websocket.hook';
import { StoryPointEvent } from '../types/story-point-event';
import RoomSettings from './room-settings';

export interface RoomHeaderProps {
    host: any;
}

export default function RoomHeader({ host }: RoomHeaderProps) {
    const online = useRecoilValue(onlineState);
    const { webSocket, webSocketStatus } = useWebSocket();
    const userId = useRecoilValue(userIdState);
    const isDisabled = (webSocketStatus <= WebSocketStatus.Connecting) || !online;
    const history = useHistory();

    const requestChangeHost = useCallback(() => {
        if (host || !userId || !webSocket || webSocketStatus !== WebSocketStatus.Connected)
            return;
        const event: StoryPointEvent = {
            event: 'hostChange',
            userId
        };
        webSocket.send(JSON.stringify(event));
    }, [host, userId, webSocket, webSocketStatus]);
    
    return (
        <EuiHeader style={{ padding: -24 }}>
            <EuiHeaderSection grow={false}>
                <EuiHeaderSectionItem border="right">
                    <EuiToolTip content="Leave room">
                        <EuiHeaderSectionItemButton
                            disabled={isDisabled}
                            onClick={() => history.push('/')}>
                            <EuiIcon type="exit" />
                        </EuiHeaderSectionItemButton>
                    </EuiToolTip>
                </EuiHeaderSectionItem>
            </EuiHeaderSection>
            <EuiHeaderSection grow={false}>
                <EuiHeaderSectionItem border="none">
                    <EuiToolTip
                        content={
                            host ? 'The host of the room has extra permissions such as the ability to kick members.' : 'Volunteer to host this room.'
                        }>
                        <EuiHeaderSectionItemButton
                            style={{ padding: '0 10px' }}
                            disabled={!!host}
                            onClick={requestChangeHost}>
                            <EuiHealth color={host ? 'success' : 'danger'}>
                                <EuiDescriptionList
                                    type="inline"
                                    listItems={[{ title: 'Room Host', description: host ? host.nickname : 'No host' }]} />
                            </EuiHealth>
                        </EuiHeaderSectionItemButton>
                    </EuiToolTip>
                </EuiHeaderSectionItem>
            </EuiHeaderSection>
            <EuiHeaderSection grow={false}>
                <EuiHeaderSectionItem border="left">
                    <RoomSettings
                        disabled={isDisabled} />
                </EuiHeaderSectionItem>
            </EuiHeaderSection>
        </EuiHeader>
    );
}