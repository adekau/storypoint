import { v4 } from 'https://deno.land/std/uuid/mod.ts';
import { WebSocket } from 'https://deno.land/std/ws/mod.ts';

import { addUserToRoom, getRoom, getUser, getWS, isRoomHost, removeUser, setRoom, setUser } from './data/data.ts';
import Logger from './logger.ts';
import { HandleEventArguments } from './room.ts';
import { translateRoom, translateUsers } from './translation.ts';
import { IRoom } from './types/room.ts';
import { StoryPointEvent } from './types/story-point-event.ts';
import { IUser } from './types/user.ts';

export async function emitEvent(users: IUser[], event: StoryPointEvent) {
    for (const user of users) {
        try {
            const ws = getWS(user.userId);
            if (!ws) {
                await removeUser(user.userId);
                continue;
            }
            trySend(ws, event, user.userId);
        } catch (e) {
            Logger.warn(`User ${user.userId} can not be reached.`);
            break;
        }
    }
}

export async function joinEvent({ ev, userId }: HandleEventArguments): Promise<void> {
    if (ev.event !== 'join')
        return;

    const userJoin: IUser = {
        roomId: ev.roomId,
        userId: userId,
        nickname: ev.nickname
    };

    await setUser(userId, userJoin);
    await addUserToRoom(userJoin, ev.roomId);
    
    Logger.log(`User ${userJoin.userId} joined room ${userJoin.roomId}.`);

    const room = await getRoom(ev.roomId);
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
    await trySend(ws, event, userId);
}

export async function createRoomEvent({ ev, userId, ws }: HandleEventArguments): Promise<void> {
    if (ev.event !== 'create')
        return;
    const roomId = v4.generate();
    const room: IRoom = {
        users: [],
        roomName: ev.roomName,
        id: roomId,
        host: userId
    };
    await setRoom(roomId, room);
    const event: StoryPointEvent = {
        event: 'roomCreate',
        room: await translateRoom(room)
    };

    Logger.log(`Room ${roomId} created.`);

    await trySend(ws, event, userId);
}

export async function kickUsersEvent({ ev, userId, ws }: HandleEventArguments): Promise<void> {
    if(ev.event !== 'kick')
        return;
    for (const uid of (ev.userIds ?? [])) {
        const user = await getUser(uid);
        if (!user)
            continue;
        const room = await getRoom(user.roomId);
        if (!room)
            continue;
        const canKick = await isRoomHost(userId, user.roomId);
        if (!canKick)
            return await respondNoPermissions(arguments[0], 'kick');
        try {
            await removeUser(uid);
        } catch (ex) {
            throw new Error(`Unable to remove user ${uid} from room ${room.id}: ${ex}`);
        }
        const userWS = getWS(uid);
        const event: StoryPointEvent = {
            event: 'kicked',
            room: await translateRoom(room)
        };
        await trySend(userWS, event, uid);
    }
}

export async function hostChangeEvent({ ev, userId }: HandleEventArguments): Promise<void> {
    if(ev.event !== 'hostChange')
        return;
    const user = await getUser(userId);
    if (!user)
        return;
    const room = await getRoom(user.roomId);
    if (!room)
        return;
    if (room.users.find(user => user.userId === room.host))
        return await respondNoPermissions(arguments[0], 'Volunteer Host');
    const newRoom: IRoom = {
        ...room,
        host: ev.userId
    };
    await setRoom(room.id, newRoom);
    await emitEvent(room.users, ev);
}

export async function respondNoPermissions({ userId, ws }: HandleEventArguments, action: string): Promise<void> {
    const event: StoryPointEvent = {
        event: 'no-permissions',
        action
    };
    await trySend(ws, event, userId);
}

export async function trySend(ws: WebSocket | undefined, event: StoryPointEvent, userId?: string): Promise<void> {
    try {
        const msg = JSON.stringify(event);
        ws?.send(msg);
    } catch (ex) {
        Logger.error(`Unable to reach user ${userId || ''} while trying to send event-type "${event.event}".`);
        await removeUser(userId || '');
    }
}

export async function respondWithError({ ws, userId }: HandleEventArguments, status: number, message: string): Promise<void> {
    const event: StoryPointEvent = {
        event: 'error',
        status,
        message
    };
    await trySend(ws, event, userId);
}