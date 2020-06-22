import { atom } from "recoil";

export const selectedUserCardsState = atom<string[]>({
    key: 'selectedVoteCards',
    default: []
});