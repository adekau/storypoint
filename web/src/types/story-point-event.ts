import { IRoom } from './room';
import { IUser } from './user';

export type StoryPointEvent = {
    event: 'connectAck',
    userId: string;
} | {
    event: 'roomCreate';
    room: IRoom;
} | {
    event: 'userJoin';
    users: IUser[];
    room: IRoom;
} | {
    event: 'userLeave';
    users: IUser[];
    room: IRoom;
} | {
    event: 'hostChange';
    userId: string;
} | {
    event: 'left';
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
} | {
    event: 'kick';
    userIds: string[];
} | {
    event: 'kicked';
    room: IRoom;
} | {
    event: 'no-permissions';
    action: string;
} | {
    event: 'error';
    status: number;
    message: string;
} | {
    event: 'vote';
    userId: string;
    vote: number;
};