// Created by Konstantin Khvan on 7/16/18 3:35 PM


import * as React from 'react';
import NewsEntryList from "./NewsList";
import SingleNewsEntry from "./SingleNewsEntry";
import {inject} from "mobx-react";
import NewsStore, {NEWS_FILTER} from "../stores/NewsStore";
import {IdType} from "../model/NewsEntry";
import {Confirm, ModalSpinner, withLoading} from "./util";
import {SmartNotification} from "./Notification";
import {UIStateStore} from "../stores/UIStateStore";
import {AppBar} from "./AppBar";
import {MenuItem, SideMenu} from "./SideMenu";
import AuthStore from "../stores/AuthStore";

export interface RootProps {
    newsStore?: NewsStore
    authStore?: AuthStore
    uiStateStore?: UIStateStore
    doLogout: () => Promise<any>
}

interface RootState {
    newsEntryId: IdType | null
    newsFilter: NEWS_FILTER
    showLeftMenu: boolean
    showRightMenu: boolean
    showConfirmReadAll: boolean
    loading: boolean
}

const hideAllMenus = {showLeftMenu: false, showRightMenu: false};
const hideAllConfirms = {showConfirmReadAll: false};


@inject("authStore", "newsStore", "uiStateStore")
export default class Main extends React.Component<RootProps, RootState> {
    state = {
        newsEntryId: null,
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

    private logout = () => {
        this.props.doLogout();
    };

    private back = () => {
        this.setState({...hideAllMenus, newsEntryId: null})
    };

    private toggleLeftMenu = () => {
        this.setState(prevState => ({...hideAllMenus, showLeftMenu: !prevState.showLeftMenu}));
    };

    private toggleRightMenu = () => {
        this.setState(prevState => ({...hideAllMenus, showRightMenu: !prevState.showRightMenu}));
    };

    private showUnread = () => {
        this.setState({...hideAllMenus, newsFilter: NEWS_FILTER.UNREAD});
    };

    private showAll = () => {
        this.setState({...hideAllMenus, newsFilter: NEWS_FILTER.ALL});
    };

    private showStarred = () => {
        this.setState({...hideAllMenus, newsFilter: NEWS_FILTER.STARRED});
    };

    private showNewsEntry = (id: IdType) => {
        const newsStore = this.props.newsStore!;
        newsStore.readEntry(id, true);
        this.setState({...hideAllMenus, newsEntryId: id});
    };

    private readEntry = (id: IdType, read: boolean) => {
        withLoading(this, async () => {
            const newsStore = this.props.newsStore!;
            this.doHideAllMenus();
            await newsStore.readEntry(id, read);
        });
    };

    private starEntry = (id: IdType, star: boolean) => {
        withLoading(this, async () => {
            const newsStore = this.props.newsStore!;
            await newsStore.starEntry(id, star);
        });
    };

    private confirmReadAll = () => {
        this.setState({showConfirmReadAll: true});
        this.doHideAllMenus();
    };

    private readAll = () => {
        withLoading(this, async () => {
            const newsStore = this.props.newsStore!;
            this.doHideAllConfirms();
            await newsStore.readAll();
        });
    };

    private doHideAllMenus = () => {
        this.setState(hideAllMenus);
    };

    private doHideAllConfirms = () => {
        this.doHideAllMenus();
        this.setState(hideAllConfirms);
    };


    render() {
        const {newsFilter, showLeftMenu, showRightMenu, showConfirmReadAll} = this.state;
        const newsStore = this.props.newsStore!;

        const newsEntryId: number | null = this.state.newsEntryId;

        const authStore = this.props.authStore!;
        const uiStateStore = this.props.uiStateStore!;

        const confirmModal = showConfirmReadAll
            ? <Confirm content="Mark all read?"
                       textOk="Mark read"
                       textCancel="Cancel"
                       onOk={this.readAll}
                       onCancel={this.doHideAllConfirms}/>
            : null;

        return (<div className="main-form">

                <AppBar leftMenuHandler={this.toggleLeftMenu}
                        rightMenuHandler={this.toggleRightMenu}
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

                <div className={`content ${newsEntryId != null ? 'hidden' : ''}`}>
                    <NewsEntryList newsFilter={newsFilter}
                                   onRefreshedClicked={this.updateAllNews}
                                   onStarClicked={this.starEntry}
                                   onTitleClicked={this.showNewsEntry}/>;
                </div>

                {newsEntryId != null
                && <div className="content">
                    <SingleNewsEntry entry={newsStore.entryById(newsEntryId)} onStarClicked={this.starEntry}/>;
                </div>}

                <SmartNotification store={uiStateStore}/>

                {confirmModal}

                {this.state.loading && <ModalSpinner/>}
            </div>
        );
    }
}


