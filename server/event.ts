import { roomsMap, removeUser } from "./data/data.ts";
import { translateUsers } from "./translation.ts";
import Logger from "./logger.ts";

export async function emitEvent(roomId: string) {
    const users = roomsMap.get(roomId)?.users ?? [];

    for (const user of users) {
        const event = {
            event: 'userJoin',
            users: translateUsers(users)
        }

        try {
            user.websocket.send(JSON.stringify(event));
        } catch (e) {
            Logger.warn(`User ${user.userId} can not be reached.`);
            await removeUser(user.userId);
            break;
        }
    }
}