// Created by Konstantin Khvan on 7/23/18 2:40 PM

import * as React from "react";
import {NewsEntry} from "../model/NewsEntry";

export default class NewsEntryComponent extends React.Component<{ entry: NewsEntry }> {

    render() {
        const {title} = this.props.entry;
        return <div>{title}</div>;
    }
}


