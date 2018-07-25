// Created by Konstantin Khvan on 7/23/18 6:00 PM

// Created by Konstantin Khvan on 7/23/18 2:42 PM

import * as React from "react";
import {NewsEntry} from "../model/NewsEntry";
import {extractTextFromHtmlString} from "./util";
import {observer} from "mobx-react";

export interface SingleNewsEntryProps {
    entry: NewsEntry
    onMarkClicked: (id: number) => any
    onMarkUnreadClicked: (id: number) => any
}

@observer
class SingleNewsEntry extends React.Component<SingleNewsEntryProps> {
    render() {
        const {entry, onMarkClicked, onMarkUnreadClicked} = this.props;

        const {id, title, marked, read, link, content, date} = entry;

        const readCN = read ? "" : "unread";
        const markCN = !marked ? "notmarked" : "marked";

        const textContent = extractTextFromHtmlString(content);

        return <div className="news-entry">
            <div className="header">
                <div className={markCN} onClick={() => onMarkClicked(id)}>★</div>
                <a rel="noopener noreferrer" target="_blank" className="title" href={link}>{title}</a>
            </div>
            <div className={readCN} onClick={() => onMarkUnreadClicked(id)}>{!read ? "Mark unread" : "Mark read"}</div>
            <div className="date">{date}</div>
            <div className="content">{textContent}</div>
        </div>;
    }
}


export default SingleNewsEntry;