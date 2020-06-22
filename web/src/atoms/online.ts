import { atom } from "recoil";

export const onlineState = atom({
    key: 'online',
    default: window.navigator.onLine
});