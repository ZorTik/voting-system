import {ConvertingLoggerImpl, Level} from "./logging";
import moment from "moment";

export class DateLogger extends ConvertingLoggerImpl<any> {
    private readonly format: string | null;
    constructor(lvlInitial: Level[] = [], format: string | null = null) {
        super();
        this.format = format;
    }
    printPlain(obj: string, level: Level | null): void {
        let date = new Date();
        console.log(`[${
            this.format == null
                ? date.toLocaleString()
                : moment().format(this.format)
        } ${level?.name}] -- ${obj}`);
    }
}