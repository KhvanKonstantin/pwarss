// Created by Konstantin Khvan on 7/23/18 2:43 PM

import {IObservableArray, observable, runInAction, toJS} from "mobx";
import {IdType, NewsEntry, NullEntry} from "../model/NewsEntry";
import api from "../api";
import {debounce} from "../util";


const MAX_ENTRIES_PER_REQUEST = 200;

export enum NEWS_FILTER {
    ALL,
    UNREAD,
    STARRED
}

export default class NewsStore {
    private localStore = new LocalStore();

    private latest: IObservableArray<NewsEntry> = observable.array(this.localStore.readNews(NEWS_FILTER.ALL));
    private unread: IObservableArray<NewsEntry> = observable.array(this.localStore.readNews(NEWS_FILTER.UNREAD));
    private starred: IObservableArray<NewsEntry> = observable.array(this.localStore.readNews(NEWS_FILTER.STARRED));

    newsToShow(filter: NEWS_FILTER): Array<NewsEntry> {
        if (filter == NEWS_FILTER.ALL) {
            return this.latest;
        }
        if (filter == NEWS_FILTER.UNREAD) {
            return this.unread;
        }
        if (filter == NEWS_FILTER.STARRED) {
            return this.starred;
        }
        return this.latest;
    }

    async updateNews(): Promise<any> {
        const update = (array: IObservableArray<NewsEntry>) => (newData: Array<NewsEntry>) =>
            runInAction(() => {
                array.replace(newData);
                this.saveCaches();
            });

        try {
            const requests = [api.entry.findAll(MAX_ENTRIES_PER_REQUEST).then(update(this.latest)),
                api.entry.findUnread(MAX_ENTRIES_PER_REQUEST).then(update(this.unread)),
                api.entry.findStarred(MAX_ENTRIES_PER_REQUEST).then(update(this.starred))];

            await Promise.all(requests);
        } catch (e) {
            console.log(e)
        }
        return "refreshed";
    }

    saveCaches = debounce(100, () => {
        this.localStore.updateNews(NEWS_FILTER.ALL, this.latest);
        this.localStore.updateNews(NEWS_FILTER.UNREAD, this.unread);
        this.localStore.updateNews(NEWS_FILTER.STARRED, this.starred);
    });

    entryById(newsEntryId: IdType): NewsEntry {
        const byId = function (entry: NewsEntry) {
            return newsEntryId == entry.id
        };

        return this.latest.find(byId) || this.starred.find(byId) || this.unread.find(byId) || NullEntry;
    }

    replaceEntry(entry?: NewsEntry | null) {
        if (!entry) {
            return
        }
        const id = entry.id;

        runInAction(() => {
            [this.latest, this.unread, this.starred].forEach((entries) => {
                const index = entries.findIndex(function (entry) {
                    return id == entry.id
                });

                if (index != -1) {
                    entries[index] = entry;

                    this.saveCaches();
                }
            })
        })
    }

    async starEntry(id: IdType, star: boolean) {
        try {
            const entry = this.entryById(id);
            if (entry.id == NullEntry.id) {
                return;
            }

            const {success, entry: updatedEntry} = await api.entry.starEntry(id, star);
            if (success) {
                this.replaceEntry(updatedEntry)
            }
        } catch (e) {
            console.log(e)
        }
    }

    async readEntry(id: IdType, read: boolean) {
        try {
            const entry = this.entryById(id);
            if (entry.id == NullEntry.id) {
                return;
            }

            const {success, entry: updatedEntry} = await api.entry.readEntry(id, read);
            if (success) {
                this.replaceEntry(updatedEntry)
            }
        } catch (e) {
            console.log(e)
        }
    }

    async readAll() {
        try {
            if (this.latest.length <= 0) {
                return
            }

            const maxId = this.latest[0].id;
            await api.entry.readAll(maxId);
            await this.updateNews();
        } catch (e) {
            console.log(e)
        }
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

    readNews(filter: NEWS_FILTER): Array<NewsEntry> {
        if (filter == NEWS_FILTER.ALL) {
            return this.read("all");
        }
        if (filter == NEWS_FILTER.UNREAD) {
            return this.read("unread");
        }
        if (filter == NEWS_FILTER.STARRED) {
            return this.read("starred");
        }
        return [];
    }

    updateNews(filter: NEWS_FILTER, entries: Array<NewsEntry>) {
        if (filter == NEWS_FILTER.ALL) {
            this.update("all", entries);
        }
        if (filter == NEWS_FILTER.UNREAD) {
            this.update("unread", entries);
        }
        if (filter == NEWS_FILTER.STARRED) {
            this.update("starred", entries);
        }
    }

}

