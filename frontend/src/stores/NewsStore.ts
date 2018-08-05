// Created by Konstantin Khvan on 7/23/18 2:43 PM

import {IObservableArray, observable, runInAction} from "mobx";
import {IdType, NewsEntry, NullEntry} from "../model/NewsEntry";
import api from "../api";


const MAX_ENTRIES_PER_REQUEST = 200;

export enum NEWS_FILTER {
    ALL,
    UNREAD,
    STARRED
}

export default class NewsStore {

    private latest: IObservableArray<NewsEntry> = observable([]);
    private unread: IObservableArray<NewsEntry> = observable([]);
    private starred: IObservableArray<NewsEntry> = observable([]);

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
        try {
            let requests = [api.entry.findAll(MAX_ENTRIES_PER_REQUEST),
                api.entry.findUnread(MAX_ENTRIES_PER_REQUEST),
                api.entry.findMarked(MAX_ENTRIES_PER_REQUEST)];

            let [latest, unread, starred] = await Promise.all(requests);

            runInAction(() => {
                this.latest.replace(latest);
                this.unread.replace(unread);
                this.starred.replace(starred);
            });
        } catch (e) {
            console.log(e)
        }
        return "refreshed";
    }

    entryById(newsEntryId: IdType): NewsEntry {
        const entry = this.latest.find(function (entry) {
            return newsEntryId == entry.id
        });

        return entry ? entry : NullEntry;
    }

    async toggleEntryMark(id: IdType) {
        try {
            const entry = this.entryById(id);
            if (entry.id != NullEntry.id) {
                let {success} = await api.entry.markEntry(id, !entry.marked);
                if (success) {
                    runInAction(() => {
                        entry.marked = !entry.marked;
                    });
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    async markEntryRead(id: IdType, read: boolean) {
        try {
            const entry = this.entryById(id);
            if (entry.id != NullEntry.id) {
                let {success} = await api.entry.markEntryRead(id, read);
                if (success) {
                    runInAction(() => {
                        entry.read = read;
                    });
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    async markAllRead() {
        try {
            if (this.latest.length <= 0) {
                return
            }

            let maxId = this.latest[0].id;
            await api.entry.markAllRead(maxId);
            await this.updateNews();
        } catch (e) {
            console.log(e)
        }
    }
}

