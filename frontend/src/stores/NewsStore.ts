// Created by Konstantin Khvan on 7/23/18 2:43 PM

import {IObservableArray, observable, runInAction} from "mobx";
import {NewsEntry, NullEntry} from "../model/NewsEntry";
import api from "../api";

export default class NewsStore {

    latestNews: IObservableArray<NewsEntry> = observable([]);

    async updateNews(): Promise<any> {
        try {
            let newsEntries = await api.entry.findAll(200);
            runInAction(() => {
                this.latestNews.replace(newsEntries);
            });
        } catch (e) {
            console.log(e)
        }
        return "refreshed";
    }

    entryById(newsEntryId: number): NewsEntry {
        const entry = this.latestNews.find(function (entry) {
            return newsEntryId === entry.id
        });

        return entry ? entry : NullEntry;
    }

    async toggleEntryMark(id: number) {
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

    async markEntryRead(id: number, read: boolean) {
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
}

