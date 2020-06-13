import { IRoom } from '../../shared/types/room.ts';
import { IUser } from '../../shared/types/user.ts';
import { emitEvent } from '../event.ts';
import Logger from '../logger.ts';
import { StoryPointEvent } from '../../shared/types/story-point-event.ts';
import { translateUsers } from '../translation.ts';

export const usersMap = new Map<string, IUser>();
export const roomsMap = new Map<string, IRoom>();

export async function addUserToRoom(user: IUser, roomId: string): Promise<void> {
    const room = roomsMap.get(roomId);
    if (!room)
        return;
    const users = room.users ? [...room.users, user] : [user];
    const newRoom = { ...room, users };
    roomsMap.set(roomId, newRoom);
}

export async function removeUser(userId: string): Promise<void> {
    const user = usersMap.get(userId);
    if (user) {
        usersMap.delete(userId);
        const room = roomsMap.get(user.roomId);
        if (!room)
            return;
        const users = room.users ?? [];
        const newUsers = users.filter(u => u.userId !== userId);
        const newRoom = { ...room, users: newUsers };
        roomsMap.set(user.roomId, newRoom);
        
        Logger.log(`User ${user.userId} left room ${user.roomId}.`);

        const event: StoryPointEvent = {
            event: 'userLeave',
            users: translateUsers(newUsers),
            room: newRoom
        };
        emitEvent(newUsers, event);
    }
}
