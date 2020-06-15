import { EuiCard, EuiFlexItem } from '@elastic/eui';
import React from 'react';

export interface VoteCastCardProps {
    value: number;
    selected: boolean;
    onClick: (n: number) => void;
}

export function VoteCastCard(props: VoteCastCardProps) {
    const { value, selected } = props;

    return (
        <EuiFlexItem style={{ width: 120, minWidth: 120 }}>
            <EuiCard
                selectable={{ isSelected: selected, onClick: () => props.onClick(value) }}
                title={value}
                description={''}
            />
        </EuiFlexItem>
    );
}