import {
    EuiForm,
    EuiFormRow,
    EuiHeaderSectionItemButton,
    EuiHealth,
    EuiIcon,
    EuiPopover,
    EuiSuperSelect,
} from '@elastic/eui';
import React from 'react';
import { useRecoilState } from 'recoil';

import { isOpenState } from '../atoms/settings-menu';
import { themeState } from '../atoms/theme';

export default function SettingsMenu() {
    const [isOpen, setIsOpen] = useRecoilState(isOpenState);
    const [theme, setTheme] = useRecoilState(themeState);

    const themeChange = (selection: 'light' | 'dark') => {
        setTheme(selection);
        localStorage.setItem('storypoint-theme', selection);
    };

    return (
        <EuiPopover
            ownFocus
            isOpen={isOpen}
            closePopover={() => setIsOpen(false)}
            button={
                <EuiHeaderSectionItemButton
                    onClick={() => setIsOpen(!isOpen)}>
                    <EuiIcon type="gear" size="m"></EuiIcon>
                </EuiHeaderSectionItemButton>
            }>
        
            <EuiForm component="form" style={{ minWidth: 300 }}>
                <EuiFormRow label="Theme">
                    <EuiSuperSelect options={[
                        {
                            inputDisplay: <EuiHealth color="subdued">Dark</EuiHealth>,
                            value: 'dark'
                        },
                        {
                            inputDisplay: <EuiHealth color="ghost">Light</EuiHealth>,
                            value: 'light'
                        }
                    ]}
                    valueOfSelected={theme}
                    onChange={themeChange}></EuiSuperSelect>
                </EuiFormRow>
            </EuiForm>

        </EuiPopover>
    );
}