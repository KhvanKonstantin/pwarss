// Created by Konstantin Khvan on 7/16/18 3:35 PM


import * as React from 'react';
import NewsEntryList from "./NewsList";
import SingleNewsEntry from "./SingleNewsEntry";
import {inject, observer} from "mobx-react";
import NewsStore, {NEWS_FILTER} from "../stores/NewsStore";
import {IdType} from "../model/NewsEntry";
import {withLoading} from "./util";
import {Confirm, ModalSpinner} from "./Modal";
import {SmartNotification} from "./Notification";
import {UIStateStore} from "../stores/UIStateStore";
import {AppBar} from "./AppBar";
import {MenuItem, SideMenu} from "./SideMenu";
import AuthStore from "../stores/AuthStore";
import styled from "styled-components";


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
    margin-top: 2em;
    
    overflow: auto;
    height: calc(100vh - 2em);
    
    &.hidden {
        display: none;
    }
`;

export interface RootProps {
    newsStore?: NewsStore
    authStore?: AuthStore
    uiStateStore?: UIStateStore
}

interface RootState {
    newsFilter: NEWS_FILTER
    showLeftMenu: boolean
    showRightMenu: boolean
    showConfirmReadAll: boolean
    loading: boolean
}

const hideAllMenus = {showLeftMenu: false, showRightMenu: false};
const hideAllConfirms = {showConfirmReadAll: false};

@inject("authStore", "newsStore", "uiStateStore")
@observer
export default class Main extends React.Component<RootProps, RootState> {
    state = {
        newsFilter: NEWS_FILTER.ALL,
        showLeftMenu: false,
        showRightMenu: false,
        showConfirmReadAll: false,
        loading: false
    };

    componentDidMount() {
        this.updateAllNews();
    }

    private updateAllNews = () => {
        withLoading(this, async () => {
            const newsStore = this.props.newsStore!;
            await newsStore.updateNews();
        });
    };

    private doHideAllMenus = () => this.setState(hideAllMenus);
    private doHideAllConfirms = () => this.setState({...hideAllMenus, ...hideAllConfirms});


    private logout = () => this.props.authStore!.logout();
    private back = () => this.props.uiStateStore!.showNewsList();
    private showLeftMenu = () => this.setState({...hideAllMenus, showLeftMenu: true});
    private showRightMenu = () => this.setState({...hideAllMenus, showRightMenu: true});
    private showUnread = () => this.setState({...hideAllMenus, newsFilter: NEWS_FILTER.UNREAD});
    private showAll = () => this.setState({...hideAllMenus, newsFilter: NEWS_FILTER.ALL});
    private showStarred = () => this.setState({...hideAllMenus, newsFilter: NEWS_FILTER.STARRED});

    private showNewsEntry = (id: IdType) => {
        this.props.newsStore!.readEntry(id, true);
        this.props.uiStateStore!.showNewsEntry(id);
        this.doHideAllMenus();
    };

    private readEntry = (id: IdType, read: boolean) => {
        withLoading(this, async () => {
            this.doHideAllMenus();
            await this.props.newsStore!.readEntry(id, read);
        });
    };

    private starEntry = (id: IdType, star: boolean) => {
        withLoading(this, async () => {
            await this.props.newsStore!.starEntry(id, star);
        });
    };

    private confirmReadAll = () => {
        this.setState({showConfirmReadAll: true});
        this.doHideAllMenus();
    };

    private readAll = () => {
        withLoading(this, async () => {
            this.doHideAllConfirms();
            await this.props.newsStore!.readAll();
        });
    };


    render() {
        const {newsFilter, showLeftMenu, showRightMenu, showConfirmReadAll} = this.state;
        const newsStore = this.props.newsStore!;

        const newsEntryId: IdType | null = this.props.uiStateStore!.newsEntryId;

        const authStore = this.props.authStore!;
        const uiStateStore = this.props.uiStateStore!;

        const confirmModal = showConfirmReadAll
            ? <Confirm content="Mark all read?"
                       textOk="Mark read"
                       textCancel="Cancel"
                       onOk={this.readAll}
                       onCancel={this.doHideAllConfirms}/>
            : null;

        return (<Wrapper>

                <AppBar leftMenuHandler={this.showLeftMenu}
                        rightMenuHandler={this.showRightMenu}
                        backMenuHandler={this.back}
                        title="Title"
                        showBack={newsEntryId != null}/>

                <SideMenu visible={showLeftMenu} rightSide={false} hideMenu={this.doHideAllMenus}>
                    <div className="header">
                        <MenuItem>{authStore.currentUser!.login}</MenuItem>
                    </div>
                    <MenuItem handler={this.showUnread}>Unread</MenuItem>
                    <MenuItem handler={this.showAll}>All entries</MenuItem>
                    <MenuItem handler={this.showStarred}>Starred</MenuItem>
                    <MenuItem handler={this.logout}>Logout</MenuItem>
                </SideMenu>

                <SideMenu visible={showRightMenu} rightSide={true} hideMenu={this.doHideAllMenus}>
                    <div className="header">
                        <MenuItem/>
                    </div>
                    {newsEntryId != null
                        ? <MenuItem handler={() => this.readEntry(newsEntryId, false)}>Mark unread</MenuItem>
                        : <MenuItem handler={this.confirmReadAll}>Mark all read</MenuItem>}
                </SideMenu>

                <Content className={newsEntryId != null ? 'hidden' : ''}>
                    <NewsEntryList newsFilter={newsFilter}
                                   onRefreshedClicked={this.updateAllNews}
                                   onStarClicked={this.starEntry}
                                   onTitleClicked={this.showNewsEntry}/>
                </Content>

                {newsEntryId != null
                && <div className="content">
                    <SingleNewsEntry entry={newsStore.entryById(newsEntryId)} onStarClicked={this.starEntry}/>;
                </div>}

                <SmartNotification store={uiStateStore}/>

                {confirmModal}

                {this.state.loading && <ModalSpinner/>}
            </Wrapper>
        );
    }
}


