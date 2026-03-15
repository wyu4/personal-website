const LocalServerURL = "http://localhost:3000";
const ServerURL = import.meta.env.VITE_Server_Url;

export function getServer(): string {
    return ServerURL || LocalServerURL;
}

export function getFromServer(api: Endpoint): Promise<Response> {
    return fetch(`${getServer()}${api}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
}
