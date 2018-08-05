// Created by Konstantin Khvan on 7/23/18 2:42 PM

import * as React from "react";
import {MouseEvent} from "react";
import {inject, observer} from "mobx-react";
import NewsStore, {NEWS_FILTER} from "../stores/NewsStore";
import {IdType, NewsEntry} from "../model/NewsEntry";


function newsEntry(entry: NewsEntry) {
    const {id, title, marked, read} = entry;
    const readCN = read ? "" : "unread";
    const markCN = !marked ? "notmarked" : "marked";

    return <li key={id}>
        <div className={`mark ${markCN}`} data-mark={id}>★</div>
        <div className={`title ${readCN}`} data-id={id}>{title}</div>
    </li>;
}

export interface NewsEntryListProps {
    newsStore?: NewsStore
    newsFilter: NEWS_FILTER
    onMarkClicked: (id: IdType) => any
    onTitleClicked: (id: IdType) => any
}

@inject("newsStore")
@observer
export default class NewsEntryList extends React.Component<NewsEntryListProps> {
    private updateNews = () => {
        const newsStore = this.props.newsStore!;
        newsStore.updateNews();
    };

    private onClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        const mark = target.dataset.mark;
        if (mark) {
            this.props.onMarkClicked(mark);
            return
        }

        const id = target.dataset.id;
        if (id) {
            this.props.onTitleClicked(id);
            return
        }
    };


    render() {
        const newsStore = this.props.newsStore!;
        const latestNews = newsStore.newsToShow(this.props.newsFilter);
        return <div className="news-list">
            <ul onClick={this.onClick}>
                {latestNews.map(newsEntry)}
            </ul>
            <div className="refresh" onClick={this.updateNews}>
                <div>↻</div>
            </div>
        </div>
    }
}


