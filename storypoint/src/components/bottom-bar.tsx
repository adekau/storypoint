import { EuiBottomBar, EuiButtonEmpty, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import React from 'react';
import { useRecoilState } from 'recoil';

import { selectedVoteCardsState } from '../atoms/selected-vote-cards';

export function BottomBar() {
    const [selectedCards, setSelectedCards] = useRecoilState(selectedVoteCardsState);

    if (!selectedCards.length)
        return <></>;
    return (
        <EuiBottomBar>
            <EuiFlexGroup gutterSize="none" justifyContent="spaceBetween">
                <EuiFlexItem grow={false}></EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <EuiButtonEmpty
                        onClick={() => setSelectedCards([])}>
                        Cancel Selection
                    </EuiButtonEmpty>
                </EuiFlexItem>
            </EuiFlexGroup>
        </EuiBottomBar>
    );
}