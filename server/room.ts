import { v4 } from 'https://deno.land/std/uuid/mod.ts';
import { isWebSocketCloseEvent, isWebSocketPingEvent, WebSocket } from 'https://deno.land/std/ws/mod.ts';

import Logger from './logger.ts';

interface IUser {
    roomId: string;
    userId: string;
    websocket: WebSocket;
    name?: string;
}

interface IUserDetail {
    roomId: string;
    userId: string;
    name?: string;
}

const usersMap = new Map<string, IUser>();
const roomsMap = new Map<string, Array<IUser>>();

export default async function handle(ws: WebSocket) {
    const userId = v4.generate();
    Logger.log(`User ${userId} connected.`);

    try {
        for await (const data of ws) {
            let parsed;
            if (typeof data === "string") {
                parsed = JSON.parse(data);
            } else if (data instanceof Uint8Array) {
                parsed = JSON.parse((data as Uint8Array).toString());
            } else if (isWebSocketPingEvent(data)) {
                const [body] = data;
                console.log("ws:Ping", body);
            } else if (isWebSocketCloseEvent(data)) {
                await removeUser(userId);
            }

            if (parsed)
                await handleEvent({
                    ev: parsed,
                    ws,
                    userId
                });
        }
    } catch (err) {
        Logger.error(`Failed to receive frame: ${err}`);

        if (!ws.isClosed) {
            await ws.close(1000).catch((e) => Logger.error(`Error closing websocket: ${e}`));
        }
    }
}

async function handleEvent(opts: { ev: any, userId: string, ws: WebSocket }): Promise<void> {
    switch (opts.ev.event) {
        case 'join':
            const user: IUser = {
                roomId: opts.ev.room,
                websocket: opts.ws,
                userId: opts.userId
            };
            usersMap.set(opts.userId, user);
            const users = [...(roomsMap.get(opts.ev.room) || [])];
            users.push(user);
            roomsMap.set(opts.ev.room, users);
            
            Logger.log(`User ${user.userId} joined room ${user.roomId}.`);

            await emitEvent(opts.ev.room);
        default:
            return;
    }
}

async function emitEvent(roomId: string) {
    const users = roomsMap.get(roomId) || [];

    for (const user of users) {
        const event = {
            event: 'userJoin',
            users: translateUsers(users)
        }

        try {
            await user.websocket.send(JSON.stringify(event));
        } catch (e) {
            Logger.warn(`User ${user.userId} can not be reached.`);
            await removeUser(user.userId);
            break;
        }
    }
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

function translateUsers(users: Array<IUser>): Array<IUserDetail> {
    return users.map(user => ({
        userId: user.userId,
        roomId: user.roomId,
        name: user.name
    }));
}