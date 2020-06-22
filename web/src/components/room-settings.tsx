import {
    EuiComboBox,
    EuiFieldText,
    EuiFocusTrap,
    EuiForm,
    EuiFormRow,
    EuiHeaderSectionItemButton,
    EuiIcon,
    EuiPopover,
    EuiToolTip,
} from '@elastic/eui';
import React, { useCallback, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';

import { nicknameState } from '../atoms/nickname';
import { voteOptionsState } from '../atoms/vote-options';

export interface RoomSettingsProps {
    disabled?: boolean;
}

export default function RoomSettings(props: RoomSettingsProps) {
    const [nickname, setNickname] = useRecoilState(nicknameState);
    const [voteOptions] = useRecoilState(voteOptionsState);
    const [nicknameField, setNicknameField] = useState(nickname);
    const [open, setOpen] = useState(false);

    const defaultOptions = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100].map(opt => ({ label: String(opt) }));
    const selectedOptions = useMemo(() => voteOptions.map(opt => ({ label: String(opt) })), [voteOptions]);

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
                    <EuiFormRow
                        label="Vote Options"
                        display="columnCompressed">
                        <EuiComboBox
                            options={defaultOptions}
                            selectedOptions={selectedOptions}
                            // onCreateOption={}
                            compressed>
                        </EuiComboBox>
                    </EuiFormRow>
                </EuiForm>
            </EuiFocusTrap>
        </EuiPopover>
    );
}