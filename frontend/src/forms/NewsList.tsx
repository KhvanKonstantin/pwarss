// Created by Konstantin Khvan on 7/23/18 2:42 PM

import * as React from "react";
import {MouseEvent} from "react";
import {inject, observer} from "mobx-react";
import NewsStore, {NEWS_FILTER} from "../stores/NewsStore";
import {IdType, NewsEntry} from "../model/NewsEntry";


function newsEntry(entry: NewsEntry) {
    const {id, title, starred, read} = entry;
    const readCN = read ? "" : "unread";
    const starCN = !starred ? "" : "starred";

    return <li key={id}>
        <div className={`star ${starCN}`} data-star-id={id} data-star={starCN}>★</div>
        <div className={`title ${readCN}`} data-id={id}>{title}</div>
    </li>;
}

export interface NewsEntryListProps {
    newsStore?: NewsStore
    newsFilter: NEWS_FILTER
    onStarClicked: (id: IdType, star: boolean) => any
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

        const starId = target.dataset.starId;
        if (starId) {
            this.props.onStarClicked(starId, !(target.dataset.starred == "starred"));
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


