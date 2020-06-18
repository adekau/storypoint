import { v4 } from 'https://deno.land/std/uuid/mod.ts';
import { isWebSocketCloseEvent, isWebSocketPingEvent, WebSocket } from 'https://deno.land/std/ws/mod.ts';

import { StoryPointEvent } from '../shared/types/story-point-event.ts';
import { removeUser, setWS } from './data/data.ts';
import { createRoomEvent, joinEvent, kickUsersEvent, leaveEvent, respondWithError } from './event.ts';
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

                try {
                    parsed = JSON.parse(data);
                } catch (ex) {
                    Logger.error(`Unable to parse message ${data}`);
                }

            } else if (data instanceof Uint8Array) {

                try {
                    parsed = JSON.parse((data as Uint8Array).toString());
                } catch (ex) {
                    Logger.error(`Unable to parse message ${data}`);
                }

            } else if (isWebSocketPingEvent(data)) {

                const [body] = data;
                Logger.log(`Got WebSocket ping: ${body}`);

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
    const args = arguments[0];

    switch (ev.event) {
        case 'join':
            await handleSafely(args, joinEvent);
            break;
        case 'leave':
            await handleSafely(args, leaveEvent);
            break;
        case 'create':
            await handleSafely(args, createRoomEvent);
            break;
        case 'kick':
            await handleSafely(args, kickUsersEvent);
            break;
        default:
            return;
    }
}

async function handleSafely<T>({ ev, userId }: HandleEventArguments, f: (...args: any[]) => Promise<T>): Promise<void> {
    try {
        await f(arguments[0]);
    } catch (ex) {
        Logger.error(`Error while handling event "${ev.event}" for user ${userId}: ${ex}`);
        respondWithError(arguments[0], 500, 'Internal server error');
    }
}