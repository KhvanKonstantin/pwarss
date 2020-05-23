// Created by Konstantin Khvan on 7/23/18 2:43 PM

import {action, IObservableArray, observable, toJS} from "mobx";
import {IdType, NewsEntry, NullEntry} from "../model/NewsEntry";
import api from "../api";


const MAX_ENTRIES_PER_REQUEST = 200;

export enum NEWS_FILTER {
    ALL,
    UNREAD,
    STARRED
}

export default class NewsStore {
    private localStore = new LocalStore();

    private cache: IObservableArray<NewsEntry> = observable.array(this.localStore.readNews());

    private filter = NEWS_FILTER.ALL;

    entryById(id: IdType): NewsEntry {
        return this.cache.find(e => id === e.id) || NullEntry;
    }


    entries(): Array<NewsEntry> {
        return this.cache;
    }

    async update(filter: NEWS_FILTER): Promise<NewsEntry[]> {
        try {
            let fn = api.entry.findAll;

            if (filter === NEWS_FILTER.ALL) {
                fn = api.entry.findAll;
            }
            if (filter === NEWS_FILTER.UNREAD) {
                fn = api.entry.findUnread;
            }
            if (filter === NEWS_FILTER.STARRED) {
                fn = api.entry.findStarred;
            }

            const updated = await fn(MAX_ENTRIES_PER_REQUEST) || [];
            this.filter = filter;
            this.replaceEntries(updated);
            this.localStore.updateNews(this.cache);
        } catch (e) {
            console.log(e)
        }

        return Promise.resolve(this.cache);
    }

    async refresh(): Promise<NewsEntry[]> {
        return this.update(this.filter);
    }

    @action
    replaceEntry(entry?: NewsEntry | null) {
        if (!entry) {
            return
        }

        for (let i = 0; i < this.cache.length; i++) {
            if (this.cache[i].id === entry.id) {
                this.cache[i] = entry;
            }
        }
    }

    @action
    replaceEntries(entries: NewsEntry[]) {
        this.cache.replace(entries);
    }

    async starEntry(id: IdType, star: boolean) {
        try {
            const {entry} = await api.entry.starEntry(id, star);
            this.replaceEntry(entry);
        } catch (e) {
            console.log(e)
        }
    }

    async readEntry(id: IdType, read: boolean) {
        try {
            const {entry} = await api.entry.readEntry(id, read);
            this.replaceEntry(entry);
        } catch (e) {
            console.log(e)
        }
    }

    async readAll() {
        try {
            const ids = this.cache.filter(entry => !entry.read).map(entry => entry.id);
            if (ids.length <= 0) {
                return;
            }
            await api.entry.readAll(ids);
            await this.refresh();
        } catch (e) {
            console.log(e)
        }
    }

    @action
    reset() {
        this.localStore.clear();
        this.cache.clear();
    }
}

function loadAsJson<T>(key: string): T | null {
    const text = window.localStorage.getItem(key);
    if (text == null) {
        return null;
    }
    return JSON.parse(text);
}

function storeAsJson(key: string, obj: any) {
    window.localStorage.setItem(key, JSON.stringify(obj))
}

class LocalStore {
    private read(key: string): Array<NewsEntry> {
        return loadAsJson<Array<NewsEntry>>("v1/" + key) || [];
    }

    private update(key: string, entries: Array<NewsEntry>) {
        storeAsJson("v1/" + key, toJS(entries))
    }

    readNews(): Array<NewsEntry> {
        return this.read("cache");
    }

    updateNews(entries: Array<NewsEntry>) {
        this.update("cache", entries);
    }

    clear() {
        this.update("cache", []);
    }
}

