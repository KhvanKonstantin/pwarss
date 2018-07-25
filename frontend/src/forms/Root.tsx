// Created by Konstantin Khvan on 7/16/18 3:35 PM


import * as React from 'react';
import {FormEvent} from 'react';
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
}

@inject("newsStore")
export default class Root extends React.Component<RootProps, RootState> {
    state = {
        newsEntryId: null
    };

    private logout = (e: FormEvent) => {
        e.preventDefault();
        this.props.doLogout();
    };

    private back = (e: FormEvent) => {
        e.preventDefault();
        this.setState({newsEntryId: null})
    };

    private onTitleClicked = (id: number) => {
        console.log(`Title clicked ${id}`);
        const newsStore = this.props.newsStore!;
        newsStore.markEntryRead(id, true);
        this.setState({newsEntryId: id});
    };

    private onMarkUnreadClicked = (id: number) => {
        console.log(`Mark unread clicked ${id}`);
        const newsStore = this.props.newsStore!;
        newsStore.markEntryRead(id, false);
    };

    private onMarkClicked = (id: number) => {
        console.log(`Mark clicked ${id}`);
        const newsStore = this.props.newsStore!;
        newsStore.toggleEntryMark(id);
    };

    render() {
        let content = null;
        const newsEntryId: number | null = this.state.newsEntryId;
        if (newsEntryId != null) {
            const newsStore = this.props.newsStore!;
            content = <div>
                <button onClick={this.back}>Back</button>
                <SingleNewsEntry entry={newsStore.entryById(newsEntryId)}
                                 onMarkClicked={() => this.onMarkClicked(newsEntryId)}
                                 onMarkUnreadClicked={() => this.onMarkUnreadClicked(newsEntryId)}/>
            </div>
        } else {
            content = <NewsEntryList onMarkClicked={this.onMarkClicked} onTitleClicked={this.onTitleClicked}/>;
        }

        return (<div className="root">
                <div className="header">
                    <a className="logout" onClick={this.logout}>Logout</a>
                </div>
                <div className="content">
                    {content}
                </div>
            </div>
        );
    }
}


