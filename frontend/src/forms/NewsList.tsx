// Created by Konstantin Khvan on 7/23/18 2:42 PM

import * as React from "react";
import {MouseEvent} from "react";
import {observer} from "mobx-react";
import {IdType, NewsEntry} from "../model/NewsEntry";
import styled from "styled-components";

const Wrapper = styled.div`
    user-select: none;
    
    &.empty {
        display: flex;
        justify-content: center;

        margin-top: 2em;
    }
`;

const EntryList = styled.div`
    list-style: none;
    margin: 0;
    padding: 0;
`;

const NoData = styled.div`    
`;

const Refresh = styled.div`        
        position: fixed;
        right: 1em;
        bottom: 2em;

        div {
            background: orangered;
            color: white;
            font-weight: bold;

            box-shadow: 0 5px 15px rgba(0, 0, 0, .3);

            user-select: none;

            display: table-cell;
            width: 2em;
            height: 2em;
            border-radius: 1em;
            text-align: center;
            vertical-align: middle;
        }
`;


const Entry = styled.div`
    display: flex;
    align-items: center;
    padding: 2px;
    // height: 32px;
    border-bottom: 1px solid lightgrey;
    
    
    &:hover {
        background: lightyellow;
    }
`;

const EntryStar = styled.div`
    font-weight: bold;
    font-size: 25px;
    
    margin-left: 5px;
    margin-right: 7px;
    
    color: lightgrey;
    
    &.starred {
        color: gold;
    }
`;

const EntryHeader = styled.div`
    &.unread {
        font-weight: bold;
    }
`;

function newsEntry(entry: NewsEntry) {
    const {id, title, starred, read} = entry;
    const readCN = read ? "" : "unread";
    const starCN = !starred ? "" : "starred";

    return <Entry key={id}>
        <EntryStar className={starCN} data-star-id={id} data-star={starCN}>★</EntryStar>
        <EntryHeader className={readCN} data-id={id}>{title}</EntryHeader>
    </Entry>;
}

export interface NewsEntryListProps {
    entries: NewsEntry[]
    onStarClicked: (id: IdType, star: boolean) => any
    onTitleClicked: (id: IdType) => any
    onRefreshedClicked: () => any
}

@observer
export default class NewsEntryList extends React.Component<NewsEntryListProps> {

    private onClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        const starId = target.dataset.starId;
        if (starId) {
            this.props.onStarClicked(starId, !(target.dataset.star === "starred"));
            return
        }

        const id = target.dataset.id;
        if (id) {
            this.props.onTitleClicked(id);
            return
        }
    };


    render() {
        const entries = this.props.entries.map(newsEntry);
        const empty = entries.length === 0;

        return <Wrapper className={empty ? "empty" : ""}>
            <EntryList onClick={this.onClick}>
                {empty ? <NoData>No entries</NoData> : entries}
            </EntryList>
            <Refresh onClick={this.props.onRefreshedClicked}>
                <div>↻</div>
            </Refresh>
        </Wrapper>
    }
}


