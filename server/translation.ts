import { IUser, IUserDetail } from '../shared/types/user.ts';

export function translateUsers(users: Array<IUser>): Array<IUserDetail> {
    return users.map(user => ({
        userId: user.userId,
        roomId: user.roomId,
        nickname: user.nickname,
    }));
}