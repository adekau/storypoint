import { selectorFamily } from 'recoil';

import { selectedVoteCardsState } from '../atoms/selected-vote-cards';

export const isSelectedSelector = selectorFamily({
    key: 'isSelected',
    get: (id: string) => ({ get }) => {
        const selectedVoteCards = get(selectedVoteCardsState);
        return selectedVoteCards.includes(id);
    }
});