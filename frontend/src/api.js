// Created by Konstantin Khvan on 7/11/18 2:05 PM

function encodeToQuery(params) {
    if (params) {
        return "?" + Object.keys(params)
            .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(params[key]))
            .join("&");
    } else {
        return ""
    }
}

function processJsonResponse(response) {
    if (response.ok) {
        return response.json()
    }

    throw new Error("Connection error. status = " + response.status)
}

function postJson(path, request) {
    return fetch("/api/" + path, {
        body: JSON.stringify(request),
        credentials: "same-origin",
        method: "POST",
        headers: {
            "content-type": "application/json"
        }
    }).then(processJsonResponse);
}

function getJson(path, params) {
    return fetch("/api/" + path + encodeToQuery(params), {
        credentials: "same-origin",
        method: "GET",
    }).then(processJsonResponse);
}

const api = {
    user: {
        login: (login, password) => postJson("login", {login, password}),
        logout: () => postJson("logout", {}),
    },

    entry: {
        findById: (id) => getJson("/entries/" + id),
        findAll: (limit) => getJson("/entries", {limit}),
        findUnread: (limit) => getJson("/unread", {limit}),
        findMarked: (limit) => getJson("/marked", {limit})
    }

};

export default api;
