import {
    EuiButton,
    EuiFieldText,
    EuiFlexGroup,
    EuiFlexItem,
    EuiForm,
    EuiFormRow,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentBody,
    EuiPageContentHeader,
    EuiPageContentHeaderSection,
    EuiSpacer,
    EuiTitle,
} from '@elastic/eui';
import React, { useState } from 'react';

export default function CreateRoom() {
    const [loading, setLoading] = useState(false);

    return (
        <EuiPageBody
            component="div">
            <EuiPageContent
                verticalPosition="center"
                horizontalPosition="center"
                hasShadow
                paddingSize="l">
                <EuiPageContentHeader>
                    <EuiPageContentHeaderSection>
                        <EuiTitle>
                            <h2>Create a New Story Pointing Room</h2>
                        </EuiTitle>
                    </EuiPageContentHeaderSection>
                </EuiPageContentHeader>
                <EuiPageContentBody>
                    <EuiForm>
                        <EuiFormRow label="Room Name">
                            <EuiFieldText
                                placeholder="Room Name"
                                id="roomName"
                                onChange={e => { }}
                            />
                        </EuiFormRow>

                        <EuiSpacer size="m" />

                        <EuiFormRow label="Nickname" helpText="Your display name once in the room.">
                            <EuiFieldText
                                placeholder="Nickname"
                                id="nickname"
                                onChange={e => { }}
                            />
                        </EuiFormRow>

                        <EuiSpacer size="m" />

                        <EuiFlexGroup justifyContent="flexEnd">
                            <EuiFlexItem grow={false}>
                                <EuiButton
                                    isLoading={loading}
                                    type="submit"
                                    fill
                                    iconType="plusInCircleFilled"
                                    onClick={() => setLoading(true)}>
                                    Create
                                        </EuiButton>
                            </EuiFlexItem>
                        </EuiFlexGroup>
                    </EuiForm>
                </EuiPageContentBody>
            </EuiPageContent>
        </EuiPageBody>
    );
}