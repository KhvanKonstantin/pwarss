// Created by Konstantin Khvan on 7/11/18 2:04 PM

import * as React from 'react';
import {inject, observer} from "mobx-react";
import AuthStore from "./stores/AuthStore";
import Login from "./forms/Login";
import Main from "./forms/Main";
import Splash from "./forms/Splash";
import {BrowserRouter, Route, Switch} from "react-router-dom";

@inject("authStore")
@observer
export default class App extends React.Component <{ authStore?: AuthStore }> {

    componentDidMount() {
        const authStore = this.props.authStore!;
        authStore.updateUserState();
    }


    render(): React.ReactNode {
        const authStore = this.props.authStore!;
        const userRefreshed = authStore.userRefreshed;
        const loggedIn = authStore.isLoggedIn;

        if (!userRefreshed) {
            return <Splash/>;
        }

        if (!loggedIn) {
            return <Login doLogin={(login, password) => authStore.login(login, password)}/>;
        }

        return <BrowserRouter>
            <Switch>
                <Route path="/" exact
                       render={() => <Main doLogout={() => authStore.logout()}/>}/>
                <Route/>
            </Switch>
        </BrowserRouter>;
    }
}