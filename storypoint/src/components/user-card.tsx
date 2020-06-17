import { EuiAvatar, EuiCard } from '@elastic/eui';
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { IUserDetail } from '../../../shared/types/user';
import { selectedUserCardsState } from '../atoms/selected-vote-cards';
import { voteCardState } from '../atoms/vote-card';
import { isSelectedSelector } from '../selectors/is-selected';

export interface VoteCardProps {
    user: IUserDetail;
}

export function UserCard(props: VoteCardProps) {
    const vote = useRecoilValue(voteCardState(props.user.userId));
    const [selectedUserCards, setSelectedUserCards] = useRecoilState(selectedUserCardsState);
    const isSelected = useRecoilValue(isSelectedSelector(props.user.userId));

    const cardClick = () => {
        if (!isSelected)
            setSelectedUserCards([...selectedUserCards, props.user.userId]);
        else
            setSelectedUserCards(selectedUserCards.filter(val => val !== props.user.userId));
    };

    return (
        <EuiCard
            layout="horizontal"
            selectable={{
                isSelected,
                onClick: cardClick
            }}
            icon={<EuiAvatar size="xl" name={props.user.nickname || '?'} />}
            title={props.user.nickname || 'Anonymous'}
            description={
                <span>Vote: <strong>{vote.toString() ?? ''}</strong></span>
            }
        />
    );
}