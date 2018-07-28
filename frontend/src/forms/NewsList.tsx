// Created by Konstantin Khvan on 7/23/18 2:42 PM

import * as React from "react";
import {MouseEvent} from "react";
import {inject, observer} from "mobx-react";
import NewsStore from "../stores/NewsStore";
import {NewsEntry} from "../model/NewsEntry";


function newsEntry(entry: NewsEntry) {
    const {id, title, marked, read} = entry;
    const readCN = read ? "" : "unread";
    const markCN = !marked ? "notmarked" : "marked";

    return <li key={id}>
        <div className={`mark ${markCN}`} data-mark={id}>★</div>
        <div className={`title ${readCN}`} data-title={id}>{title}</div>
    </li>;
}

export interface NewsEntryListProps {
    newsStore?: NewsStore
    onMarkClicked: (id: number) => any
    onTitleClicked: (id: number) => any
}

@inject("newsStore")
@observer
export default class NewsEntryList extends React.Component<NewsEntryListProps> {
    componentDidMount() {
        const newsStore = this.props.newsStore!;
        newsStore.updateNews();
    }

    private onClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        const mark = target.dataset.mark;
        if (mark) {
            this.props.onMarkClicked(parseInt(mark, 10));
            return
        }

        const title = target.dataset.title;
        if (title) {
            this.props.onTitleClicked(parseInt(title, 10));
            return
        }
    };


    render() {
        const newsStore = this.props.newsStore!;
        const latestNews = newsStore.latestNews;
        return <div className="news-list">
            <ul onClick={this.onClick}>
                {latestNews.map(newsEntry)}
            </ul>
            <div className="refresh">
                <div>↻</div>
            </div>
        </div>
    }
}


