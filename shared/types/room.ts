import { IUser, IUserDetail } from './user.ts';

export interface IRoom {
    id: string;
    users: Array<IUser>;
    roomName: string;
    host: string;
}

export interface IRoomDetail {
    id: string;
    users: IUserDetail[];
    roomName: string;
    host: string;
}