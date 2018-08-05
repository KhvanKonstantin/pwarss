// Created by Konstantin Khvan on 7/23/18 6:00 PM

import * as React from "react";
import {IdType, NewsEntry} from "../model/NewsEntry";
import {extractTextFromHtmlString} from "./util";
import {observer} from "mobx-react";

export interface SingleNewsEntryProps {
    entry: NewsEntry
    onStarClicked: (id: IdType, star: boolean) => any
}

@observer
class SingleNewsEntry extends React.Component<SingleNewsEntryProps> {
    render() {
        const {entry, onStarClicked} = this.props;

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