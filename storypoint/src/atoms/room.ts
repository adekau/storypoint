import { atom } from 'recoil';

import { IRoomDetail } from '../../../shared/types/room';

export const roomState = atom<IRoomDetail | null>({
    key: 'room',
    default: null
});