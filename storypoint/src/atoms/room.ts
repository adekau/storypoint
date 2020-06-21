import { atom } from 'recoil';
import { IRoom } from '../types/room';

export const roomState = atom<IRoom | null>({
    key: 'room',
    default: null
});