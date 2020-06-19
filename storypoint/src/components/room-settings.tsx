import {
    EuiFieldText,
    EuiFocusTrap,
    EuiForm,
    EuiFormRow,
    EuiHeaderSectionItemButton,
    EuiIcon,
    EuiPopover,
    EuiToolTip,
} from '@elastic/eui';
import React, { useState, useCallback } from 'react';
import { useRecoilState } from 'recoil';

import { nicknameState } from '../atoms/nickname';

export interface RoomSettingsProps {
    disabled?: boolean;
}

export default function RoomSettings(props: RoomSettingsProps) {
    const [nickname, setNickname] = useRecoilState(nicknameState);
    const [nicknameField, setNicknameField] = useState(nickname);
    const [open, setOpen] = useState(false);

    const close = useCallback(() => {
        setOpen(false);
        if (nickname !== nicknameField)
            setNickname(nicknameField);
    }, [setOpen, nickname, nicknameField, setNickname]);

    const gearClick = useCallback(() => {
        if (!open)
            setOpen(true);
        else
            close();
    }, [setOpen, open, close]);

    return (
        <EuiPopover
            isOpen={open}
            closePopover={close}
            button={
                <EuiHeaderSectionItemButton
                    disabled={props.disabled}
                    onClick={gearClick}>
                    <EuiIcon type="gear"></EuiIcon>
                </EuiHeaderSectionItemButton>
            }>
            <EuiFocusTrap>
                <EuiForm>
                    <EuiFormRow
                        label={
                            <EuiToolTip content="Your display name in this room.">
                                <span>Nickname <EuiIcon type="questionInCircle"></EuiIcon></span>
                            </EuiToolTip>
                        }
                        display="columnCompressed">
                        <EuiFieldText
                            value={nicknameField}
                            compressed
                            onChange={(ev) => setNicknameField(ev.target.value)}
                        />
                    </EuiFormRow>
                </EuiForm>
            </EuiFocusTrap>
        </EuiPopover>
    );
}