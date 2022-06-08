export function api(path: string) {
    return `http://127.0.0.1:3001${path}`;
}
export async function api_fetch(path: string, method: string = "GET", body: any = null) {
    const req: RequestInit = {
        headers: {"Content-Type": "application/json"},
        method: method,
        mode: "cors",
    };
    if(method !== "GET" && body != null) {
        req.body = JSON.stringify(body);
    }
    return fetch(api(path), req);
}