import { IUser, IUserDetail } from '../shared/types/user.ts';
import { IRoom, IRoomDetail } from '../shared/types/room.ts';

export function translateUsers(users: Array<IUser>): Array<IUserDetail> {
    return users.map(user => ({
        userId: user.userId,
        roomId: user.roomId,
        nickname: user.nickname,
    }));
}

export async function translateRoom(room: IRoom): Promise<IRoomDetail> {
    return {
        id: room.id,
        roomName: room.roomName,
        host: room.host,
        users: translateUsers([...room.users])
    };
}