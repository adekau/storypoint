import { EuiHeader, EuiHeaderSection, EuiHeaderSectionItem, EuiHealth, EuiToolTip } from '@elastic/eui';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { onlineState } from './atoms/online';
import { WebSocketStatus } from './atoms/websocketStatus';
import CreateRoom from './components/create-room';
import GlobalToast from './components/global-toast';
import Logo from './components/logo';
import Room from './components/room';
import SettingsMenu from './components/settings-menu';
import { useConnectionWatcher } from './hooks/connection-watcher.hook';
import { useWebSocket } from './hooks/websocket.hook';

function App() {
    useConnectionWatcher();

    function AppRoutes() {
        return (
            <Switch>
                <Route exact path="/">
                    <CreateRoom />
                </Route>

                <Route path="/:roomId">
                    <Room />
                </Route>
            </Switch>
        );
    }

    return (
        <Router>
            <div className={'mainGrid'}>
                <EuiHeader>
                    <EuiHeaderSection>
                        <EuiHeaderSectionItem border="right">
                            <Logo />
                        </EuiHeaderSectionItem>
                    </EuiHeaderSection>
                    <EuiHeaderSection>
                        <EuiHeaderSectionItem border="none">
                            <ConnectionStatus />
                        </EuiHeaderSectionItem>
                        <EuiHeaderSectionItem border="left">
                            <SettingsMenu />
                        </EuiHeaderSectionItem>
                    </EuiHeaderSection>
                </EuiHeader>

                <AppRoutes />
                <GlobalToast />
            </div>
        </Router>
    );
}

export function ConnectionStatus() {
    const { webSocketStatus } = useWebSocket();
    const online = useRecoilValue(onlineState);
    const healthy = webSocketStatus === WebSocketStatus.Connected && online;
    return (
        <EuiToolTip
            content={healthy ? 'Connected' : 'Disconnected'}>
            <EuiHealth
                color={healthy ? 'success' : 'danger'}
                style={{ marginRight: 8 }} />
        </EuiToolTip>
    );
}

export default App;
