import {
    EuiComboBox,
    EuiFieldText,
    EuiFlyout,
    EuiFlyoutBody,
    EuiFlyoutFooter,
    EuiFlyoutHeader,
    EuiFocusTrap,
    EuiForm,
    EuiFormRow,
    EuiHeaderSectionItemButton,
    EuiIcon,
    EuiToolTip,
    EuiText,
    EuiTitle,
} from '@elastic/eui';
import React, { useCallback, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { nicknameState } from '../atoms/nickname';
import { roomState } from '../atoms/room';
import { voteOptionsState } from '../atoms/vote-options';

export interface RoomSettingsProps {
    disabled?: boolean;
}

export default function RoomSettings(props: RoomSettingsProps) {
    const [nickname, setNickname] = useRecoilState(nicknameState);
    const [voteOptions] = useRecoilState(voteOptionsState);
    const [nicknameField, setNicknameField] = useState(nickname);
    const [open, setOpen] = useState(false);
    const room = useRecoilValue(roomState);

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

    let flyout: JSX.Element | undefined;
    if (open)
        flyout = (
            <EuiFlyout
                size="m"
                onClose={close}>
                <EuiFlyoutHeader hasBorder>
                    <EuiTitle>
                        <h2>{room?.roomName ?? 'Room'} Settings</h2>
                    </EuiTitle>
                </EuiFlyoutHeader>
                <EuiFlyoutBody>
                    <EuiFocusTrap>
                        <EuiForm>
                            <EuiFormRow
                                fullWidth
                                label={
                                    <EuiToolTip content="Your display name in this room.">
                                        <span>Nickname <EuiIcon type="questionInCircle"></EuiIcon></span>
                                    </EuiToolTip>
                                }
                                display="row">
                                <EuiFieldText
                                    fullWidth
                                    value={nicknameField}
                                    onChange={(ev) => setNicknameField(ev.target.value)}
                                />
                            </EuiFormRow>
                            <EuiFormRow
                                fullWidth
                                label="Vote Options"
                                display="row">
                                <EuiComboBox
                                    fullWidth
                                    options={defaultOptions}
                                    selectedOptions={selectedOptions}
                                // onCreateOption={}
                                / >
                            </EuiFormRow>
                        </EuiForm>
                    </EuiFocusTrap>
                </EuiFlyoutBody>
                <EuiFlyoutFooter>
                    <EuiText>
                        <span>Settings will save when you close the flyout.</span>
                    </EuiText>
                </EuiFlyoutFooter>
            </EuiFlyout>
        );

    return (
        <>
            <EuiHeaderSectionItemButton
                disabled={props.disabled}
                onClick={gearClick}>
                <EuiIcon type="gear"></EuiIcon>
            </EuiHeaderSectionItemButton>
            {flyout}
        </>
    );
}