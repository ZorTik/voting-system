export abstract class Logger<T> {
    private readonly lvls: Level[];
    private readonly defLvl: Level | null;
    private minLvl: Level | null;
    protected constructor(lvlInitial: Level[] = []) {
        this.lvls = lvlInitial;
        if(lvlInitial.length > 0) {
            let lvlSorted = lvlInitial
                .sort((l1, l2) => {
                    return l1.priority - l2.priority;
                });
            this.defLvl = lvlSorted[0];
            this.minLvl = this.defLvl;
        } else this.defLvl = this.minLvl = null;
        let filtered: number[] = [];
        this.lvls = this.lvls
            // eslint-disable-next-line array-callback-return
            .filter((lvl, ct, arr) => {
                let prior = lvl.priority;
                if(arr.filter((l) => l.priority === prior).length === 1
                || !filtered.includes(prior)) {
                    filtered.push(prior);
                    return true;
                } else return false;
            });
    }
    abstract print(obj: T, level: Level | null): void;
    log(obj: T, level: Level | null = this.defLvl) {
        if(level != null && level.priority < this.minLvl!.priority) {
            return;
        }
        this.print(obj, level);
    }
    setDefaultLevel(prior: Level | number) {
        let level = null;
        if(typeof prior === "number") {
            let matching = this.lvls.filter(l => l.priority === prior);
            if(matching.length > 0) {
                let lvl = matching[0];
                if(lvl.priority < this.minLvl!.priority) {
                    level = lvl;
                }
            }
        } else level = prior;
        this.minLvl = level;
    }
    addLevel(level: Level): boolean {
        if(this.lvls
            .filter(l => l.priority === level.priority).length === 0) {
            this.lvls.push(level);
            if(level.priority < this.minLvl!.priority) {
                this.minLvl = level;
            }
            return true;
        }
        return false;
    }
}
export abstract class ConvertingLoggerImpl<T> extends Logger<T> {
    private readonly converters: Map<string, Converter<any & T>>;
    constructor(lvlInitial: Level[] = []) {
        super(lvlInitial);
        this.converters = new Map<string, Converter<any & T>>();
    }
    abstract printPlain(obj: string, level: Level | null): void;
    registerPrinter(typeString: string, printer: Converter<any & T>) {
        this.converters.set(typeString, printer);
    }
    print(obj: T, level: Level | null) {
        let content: any = obj;
        if(typeof obj === "string") content = String(content);
        if(!this.converters.has(typeof obj)) {
            content = content.toString();
        } else content = this.converters.get(typeof obj)!.convert(obj, level);
        this.printPlain(content, level);
    }
}
export interface Converter<T> {
    convert(obj: T, level: Level | null): string;
}
export class Level {
    static of(level: number): Level {
        return new Level(level);
    }
    private readonly level: number;
    private readonly nameString: string;
    constructor(level: number, name: string = "") {
        this.level = level;
        this.nameString = name;
    }
    get priority(): number {
        return this.level;
    }
    get name(): string {
        return this.nameString;
    }
}