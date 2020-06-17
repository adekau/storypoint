import { v4 } from 'https://deno.land/std/uuid/mod.ts';
import { isWebSocketCloseEvent, isWebSocketPingEvent, WebSocket } from 'https://deno.land/std/ws/mod.ts';

import { StoryPointEvent } from '../shared/types/story-point-event.ts';
import { removeUser, setWS } from './data/data.ts';
import { createRoomEvent, joinEvent, kickUsersEvent, leaveEvent } from './event.ts';
import Logger from './logger.ts';

export type HandleEventArguments = { ev: StoryPointEvent, userId: string, ws: WebSocket };

export default async function handle(ws: WebSocket) {
    const userId = v4.generate();
    setWS(userId, ws);
    Logger.log(`User ${userId} connected.`);
    
    try {
        for await (const data of ws) {
            let parsed: any;
            if (typeof data === "string") {
                parsed = JSON.parse(data);
            } else if (data instanceof Uint8Array) {
                parsed = JSON.parse((data as Uint8Array).toString());
            } else if (isWebSocketPingEvent(data)) {
                const [body] = data;
                console.log("ws:Ping", body);
            } else if (isWebSocketCloseEvent(data)) {
                await removeUser(userId);
                Logger.log(`User ${userId} disconnected.`);
            }

            if (parsed)
                await handleEvent({
                    ev: parsed,
                    ws,
                    userId
                });
        }
    } catch (err) {
        Logger.error(`Failed to handle WebSocket message: ${err}`);

        if (!ws.isClosed) {
            await ws.close(1000).catch((e) => Logger.error(`Error closing websocket: ${e}`));
        }
    }
}

async function handleEvent({ ev }: HandleEventArguments): Promise<void> {
    switch (ev.event) {
        case 'join':
            await joinEvent(arguments[0]);
            break;
        case 'leave':
            await leaveEvent(arguments[0]);
            break;
        case 'create':
            await createRoomEvent(arguments[0]);
            break;
        case 'kick':
            await kickUsersEvent(arguments[0]);
            break;
        default:
            return;
    }
}