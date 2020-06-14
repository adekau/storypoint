import { EuiHeader } from '@elastic/eui';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import CreateRoom from './components/create-room';
import GlobalToast from './components/global-toast';
import Logo from './components/logo';
import Room from './components/room';
import SettingsMenu from './components/settings-menu';
import { useConnectionWatcher } from './hooks/connection-watcher.hook';
import { useTheme } from './hooks/theme.hook';

function App() {
  useTheme();
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
      <EuiHeader
        sections={[
          {
            items: [
              <Logo />
            ],
            borders: 'right',
          },
          {
            items: [
              <SettingsMenu />
            ],
            borders: 'left'
          }
        ]} />

      <GlobalToast />
      <AppRoutes />
    </Router>
  );
}

export default App;
