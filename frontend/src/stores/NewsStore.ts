// Created by Konstantin Khvan on 7/23/18 2:43 PM

import {IObservableArray, observable, runInAction} from "mobx";
import {NewsEntry} from "../model/NewsEntry";
import api from "../api";

export default class NewsStore {

    latestNews: IObservableArray<NewsEntry> = observable([]);

    async updateNews(): Promise<any> {
        try {
            let newsEntries = await api.entry.findAll(20);
            runInAction(() => {
                this.latestNews.replace(newsEntries);
            });
        } catch (e) {
            console.log(e)
        }
        return "refreshed";
    }
}

