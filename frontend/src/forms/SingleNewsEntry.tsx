// Created by Konstantin Khvan on 7/23/18 6:00 PM

import * as React from "react";
import {IdType, NewsEntry} from "../model/NewsEntry";
import {extractTextFromHtmlString} from "./util";
import {inject, observer} from "mobx-react";
import NewsStore from "../stores/NewsStore";
import styled from "styled-components";

const Wrapper = styled.div`
    margin-top: 2em;
    
    overflow: auto;
    height: calc(100vh - 2em);
    
    padding: 5px;
    
    .star {
        user-select: none;
        
        color: lightgrey;
        
        margin: auto;
        font-size: 1.3em;
        
        &.starred {
            color: gold;
        }
    }
`;

const Header = styled.div`
    display: flex;
    
    a {
        padding: 5px;
        text-indent: 30px;
        text-align: justify;
    
        text-decoration: none;
    }
`;

const Date = styled.div`
    padding: 5px;
`;

const Content = styled.div`
    padding: 5px;
    text-indent: 30px;
    text-align: justify;
`;


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

        return <Wrapper>
            <Header>
                <div className={`star ${starredCN}`} onClick={() => onStarClicked(id, !starred)}>★</div>
                <a rel="noopener noreferrer" target="_blank" className="title" href={link}>{title}</a>
            </Header>
            <Date>{date}</Date>
            <Content>{textContent}</Content>
        </Wrapper>;
    }
}


export default SingleNewsEntry;
