import { atom } from "recoil";
import { IRoom } from '../../../shared/types/room';

export const roomState = atom<IRoom | null>({
    key: 'room',
    default: null
});