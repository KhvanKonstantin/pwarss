// Created by Konstantin Khvan on 5/24/20, 1:15 AM

import * as React from "react";
import {Fragment, MouseEvent, useEffect, useRef, useState} from "react";
import {observer} from "mobx-react";
import {IdType, NewsEntry} from "../model/NewsEntry";
import styled from "styled-components";
import {NEWS_FILTER} from "../stores/NewsStore";
import {useHistory} from "react-router-dom";
import {useStores} from "../hooks/stores";
import {Confirm} from "../forms/Modal";
import {MenuItem} from "../forms/SideMenu";
import {AppBarWithMenu} from "../forms/AppBar";
import {SmartNotification} from "../forms/Notification";

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
    
    &.hidden {
        display: none;
    }
`;

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

export const NewsListScreen: React.FC = observer(() => {
    const [showConfirmReadAll, setShowConfirmReadAll] = useState(false);
    const history = useHistory();

    const {authStore, newsStore, uiStateStore} = useStores();

    const hideMenus = useRef<() => void>(() => 0);

    useEffect(() => {
        newsStore.refresh();
    }, [newsStore]);

    const doHideAllMenus = () => {
        hideMenus?.current();
        setShowConfirmReadAll(false);
    };

    const logout = () => {
        newsStore.reset();
        authStore.logout();
    }

    const changeFilter = (filter: NEWS_FILTER) => {
        doHideAllMenus();
        newsStore.update(filter);
    };

    const showUnread = () => changeFilter(NEWS_FILTER.UNREAD);
    const showAll = () => changeFilter(NEWS_FILTER.ALL);
    const showStarred = () => changeFilter(NEWS_FILTER.STARRED);

    const showNewsEntry = (id: IdType) => {
        doHideAllMenus();
        history.push(`/news/${id}`);
    };

    const confirmReadAll = () => {
        doHideAllMenus();
        setShowConfirmReadAll(true);
    };

    const readAll = () => {
        setShowConfirmReadAll(false);
        newsStore.readAll();
    };

    const confirmModal = showConfirmReadAll
        ? <Confirm content="Mark all read?"
                   textOk="Mark read"
                   textCancel="Cancel"
                   onOk={readAll}
                   onCancel={() => setShowConfirmReadAll(false)}/>
        : null;

    const leftMenu = <Fragment>
        <div className="header">
            <MenuItem>{authStore.currentUser!.login}</MenuItem>
        </div>
        <MenuItem handler={showUnread}>Unread</MenuItem>
        <MenuItem handler={showAll}>All entries</MenuItem>
        <MenuItem handler={showStarred}>Starred</MenuItem>
        <MenuItem handler={logout}>Logout</MenuItem>
    </Fragment>;

    const rightMenu = <Fragment>
        <div className="header">
            <MenuItem/>
        </div>
        <MenuItem handler={confirmReadAll}>Mark all read</MenuItem>
    </Fragment>;

    return (<ScreenWrapper>

            <AppBarWithMenu title="Title"
                            hideMenusRef={hideMenus}
                            leftMenu={leftMenu} rightMenu={rightMenu}
                            showBack={false}/>

            <Content>
                <NewsEntryList entries={newsStore.entries()}
                               onRefreshedClicked={newsStore.refresh}
                               onStarClicked={newsStore.starEntry}
                               onTitleClicked={showNewsEntry}/>
            </Content>

            <SmartNotification store={uiStateStore}/>

            {confirmModal}
        </ScreenWrapper>
    );
});



