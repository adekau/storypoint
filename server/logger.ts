import { toIMF } from 'https://deno.land/std/datetime/mod.ts';
import clc from 'https://deno.land/x/color/index.ts';

const colorText = (color: any) => (text: string) => 
    `${color.text(text)}${clc.reset.text('')}`;

export default class Logger {
    public static log(message: string): void {
        Logger.base(message, colorText(clc.dim)('LOG'));
    }

    public static error(message: string): void {
        Logger.base(message, colorText(clc.red)('ERROR'));
    }

    public static warn(message: string): void {
        Logger.base(message, colorText(clc.yellow)('WARN'));
    }

    private static base(message: string, type: string): void {
        const time = toIMF(new Date());
        const regex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/g;
        const results = [...message.matchAll(regex)].flat();
        let newMessage = message;
        results.forEach(guid => {
            newMessage = newMessage.replace(guid, colorText(clc.green)(guid));
        });

        console.log(`[${type}] [${colorText(clc.blue)(time)}]: ${newMessage}`);
    }
}