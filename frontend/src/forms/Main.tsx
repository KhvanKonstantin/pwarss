// Created by Konstantin Khvan on 7/16/18 3:35 PM


import React, {useEffect, useState} from 'react';
import {NewsEntryList} from "./NewsList";
import SingleNewsEntry from "./SingleNewsEntry";
import {NEWS_FILTER} from "../stores/NewsStore";
import {IdType} from "../model/NewsEntry";
import {Confirm, ModalSpinner} from "./Modal";
import {SmartNotification} from "./Notification";
import {AppBar} from "./AppBar";
import {MenuItem, SideMenu} from "./SideMenu";
import styled from "styled-components";
import {useStores} from "../hooks/stores";
import {observer} from "mobx-react";


const Wrapper = styled.div`
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

export const Main: React.FC = observer(() => {
    const [, setNewsFilter] = useState<NEWS_FILTER>(NEWS_FILTER.ALL);
    const [showLeftMenu, setShowLeftMenu] = useState(false);
    const [showRightMenu, setShowRightMenu] = useState(false);
    const [showConfirmReadAll, setShowConfirmReadAll] = useState(false);
    const [loading] = useState(false);

    const {authStore, newsStore, uiStateStore} = useStores();

    useEffect(() => {
        newsStore.refresh();
    }, [newsStore]);

    const doHideAllMenus = () => {
        setShowLeftMenu(false);
        setShowRightMenu(false);
        setShowConfirmReadAll(false);
    };

    const doHideAllConfirms = () => setShowConfirmReadAll(false);

    const logout = () => {
        newsStore.reset();
        authStore.logout();
    }

    const back = () => uiStateStore.showNewsList();
    const _showLeftMenu = () => {
        doHideAllMenus();
        setShowLeftMenu(true);
    };

    const _showRightMenu = () => {
        doHideAllMenus();
        setShowRightMenu(true);
    };

    const changeFilter = (filter: NEWS_FILTER) => {
        doHideAllMenus();
        setNewsFilter(filter)
        newsStore.update(filter);
    };

    const showUnread = () => changeFilter(NEWS_FILTER.UNREAD);
    const showAll = () => changeFilter(NEWS_FILTER.ALL);
    const showStarred = () => changeFilter(NEWS_FILTER.STARRED);

    const showNewsEntry = (id: IdType) => {
        readEntry(id, true);
        uiStateStore.showNewsEntry(id);
    };

    const readEntry = async (id: IdType, read: boolean) => {
        doHideAllMenus();
        await newsStore.readEntry(id, read);
    };

    const starEntry = async (id: IdType, star: boolean) => {
        await newsStore.starEntry(id, star);
    };

    const confirmReadAll = () => {
        doHideAllMenus();
        setShowConfirmReadAll(true);
    };

    const readAll = async () => {
        doHideAllConfirms();
        await newsStore.readAll();
    };

    const entries = newsStore.entries();

    const newsEntryId: IdType | null = uiStateStore.newsEntryId;

    const confirmModal = showConfirmReadAll
        ? <Confirm content="Mark all read?"
                   textOk="Mark read"
                   textCancel="Cancel"
                   onOk={readAll}
                   onCancel={doHideAllConfirms}/>
        : null;

    return (<Wrapper>

            <AppBar leftMenuHandler={_showLeftMenu}
                    rightMenuHandler={_showRightMenu}
                    backMenuHandler={back}
                    title="Title"
                    showBack={newsEntryId != null}/>

            <SideMenu visible={showLeftMenu} rightSide={false} hideMenu={doHideAllMenus}>
                <div className="header">
                    <MenuItem>{authStore.currentUser!.login}</MenuItem>
                </div>
                <MenuItem handler={showUnread}>Unread</MenuItem>
                <MenuItem handler={showAll}>All entries</MenuItem>
                <MenuItem handler={showStarred}>Starred</MenuItem>
                <MenuItem handler={logout}>Logout</MenuItem>
            </SideMenu>

            <SideMenu visible={showRightMenu} rightSide={true} hideMenu={doHideAllMenus}>
                <div className="header">
                    <MenuItem/>
                </div>
                {newsEntryId != null
                    ? <MenuItem handler={() => readEntry(newsEntryId!, false)}>Mark unread</MenuItem>
                    : <MenuItem handler={confirmReadAll}>Mark all read</MenuItem>}
            </SideMenu>

            <Content className={newsEntryId != null ? 'hidden' : ''}>
                <NewsEntryList entries={entries}
                               onRefreshedClicked={newsStore.refresh}
                               onStarClicked={starEntry}
                               onTitleClicked={showNewsEntry}/>
            </Content>

            {newsEntryId != null
            && <div className="content">
                <SingleNewsEntry entry={newsStore.entryById(newsEntryId)} onStarClicked={starEntry}/>;
            </div>}

            <SmartNotification store={uiStateStore}/>

            {confirmModal}

            {loading && <ModalSpinner/>}
        </Wrapper>
    );
});
