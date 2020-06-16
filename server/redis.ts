import { connect } from 'https://deno.land/x/redis/mod.ts';

export const ROOMS_KEY = 'rooms';
export const USERS_KEY = 'users';

export const getRedisConnection = async () => {
    const redis = await connect({
        hostname: 'localhost',
        port: 6379
    });
    return redis;
};