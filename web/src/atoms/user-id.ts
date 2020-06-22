import { atom } from "recoil";

export const userIdState = atom<string | null>({
    key: 'userId',
    default: null
});