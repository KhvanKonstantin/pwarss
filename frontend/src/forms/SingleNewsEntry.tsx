// Created by Konstantin Khvan on 7/23/18 6:00 PM

import React from 'react';
import {IdType, NewsEntry} from "../model/NewsEntry";
import {extractTextFromHtmlString} from "./util";
import {observer} from "mobx-react";
import styled from "styled-components";
import {useStores} from "../hooks/stores";

const Wrapper = styled.div`
    margin-top: 50px;
    
    overflow: auto;
    height: calc(100vh - 50px);
    
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
    
    font-size: 1.5em;
    
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
    font-size: 1.2em;
    
    padding: 5px;
    text-indent: 30px;
    text-align: justify;
`;


export interface SingleNewsEntryProps {
    entry: NewsEntry
    onStarClicked: (id: IdType, star: boolean) => any
}

const SingleNewsEntry: React.FC<SingleNewsEntryProps> = observer((props) => {
    const {entry: entryFromProps, onStarClicked} = props;

    // entries are replaced as array elements so observe whole array to receive updates
    const {newsStore} = useStores();

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
});


export default SingleNewsEntry;
