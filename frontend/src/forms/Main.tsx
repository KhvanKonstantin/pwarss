// Created by Konstantin Khvan on 7/16/18 3:35 PM


import * as React from 'react';
import NewsEntryList from "./NewsList";
import SingleNewsEntry from "./SingleNewsEntry";
import {inject} from "mobx-react/custom";
import NewsStore from "../stores/NewsStore";
import {IdType} from "../model/NewsEntry";

export interface RootProps {
    newsStore?: NewsStore
    doLogout: () => Promise<any>
}

interface RootState {
    newsEntryId: IdType | null;
    showLeftMenu: boolean;
    showRightMenu: boolean;
}

const hideAllMenus = {showLeftMenu: false, showRightMenu: false};

@inject("newsStore")
export default class Main extends React.Component<RootProps, RootState> {
    state = {
        newsEntryId: null,
        showLeftMenu: false,
        showRightMenu: false
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

    private showNewsEntry = (id: IdType) => {
        const newsStore = this.props.newsStore!;
        newsStore.markEntryRead(id, true);
        this.setState({...hideAllMenus, newsEntryId: id});
    };

    private markEntryRead = (id: IdType, read: boolean) => {
        const newsStore = this.props.newsStore!;
        newsStore.markEntryRead(id, read);
        this.doHideAllMenus();
    };

    private markEntry = (id: IdType) => {
        const newsStore = this.props.newsStore!;
        newsStore.toggleEntryMark(id);
    };

    private markAllRead = () => {
        const newsStore = this.props.newsStore!;
        newsStore.markAllRead();
        this.doHideAllMenus();
    };

    private doHideAllMenus = () => {
        this.setState(hideAllMenus);
    };

    render() {
        let content = null;
        let rightMenu = null;

        const newsEntryId: number | null = this.state.newsEntryId;
        const showEntry = newsEntryId != null;

        if (newsEntryId != null) {
            const newsStore = this.props.newsStore!;
            content = <SingleNewsEntry entry={newsStore.entryById(newsEntryId)}
                                       onMarkClicked={this.markEntry}/>;
            rightMenu = <div className="menu-item"
                             onClick={() => this.markEntryRead(newsEntryId, false)}>Mark unread</div>
        } else {
            content = <NewsEntryList onMarkClicked={this.markEntry} onTitleClicked={this.showNewsEntry}/>;
            rightMenu = <div className="menu-item" onClick={this.markAllRead}>Mark all read</div>
        }

        const {showLeftMenu, showRightMenu} = this.state;

        const topLeftButton = showEntry
            ? <div className="item" onClick={this.back}><b>←</b></div>
            : <div className="item">
                <div onClick={this.toggleLeftMenu}>☰</div>
                <div className={`menu ${showLeftMenu ? "active" : ""}`}>
                    <div className="menu-item">Unread</div>
                    <div className="menu-item">All entries</div>
                    <div className="menu-item">Marked</div>
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


