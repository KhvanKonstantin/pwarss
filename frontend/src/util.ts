// Created by Konstantin Khvan on 8/15/18 9:15 PM

export function debounce(ms: number, f: () => any) {
    if (ms < 0) {
        throw new Error(`Cannot wait for: ${ms} ms`)
    }

    let id = -1;

    return function () {
        window.clearTimeout(id);
        id = window.setTimeout(f, ms);
    }
}