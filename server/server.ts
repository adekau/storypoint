import { serve } from 'https://deno.land/std/http/server.ts';
import { acceptable, acceptWebSocket, WebSocket } from 'https://deno.land/std/ws/mod.ts';

import handle from './room.ts';

const server = serve({ port: 8080 });

for await (const req of server) {
    if (acceptable(req)) {
        const ws: WebSocket = await acceptWebSocket({
            conn: req.conn,
            bufReader: req.r,
            bufWriter: req.w,
            headers: req.headers
        });

        handle(ws);
    }
}