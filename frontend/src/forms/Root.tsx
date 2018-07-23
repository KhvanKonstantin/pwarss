// Created by Konstantin Khvan on 7/16/18 3:35 PM


import * as React from 'react';
import {FormEvent} from 'react';
import NewsEntryList from "./NewsList";


export default class Root extends React.Component<{ doLogout: () => Promise<any> }> {
    private logout = (e: FormEvent) => {
        e.preventDefault();
        this.props.doLogout();
    };

    private onTitleClicked = (id: number) => {
        console.log(`Title clicked ${id}`)
    };

    private onMarkClicked = (id: number) => {
        console.log(`Mark clicked ${id}`)
    };

    render() {
        return (<div className="root">
                <button onClick={this.logout}>Logout</button>
                <NewsEntryList onMarkClicked={this.onMarkClicked} onTitleClicked={this.onTitleClicked}/>
            </div>
        );
    }
}


