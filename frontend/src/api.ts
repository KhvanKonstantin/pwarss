// Created by Konstantin Khvan on 7/11/18 2:05 PM

function encodeToQuery(params: { [name: string]: any }): string {
    if (params) {
        return "?" + Object.keys(params)
            .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(params[key]))
            .join("&");
    } else {
        return "";
    }
}

function processJsonResponse<T>(response: Response): Promise<T> {
    if (response.ok) {
        return response.json() as Promise<T>;
    }

    throw new Error("Connection error. status = " + response.status);
}

function postJson<T>(path: string, request: any): Promise<T> {
    return fetch("/api/" + path, {
        body: JSON.stringify(request),
        credentials: "same-origin",
        method: "POST",
        headers: {
            "content-type": "application/json"
        }
    }).then((response: Response) => processJsonResponse<T>(response));
}

function getJson<T>(path: string, params: { [name: string]: any } = {}): Promise<T> {
    return fetch("/api/" + path + encodeToQuery(params), {
        credentials: "same-origin",
        method: "GET",
    }).then((response: Response) => processJsonResponse<T>(response));
}

const api = {
    user: {
        login: (login: string, password: string) => postJson("login", {login, password}),
        logout: () => postJson("logout", {}),
    },

    entry: {
        findById: (id: number) => getJson("/entries/" + id),
        findAll: (limit: number) => getJson("/entries", {limit}),
        findUnread: (limit: number) => getJson("/unread", {limit}),
        findMarked: (limit: number) => getJson("/marked", {limit})
    }

};

export default api;
