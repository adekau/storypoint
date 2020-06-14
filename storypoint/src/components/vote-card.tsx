import React, { useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';

import { IUserDetail } from '../../../shared/types/user';
import { voteCardState } from '../atoms/vote-card';
import { EuiCard } from '@elastic/eui';

export interface VoteCardProps {
    user: IUserDetail;
}

export function VoteCard(props: VoteCardProps) {
    const [isSelected, setIsSelected] = useState(false);
    const [vote, setVote] = useRecoilState(voteCardState(props.user.userId))

    const cardClick = () => {
        setIsSelected(!isSelected);
    };

    return (
        <EuiCard selectable={{ isSelected, onClick: cardClick }} title={props.user.nickname} description={vote.toString() ?? ''} />
    );
}