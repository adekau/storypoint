import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiButton } from '@elastic/eui';
import React, { useState } from 'react';

import { VoteCastCard } from './vote-cast-card';

export interface VoteCastProps {
    options: number[];
}

export function VoteCast(props: VoteCastProps) {
    const [selected, setSelected] = useState<number | null>(null);
    return (
        <EuiPanel betaBadgeTitle={'Vote'} betaBadgeLabel={'Vote'} paddingSize="l">
            <EuiFlexGroup direction="column" gutterSize="l">
                <EuiFlexItem>
                    <EuiFlexGroup gutterSize="l" wrap={true}>
                        {props.options.map(opt => <VoteCastCard onClick={(v) => setSelected(v)} key={opt} value={opt} selected={opt === selected} />)}
                    </EuiFlexGroup>
                </EuiFlexItem>

                <EuiFlexItem>
                    <EuiFlexGroup justifyContent="center">
                        <EuiFlexItem grow={false}>
                            <EuiButton>Cast Vote</EuiButton>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiFlexItem>
            </EuiFlexGroup>
        </EuiPanel>
    );
}