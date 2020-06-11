import { StoryPointEvent } from '../shared/types/story-point-event.ts';
import { removeUser, roomsMap } from './data/data.ts';
import Logger from './logger.ts';
import { translateUsers } from './translation.ts';

export async function emitEvent(roomId: string) {
    const room = roomsMap.get(roomId);
    const users = room?.users ?? [];

    for (const user of users) {
        const event: StoryPointEvent = {
            event: 'userJoin',
            users: translateUsers(users),
            room: room!
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