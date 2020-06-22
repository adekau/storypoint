import { selectorFamily } from 'recoil';

import { selectedUserCardsState } from '../atoms/selected-vote-cards';

export const isSelectedSelector = selectorFamily({
    key: 'isSelected',
    get: (id: string) => ({ get }) => {
        const selectedVoteCards = get(selectedUserCardsState);
        return selectedVoteCards.includes(id);
    }
});