import { toIMF } from 'https://deno.land/std/datetime/mod.ts';

export default class Logger {
    public static log(message: string): void {
        Logger.base(message, 'LOG');
    }

    public static error(message: string): void {
        Logger.base(message, 'ERROR');
    }

    public static warn(message: string): void {
        Logger.base(message, 'WARN');
    }

    private static base(message: string, type: string): void {
        const time = toIMF(new Date());

        console.log(`[${type}] [${time}]: ${message}`);
    }
}