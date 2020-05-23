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

        margin-top: 50px;
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
        right: 15px;
        bottom: 15px;
        
        display: flex;

        div {
            background: orangered;
            color: white;
            font-weight: bold;
            font-size: 30px;

            box-shadow: 0 5px 15px rgba(0, 0, 0, .3);

            user-select: none;

            width: 50px;
            height: 50px;
            border-radius: 25px;

            text-align: center;
            line-height: 50px;
        }
`;


const Entry = styled.div`
    display: flex;
    align-items: center;
    padding: 2px;
    height: 60px;
    border-bottom: 1px solid lightgrey;
    overflow: hidden;
    
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
    font-size: 1.2em;
    
    height: 60px;
    margin-top: 5px;
    
    overflow: hidden;

    &.unread {
        font-weight: bold;
    }
`;

function NewsEntryBlock({entry}: { entry: NewsEntry }) {
    const {id, title, starred, read} = entry;
    const readCN = read ? "" : "unread";
    const starCN = !starred ? "" : "starred";

    return <Entry>
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


export const NewsEntryList: React.FC<NewsEntryListProps> = observer((props) => {
    const onClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        const starId = target.dataset.starId;
        if (starId) {
            props.onStarClicked(starId, !(target.dataset.star === "starred"));
            return
        }

        const id = target.dataset.id;
        if (id) {
            props.onTitleClicked(id);
            return
        }
    };

    const entries = props.entries.map(e => (<NewsEntryBlock key={e.id} entry={e}/>));
    const empty = entries.length === 0;

    return <Wrapper className={empty ? "empty" : ""}>
        <EntryList onClick={onClick}>
            {empty ? <NoData>No entries</NoData> : entries}
        </EntryList>
        <Refresh onClick={props.onRefreshedClicked}>
            <div>↻</div>
        </Refresh>
    </Wrapper>
});
