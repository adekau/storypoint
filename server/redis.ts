import memoize from 'https://deno.land/x/lodash/memoize.js';
import { Bulk, connect, Redis } from 'https://deno.land/x/redis@v0.10.4/mod.ts';

export const ROOMS_KEY = 'rooms';
export const USERS_KEY = 'users';
export const isRedisError = (ex: any) => String(ex).includes('EOF') || String(ex).includes('10061');

export const getRedisConnection: () => Promise<Redis | undefined> = memoize(
    async (): Promise<Redis | undefined> => {
        let redis = undefined;
        try {
            redis = await connect({
                hostname: Deno.env.get("REDIS_HOST") ?? 'localhost',
                port: 6379
            });
        } catch (ex) {
            if (isRedisError(ex))
                ((getRedisConnection as any).cache as Map<any, any>).clear();
            throw ex;
        }
        return redis;
    },
    undefined
) as any;

export const redisGet = (hashmap: string) =>
    async (key: string) => {
        const redis = await getRedisConnection();

        let data: Bulk = undefined;

        try {
            data = await redis?.hget(hashmap, key);
        } catch (ex) {
            if (isRedisError(ex))
                ((getRedisConnection as any).cache as Map<any, any>).clear();
            throw ex;
        }
        return data;
    }

export const redisSet = (hashmap: string) => (key: string) =>
    async (data: string) => {
        const redis = await getRedisConnection();

        let numSet = 0;

        try {
            numSet = await redis?.hset(hashmap, key, data) ?? 0;
        } catch (ex) {
            if (isRedisError(ex))
                ((getRedisConnection as any).cache as Map<any, any>).clear();
            throw ex;
        }
        return numSet;
    }

export const redisDel = (hashmap: string) =>
    async (key: string) => {
        const redis = await getRedisConnection();

        let numDel = 0;

        try {
            numDel = await redis?.hdel(hashmap, key) ?? 0;
        } catch (ex) {
            if (isRedisError(ex))
                ((getRedisConnection as any).cache as Map<any, any>).clear();
            throw ex;
        }
        return numDel;
    }