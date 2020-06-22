import { atom } from "recoil";

export const voteOptionsState = atom({
    key: 'voteOptions',
    default: [0, 0.5, 1, 2, 3, 5, 8, 13]
});