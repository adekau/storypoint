import { IUser } from './user';

export interface IRoom {
    id: string;
    users: Array<IUser>;
    roomName: string;
    host: string;
}