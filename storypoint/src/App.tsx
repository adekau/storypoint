import './App.css';

import { EuiHeader, EuiHeaderLogo, EuiPage } from '@elastic/eui';
import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { themeState } from './atoms/theme';
import CreateRoom from './components/create-room';
import SettingsMenu from './components/settings-menu';

function App() {
  const theme = useRecoilValue(themeState);

  useEffect(() => {
    const themeRel = document.querySelector('#themeRel');
    themeRel?.setAttribute('href', `css/eui_theme_${theme}.css`); 
  }, [theme]);

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
      <EuiPage style={{ padding: 40, minHeight: `calc(100vh - 49px)` }}>
        <CreateRoom />
      </EuiPage>
    </>
  );
}

export default App;
