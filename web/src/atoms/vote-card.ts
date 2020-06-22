import { memoize } from 'lodash';
import { atom } from 'recoil';

export const voteCardState = memoize((value: string) => atom<number>({
    key: 'voteCard-' + value,
    default: 0
}));