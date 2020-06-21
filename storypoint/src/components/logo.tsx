import { EuiHeaderLogo } from '@elastic/eui';
import React from 'react';
import { useHistory } from 'react-router-dom';

export default function Logo() {
    const history = useHistory();

    return (
        <EuiHeaderLogo
            iconType="bullseye"
            onClick={() => history.push('/')}>
            StoryPoint
        </EuiHeaderLogo>
    );
}