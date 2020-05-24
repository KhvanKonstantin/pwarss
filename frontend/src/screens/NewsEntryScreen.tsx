// Created by Konstantin Khvan on 5/24/20, 1:15 AM

import React, {Fragment, useEffect, useRef} from 'react';
import {IdType, NewsEntry} from "../model/NewsEntry";
import {extractTextFromHtmlString} from "../forms/util";
import {observer} from "mobx-react";
import styled from "styled-components";
import {useStores} from "../hooks/stores";
import {useHistory, useParams} from "react-router-dom";
import {MenuItem} from "../forms/SideMenu";
import {AppBarWithMenu} from "../forms/AppBar";

const ScreenWrapper = styled.div`
    margin: 0;
    padding: 0;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100vh;    
`;

const Content = styled.div`
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

const TextContent = styled.div`
    font-size: 1.2em;
    
    padding: 5px;
    text-indent: 30px;
    text-align: justify;
    
    margin-top: 50px;
    
    overflow: auto;
    height: calc(100vh - 50px);
    
    &.hidden {
        display: none;
    }
`;


interface NewsEntryContentProps {
    entry: NewsEntry
    starEntry: (id: IdType, star: boolean) => void
}

const NewsEntryContent: React.FC<NewsEntryContentProps> = ({entry, starEntry}) => {
    const {id, title, starred, link, content, date} = entry;
    const starredCN = !starred ? "" : "starred";
    const textContent = extractTextFromHtmlString(content);

    return <Fragment>
        <Header>
            <div className={`star ${starredCN}`} onClick={() => starEntry(id, !starred)}>★</div>
            <a rel="noopener noreferrer" target="_blank" className="title" href={link}>{title}</a>
        </Header>
        <Date>{date}</Date>
        <TextContent>{textContent}</TextContent>
    </Fragment>
};

interface NewsIdParam {
    id: string | undefined
}

export const NewsEntryScreen: React.FC = observer(() => {
    const history = useHistory();
    const urlParams = useParams<NewsIdParam>();
    const id: IdType | null = urlParams.id || null;

    const {newsStore} = useStores();

    const entry = id ? newsStore.entryById(id) : null;

    const hideMenusRef = useRef<() => void>(() => 0);

    useEffect(() => {
        if (id) {
            newsStore.readEntry(id, true);
        }
    }, [newsStore, id]);

    const back = () => {
        hideMenusRef?.current();
        history.goBack();
    };

    const unreadEntry = () => {
        hideMenusRef?.current();
        if (id) {
            newsStore.readEntry(id, false);
        }
    };

    const starEntry = (id: IdType, star: boolean) => {
        newsStore.starEntry(id, star);
    };

    return (<ScreenWrapper>
            <AppBarWithMenu title="Title"
                            hideMenusRef={hideMenusRef}
                            rightMenu={<Fragment>
                                <div className="header">
                                    <MenuItem/>
                                </div>
                                <MenuItem handler={unreadEntry}>Mark unread</MenuItem>
                            </Fragment>}
                            onGoBack={back} showBack={true}/>

            <Content>
                {entry
                    ? <NewsEntryContent entry={entry} starEntry={starEntry}/>
                    : null}
            </Content>
        </ScreenWrapper>
    );
});
