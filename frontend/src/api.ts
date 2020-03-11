// Created by Konstantin Khvan on 7/11/18 2:05 PM

import {User} from "./model/User";
import {IdType, NewsEntry} from "./model/NewsEntry";

export class GenericResponse {
    success: boolean = false
}

export class GenericResponseWithEntry extends GenericResponse {
    entry?: NewsEntry | null
}

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

    let error = new Error("Connection error.") as any;
    error.response = response;
    throw error;
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
        login: (login: string, password: string) => postJson<User>("login", {login, password}),
        logout: () => postJson<any>("logout", {}),
        user: () => getJson<any>("user", {}),
    },

    entry: {
        findById: (id: IdType) => getJson<NewsEntry>("entries/" + id),
        findAll: (limit: number) => getJson<Array<NewsEntry>>("entries", {limit}),
        findUnread: (limit: number) => getJson<Array<NewsEntry>>("entries", {limit, unread: true}),
        findStarred: (limit: number) => getJson<Array<NewsEntry>>("entries", {limit, starred: true}),
        readAll: (maxId: IdType) => postJson<GenericResponse>("entries/read", {maxId}),

        starEntry: (id: IdType, star: boolean) => postJson<GenericResponseWithEntry>(`entries/${id}/star`, {star}),
        readEntry: (id: IdType, read: boolean) => postJson<GenericResponseWithEntry>(`entries/${id}/read`, {read})
    }

};

export default api;
