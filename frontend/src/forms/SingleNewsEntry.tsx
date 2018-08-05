// Created by Konstantin Khvan on 7/23/18 6:00 PM

import * as React from "react";
import {IdType, NewsEntry} from "../model/NewsEntry";
import {extractTextFromHtmlString} from "./util";
import {inject, observer} from "mobx-react";
import NewsStore from "../stores/NewsStore";

export interface SingleNewsEntryProps {
    newsStore?: NewsStore
    entry: NewsEntry
    onStarClicked: (id: IdType, star: boolean) => any
}

@inject("newsStore")
@observer
class SingleNewsEntry extends React.Component<SingleNewsEntryProps> {
    render() {
        const {entry: entryFromProps, onStarClicked} = this.props;

        // entries are replaced as array elements so observe whole array to receive updates
        const newsStore = this.props.newsStore!;
        const entry = newsStore.entryById(entryFromProps.id);

        const {id, title, starred, link, content, date} = entry;

        const starredCN = !starred ? "" : "starred";

        const textContent = extractTextFromHtmlString(content);

        return <div className="news-entry">
            <div className="header">
                <div className={`star ${starredCN}`} onClick={() => onStarClicked(id, !starred)}>★</div>
                <a rel="noopener noreferrer" target="_blank" className="title" href={link}>{title}</a>
            </div>
            <div className="date">{date}</div>
            <div className="content">{textContent}</div>
        </div>;
    }
}


export default SingleNewsEntry;