import {
    EuiForm,
    EuiFormRow,
    EuiHeaderSectionItemButton,
    EuiHealth,
    EuiIcon,
    EuiPopover,
    EuiSuperSelect,
} from '@elastic/eui';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { isOpenState } from '../atoms/settings-menu';
import setTheme from '../helpers/set-theme';
import { useGlobalToast } from '../hooks/global-toast.hook';
import { Themes } from '../types/themes';

let initialLoad = true;

export default function SettingsMenu() {
    const [themeFieldValue, setThemeFieldValue] = useState<Themes>(
        (window.localStorage.getItem('storypoint-theme') as Themes) ?? 'light'
    );
    const [isOpen, setIsOpen] = useRecoilState(isOpenState);
    const { addToast } = useGlobalToast();

    useEffect(() => {
        localStorage.setItem('storypoint-theme', themeFieldValue);
        setTheme(themeFieldValue);
        if (!initialLoad)
            addToast({
                title: 'Theme Changed',
                text: <span>Theme switched to <strong>{themeFieldValue}</strong></span>,
                iconType: 'brush',
                color: 'primary'
            });
        initialLoad = false;
    }, [themeFieldValue, addToast]);

    const themeChange = (selection: Themes) => setThemeFieldValue(selection);

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
                    defaultValue={themeFieldValue}
                    valueOfSelected={themeFieldValue}
                    onChange={themeChange}></EuiSuperSelect>
                </EuiFormRow>
            </EuiForm>

        </EuiPopover>
    );
}