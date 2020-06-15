import { atom } from "recoil";

export const selectedVoteCardsState = atom<string[]>({
    key: 'selectedVoteCards',
    default: []
});