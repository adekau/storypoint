import { atom } from "recoil";

export const roomState = atom<any>({
    key: 'room',
    default: null
});