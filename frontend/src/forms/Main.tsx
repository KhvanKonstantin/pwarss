// Created by Konstantin Khvan on 7/16/18 3:35 PM


import * as React from 'react';
import NewsEntryList from "./NewsList";
import SingleNewsEntry from "./SingleNewsEntry";
import {inject} from "mobx-react/custom";
import NewsStore from "../stores/NewsStore";

export interface RootProps {
    newsStore?: NewsStore
    doLogout: () => Promise<any>
}

interface RootState {
    newsEntryId: number | null;
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

    private showNewsEntry = (id: number) => {
        const newsStore = this.props.newsStore!;
        newsStore.markEntryRead(id, true);
        this.setState({...hideAllMenus, newsEntryId: id});
    };

    // @ts-ignore
    private markEntryRead = (id: number, read: boolean) => {
        const newsStore = this.props.newsStore!;
        newsStore.markEntryRead(id, read);
    };

    private markEntry = (id: number) => {
        const newsStore = this.props.newsStore!;
        newsStore.toggleEntryMark(id);
    };

    private doHideAllMenus = () => {
        console.log("on down");
        this.setState(hideAllMenus);
    };

    render() {
        let content = null;
        const newsEntryId: number | null = this.state.newsEntryId;
        const showEntry = newsEntryId != null;

        if (newsEntryId != null) {
            const newsStore = this.props.newsStore!;
            content = <SingleNewsEntry entry={newsStore.entryById(newsEntryId)}
                                       onMarkClicked={this.markEntry}/>
        } else {
            content = <NewsEntryList onMarkClicked={this.markEntry} onTitleClicked={this.showNewsEntry}/>;
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
                            {!showEntry && <div className="menu-item">Mark all read</div>}
                            {showEntry && <div className="menu-item">Mark unread</div>}
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


