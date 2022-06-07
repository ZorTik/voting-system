export function error(code: number, message: string = "An unknown error occured!", modify: (obj: any) => void = (obj: any) => {}): any {
    return {
        code: code,
        message: message
    };
}
export function now(): number {
    return new Date().valueOf();
}