import { IUser, IUserDetail } from '../shared/types/user.ts';
import { IRoom, IRoomDetail } from '../shared/types/room.ts';

export function translateUsers(users: Array<IUser>): Array<IUserDetail> {
    return users.map(user => ({
        userId: user.userId,
        roomId: user.roomId,
        nickname: user.nickname,
    }));
}

export function translateRoom(room: IRoom): IRoomDetail {
    return {
        id: room.id,
        roomName: room.roomName
    };
}