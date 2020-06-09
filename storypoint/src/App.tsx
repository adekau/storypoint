import { EuiHeader, EuiHeaderLogo, EuiPage } from '@elastic/eui';
import React from 'react';

import CreateRoom from './components/create-room';
import GlobalToast from './components/global-toast';
import SettingsMenu from './components/settings-menu';
import { useConnectionWatcher } from './hooks/connection-watcher.hook';
import { useTheme } from './hooks/theme.hook';

function App() {
  useTheme();
  useConnectionWatcher();

  return (
    <>
      <EuiHeader
        sections={[
          {
            items: [
              <EuiHeaderLogo iconType="bullseye">StoryPoints</EuiHeaderLogo>,
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

      <EuiPage style={{ padding: 40, minHeight: `calc(100vh - 49px)` }}>
        <CreateRoom />
      </EuiPage>
    </>
  );
}

export default App;
