// Created by Konstantin Khvan on 7/11/18 2:04 PM

import * as React from 'react';
import {inject, observer} from "mobx-react";
import AuthStore from "./stores/AuthStore";
import Login from "./forms/Login";
import Root from "./forms/Root";
import Splash from "./forms/Splash";

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

        let content = null;

        if (!userRefreshed) {
            content = <Splash/>;
        } else {
            if (loggedIn) {
                content = <Root doLogout={() => authStore.logout()}/>;
            } else {
                content = <Login doLogin={(login, password) => authStore.login(login, password)}/>;
            }
        }

        return content;
    }
}