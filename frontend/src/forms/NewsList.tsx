// Created by Konstantin Khvan on 7/23/18 2:42 PM

import * as React from "react";
import {inject, observer} from "mobx-react";
import NewsStore from "../stores/NewsStore";

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
        const latestNewsHtml = latestNews.map((n) => <div>{n.title}</div>);

        return <div>{latestNewsHtml}</div>
    }
}


