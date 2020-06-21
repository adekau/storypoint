import { IRoom, IRoomDetail } from './types/room.ts';
import { IUser, IUserDetail } from './types/user.ts';


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