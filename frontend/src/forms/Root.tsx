// Created by Konstantin Khvan on 7/16/18 3:35 PM


import * as React from 'react';
import {FormEvent} from 'react';


export default class Root extends React.Component<{ doLogout: () => Promise<any> }> {
    private logout = (e: FormEvent) => {
        e.preventDefault();
        this.props.doLogout();
    };

    render() {
        return (<form>
                <button onClick={this.logout}>Logout</button>
            </form>
        );
    }
}


