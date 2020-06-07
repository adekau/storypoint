import { atom } from 'recoil';

export const themeState = atom<'light' | 'dark'>({
    key: 'themeState',
    default: (window.localStorage.getItem('storypoint-theme') as 'light' | 'dark' | null) ?? 'light'
});