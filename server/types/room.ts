import { IUser } from './user.ts';

export interface IRoom {
    id: string;
    users: Array<IUser>;
    roomName: string;
}