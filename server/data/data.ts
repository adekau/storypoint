import { IUser } from '../types/user.ts';
import { IRoom } from '../types/room.ts';

const usersMap = new Map<string, IUser>();
const roomsMap = new Map<string, Array<IRoom>>();

async function addUserToRoom(user: IUser, roomId: string): Promise<void> {
    const users = [...(roomsMap.get(roomId) || [])];
    users.push(user);
    roomsMap.set(roomId, users);
}



async function removeUser(userId: string): Promise<void> {
    const user = usersMap.get(userId);
    if (user) {
        usersMap.delete(userId);
        const users = roomsMap.get(user.roomId) ?? [];
        const newUsers = users.filter(u => u.userId !== userId);
        roomsMap.set(user.roomId, newUsers);
        
        Logger.log(`User ${user.userId} left room ${user.roomId}.`);

        emitEvent(user.roomId);
    }
}
