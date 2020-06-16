import { WebSocket } from 'https://deno.land/std/ws/mod.ts';

import { IRoom } from '../../shared/types/room.ts';
import { StoryPointEvent } from '../../shared/types/story-point-event.ts';
import { IUser } from '../../shared/types/user.ts';
import { emitEvent } from '../event.ts';
import Logger from '../logger.ts';
import { getRedisConnection, ROOMS_KEY, USERS_KEY } from '../redis.ts';
import { translateUsers } from '../translation.ts';

// Map from WebSocket's user uuid to the WebSocket
export const wsMap = new Map<string, WebSocket>();

export async function addUserToRoom(user: IUser, roomId: string): Promise<void> {
    const room = await getRoom(roomId);
    if (!room)
        return;
    const users = room.users ? [...room.users, user] : [user];
    const newRoom = { ...room, users };
    await setRoom(roomId, newRoom);
}

export async function removeUser(userId: string): Promise<void> {
    const redis = await getRedisConnection();
    const user = await getUser(userId);
    if (user) {
        await redis.hdel(USERS_KEY, userId);
        const room = await getRoom(user.roomId);
        if (!room)
            return;
        const users = room.users ?? [];
        const newUsers = users.filter(u => u.userId !== userId);
        const newRoom = { ...room, users: newUsers };
        await setRoom(user.roomId, newRoom);
        
        Logger.log(`User ${user.userId} left room ${user.roomId}.`);

        const event: StoryPointEvent = {
            event: 'userLeave',
            users: translateUsers(newUsers),
            room: newRoom
        };
        emitEvent(newUsers, event);
    }
}

export async function getRoom(roomId: string): Promise<IRoom | undefined> {
    const redis = await getRedisConnection();
    const roomData = await redis.hget(ROOMS_KEY, roomId);
    if (!roomData)
        return undefined;

    let room: IRoom | undefined = undefined;

    try {
        room = JSON.parse(roomData);
    } catch (ex) {
        Logger.error(`Error trying to get room from redis: ${ex}`);
    } finally {
        return room;
    }
}

export async function setRoom(roomId: string, room: IRoom): Promise<number> {
    const redis = await getRedisConnection();
    const data = JSON.stringify(room);
    return await redis.hset(ROOMS_KEY, roomId, data);
}

export async function getUser(userId: string): Promise<IUser | undefined> {
    const redis = await getRedisConnection();
    const userData = await redis.hget(USERS_KEY, userId);

    if (!userData)
        return undefined;

    let user: IUser | undefined = undefined;

    try {
        user = JSON.parse(userData);
    } catch (ex) {
        Logger.error(`Error trying to get room from redis: ${ex}`);
    } finally {
        return user;
    }
}

export async function setUser(userId: string, user: IUser): Promise<number> {
    const redis = await getRedisConnection();
    const data = JSON.stringify(user);
    return await redis.hset(USERS_KEY, userId, data);
}

export function getWS(userId: string): WebSocket | undefined {
    return wsMap.get(userId);
}

export function setWS(userId: string, ws: WebSocket): void {
    wsMap.set(userId, ws);
}