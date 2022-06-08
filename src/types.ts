export type Server = {
    id: number;
    gif: string;
    name: string;
    source: Source | null;
    votes: Vote[];
}
export type Source = {
    id: number;
    ip: string;
    port: number;
}
export type Vote = {
    id: number;
    nickname: string;
}
export type PageReq = {
    page: number;
    size: number;
}