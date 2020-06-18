import { toIMF } from 'https://deno.land/std/datetime/mod.ts';
import clc from 'https://deno.land/x/color/index.ts';

const colorText = (color: any) => (text: string) => 
    `${color.text(text)}${clc.reset.text('')}`;

const colorGreen = colorText(clc.green);
const colorBlue = colorText(clc.blue);
const colorYellow = colorText(clc.yellow);
const colorRed = colorText(clc.red);
const colorDim = colorText(clc.dim);

export default class Logger {
    public static log(message: string): void {
        Logger.base(message, colorDim('LOG'));
    }

    public static error(message: string): void {
        Logger.base(message, colorRed('ERROR'));
    }

    public static warn(message: string): void {
        Logger.base(message, colorYellow('WARN'));
    }

    private static base(message: string, type: string): void {
        const time = toIMF(new Date());
        const regex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/g;
        const results = [...message.matchAll(regex)].flat();
        let newMessage = message;
        results.forEach(guid => {
            newMessage = newMessage.replace(guid, colorGreen(guid));
        });

        console.log(`[${type}] [${colorBlue(time)}]: ${newMessage}`);
    }
}