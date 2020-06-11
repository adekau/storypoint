import { WebSocket } from 'https://deno.land/std/ws/mod.ts';

export interface IUser {
    roomId: string;
    userId: string;
    websocket: WebSocket;
    name?: string;
}

export interface IUserDetail {
    roomId: string;
    userId: string;
    name?: string;
}