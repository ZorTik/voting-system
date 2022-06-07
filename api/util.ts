import {Response} from "express";
import {error} from "./controllers/util";

export enum Status {
    RUNNING = 'running'
}
export function status(res: Response, code: number, message: string = "An unknown error occured!") {
    res.status(code).json(error(code, message));
}