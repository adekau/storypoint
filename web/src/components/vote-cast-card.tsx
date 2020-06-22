import { EuiCheckableCard, EuiFlexItem, EuiText, htmlIdGenerator } from '@elastic/eui';
import React from 'react';

export interface VoteCastCardProps {
    value: number;
    selected: boolean;
    onClick: (n: number) => void;
}

export function VoteCastCard(props: VoteCastCardProps) {
    const { value, selected } = props;

    return (
        <EuiFlexItem style={{ minWidth: 85 }}>
            <EuiCheckableCard
                id={htmlIdGenerator()()}
                checked={selected}
                onChange={() => props.onClick(value)}
                value={value.toString()}
                label={<EuiText>{value}</EuiText>}
            />
        </EuiFlexItem>
    );
}