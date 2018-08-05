// Created by Konstantin Khvan on 7/16/18 3:35 PM


import * as React from 'react';
import {ReactNode} from 'react';
import NewsEntryList from "./NewsList";
import SingleNewsEntry from "./SingleNewsEntry";
import {inject} from "mobx-react/custom";
import NewsStore, {NEWS_FILTER} from "../stores/NewsStore";
import {IdType} from "../model/NewsEntry";
import {Confirm} from "./util";

export interface RootProps {
    newsStore?: NewsStore
    doLogout: () => Promise<any>
}

interface RootState {
    newsEntryId: IdType | null
    newsFilter: NEWS_FILTER
    showLeftMenu: boolean
    showRightMenu: boolean
    showConfirmReadAll: boolean
}

const hideAllMenus = {showLeftMenu: false, showRightMenu: false};
const hideAllConfirms = {showConfirmReadAll: false};

@inject("newsStore")
export default class Main extends React.Component<RootProps, RootState> {
    state = {
        newsEntryId: null,
        newsFilter: NEWS_FILTER.UNREAD,
        showLeftMenu: false,
        showRightMenu: false,
        showConfirmReadAll: false
    };

    componentDidMount() {
        const newsStore = this.props.newsStore!;
        newsStore.updateNews();
    }

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
        const newsStore = this.props.newsStore!;
        newsStore.readEntry(id, read);
        this.doHideAllMenus();
    };

    private starEntry = (id: IdType, star: boolean) => {
        const newsStore = this.props.newsStore!;
        newsStore.starEntry(id, star);
    };

    private confirmReadAll = () => {
        this.setState({showConfirmReadAll: true});
        this.doHideAllMenus();
    };

    private readAll = () => {
        const newsStore = this.props.newsStore!;
        newsStore.readAll();
        this.doHideAllConfirms();
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

        let content: ReactNode | null = null;
        let rightMenu: ReactNode | null = null;

        const newsEntryId: number | null = this.state.newsEntryId;
        const showEntry = newsEntryId != null;

        if (newsEntryId != null) {
            const newsStore = this.props.newsStore!;
            content = <SingleNewsEntry entry={newsStore.entryById(newsEntryId)}
                                       onStarClicked={this.starEntry}/>;
            rightMenu = <div className="menu-item"
                             onClick={() => this.readEntry(newsEntryId, false)}>Mark unread</div>
        } else {
            content = <NewsEntryList newsFilter={newsFilter}
                                     onStarClicked={this.starEntry} onTitleClicked={this.showNewsEntry}/>;
            rightMenu = <div className="menu-item" onClick={this.confirmReadAll}>Mark all read</div>
        }

        let confirmModal: ReactNode | null = null;

        if (showConfirmReadAll) {
            confirmModal = <Confirm content="Mark all read?"
                                    textOk="Mark read"
                                    textCancel="Cancel"
                                    onOk={this.readAll}
                                    onCancel={this.doHideAllConfirms}/>
        }

        const topLeftButton = showEntry
            ? <div className="item" onClick={this.back}><b>←</b></div>
            : <div className="item">
                <div onClick={this.toggleLeftMenu}>☰</div>
                <div className={`menu ${showLeftMenu ? "active" : ""}`}>
                    <div className="menu-item" onClick={this.showUnread}>Unread</div>
                    <div className="menu-item" onClick={this.showAll}>All entries</div>
                    <div className="menu-item" onClick={this.showStarred}>Starred</div>
                    <div className="menu-item" onClick={this.logout}>Logout</div>
                </div>
            </div>;

        return (<div className="main-form">
                <div className="header">
                    {topLeftButton}
                    <div className="item title"/>
                    <div className="item">
                        <div onClick={this.toggleRightMenu}>⋮</div>
                        <div className={`menu right ${showRightMenu ? "active" : ""}`}>
                            {rightMenu}
                            {confirmModal}
                        </div>
                    </div>
                </div>
                <div className="content" onMouseDown={this.doHideAllMenus} onTouchStart={this.doHideAllMenus}>
                    {content}
                </div>
            </div>
        );
    }
}


