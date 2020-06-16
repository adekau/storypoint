import { connect } from 'https://deno.land/x/redis/mod.ts';
import memoize from 'https://deno.land/x/lodash/memoize.js';

export const ROOMS_KEY = 'rooms';
export const USERS_KEY = 'users';

export const getRedisConnection = memoize(async () => {
    const redis = await connect({
        hostname: 'localhost',
        port: 6379
    });
    return redis;
}, undefined);