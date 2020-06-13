import { v4 } from 'https://deno.land/std/uuid/mod.ts';

import { IRoom } from '../shared/types/room.ts';
import { StoryPointEvent } from '../shared/types/story-point-event.ts';
import { IUser } from '../shared/types/user.ts';
import { addUserToRoom, removeUser, roomsMap, usersMap } from './data/data.ts';
import Logger from './logger.ts';
import { HandleEventArguments } from './room.ts';
import { translateUsers } from './translation.ts';

export async function emitEvent(users: IUser[], event: StoryPointEvent) {
    for (const user of users) {
        try {
            user.websocket.send(JSON.stringify(event));
        } catch (e) {
            Logger.warn(`User ${user.userId} can not be reached.`);
            await removeUser(user.userId);
            break;
        }
    }
}

export async function joinEvent({ ev, userId, ws }: HandleEventArguments): Promise<void> {
    if (ev.event !== 'join')
        return;

    const userJoin: IUser = {
        roomId: ev.roomId,
        websocket: ws,
        userId: userId
    };
    usersMap.set(userId, userJoin);
    await addUserToRoom(userJoin, ev.roomId);
    
    Logger.log(`User ${userJoin.userId} joined room ${userJoin.roomId}.`);

    const room = roomsMap.get(ev.roomId);
    const users = room?.users ?? [];
    const event: StoryPointEvent = {
        event: 'userJoin',
        users: translateUsers(users),
        room: room!
    };

    await emitEvent(users, event);
}

export async function leaveEvent({ ev, userId, ws }: HandleEventArguments): Promise<void> {
    if (ev.event !== 'leave')
        return;
    await removeUser(userId);
    const event: StoryPointEvent = {
        event: 'left'
    };
    try {
        ws.send(JSON.stringify(event));
    } catch (e) { }
}

export async function createRoomEvent({ ev, userId, ws }: HandleEventArguments): Promise<void> {
    if (ev.event !== 'create')
        return;
    const roomId = v4.generate();
    const room: IRoom = {
        users: [],
        roomName: ev.roomName,
        id: roomId
    };
    roomsMap.set(roomId, room);
    const event = {
        event: 'roomCreate',
        roomId,
        roomName: room.roomName,
        users: room.users
    };

    Logger.log(`Room ${roomId} created.`);

    try {
        await ws.send(JSON.stringify(event));
    } catch (e) {
        Logger.warn(`User ${userId} unable to be reached while creating room.`);
    }
}