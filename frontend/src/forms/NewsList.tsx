// Created by Konstantin Khvan on 7/23/18 2:42 PM

import * as React from "react";
import {inject, observer} from "mobx-react";
import NewsStore from "../stores/NewsStore";
import {NewsEntry} from "../model/NewsEntry";


function newsEntry(entry: NewsEntry) {
    const {id, title, marked, read} = entry;
    const readCN = read ? "" : "unread";
    const markCN = !marked ? "notmarked" : "marked";

    return <li key={id}>
        <div className={markCN}>*</div>
        <div className={`title ${readCN}`}>{title}</div>
    </li>;
}

@inject("newsStore")
@observer
export default class NewsEntryList extends React.Component<{ newsStore?: NewsStore }> {
    componentDidMount() {
        const newsStore = this.props.newsStore!;
        newsStore.updateNews();
    }

    render() {
        const newsStore = this.props.newsStore!;
        const latestNews = newsStore.latestNews;
        return <ul className="news-list">{latestNews.map(newsEntry)}</ul>
    }
}


