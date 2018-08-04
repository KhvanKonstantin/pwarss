// Created by Konstantin Khvan on 7/23/18 2:43 PM

import {IObservableArray, observable, runInAction} from "mobx";
import {IdType, NewsEntry, NullEntry} from "../model/NewsEntry";
import api from "../api";


const ENTRIES_PER_REQUEST = 200;

export default class NewsStore {

    latestNews: IObservableArray<NewsEntry> = observable([]);

    async updateNews(): Promise<any> {
        try {
            let newsEntries = await api.entry.findAll(ENTRIES_PER_REQUEST);
            runInAction(() => {
                this.latestNews.replace(newsEntries);
            });
        } catch (e) {
            console.log(e)
        }
        return "refreshed";
    }

    entryById(newsEntryId: IdType): NewsEntry {
        const entry = this.latestNews.find(function (entry) {
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
            if (this.latestNews.length <= 0) {
                return
            }

            let maxId = this.latestNews[0].id;
            await api.entry.markAllRead(maxId);
            await this.updateNews();
        } catch (e) {
            console.log(e)
        }
    }
}

