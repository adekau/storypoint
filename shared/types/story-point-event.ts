import { IUser, IUserDetail } from './user.ts';
import { IRoom } from './room.ts';

export type StoryPointEvent = {
    event: 'roomCreate';
    roomId: string;
    users: IUser[];
    roomName: string;
} | {
    event: 'userJoin';
    users: IUserDetail[];
    room: IRoom;
} | {
    event: 'userLeave';
    users: IUserDetail[];
    room: IRoom;
} | {
    event: 'left'
} | {
    event: 'leave';
    roomId: string;
} | {
    event: 'join';
    roomId: string;
    nickname: string;
} | {
    event: 'create';
    roomName: string;
};