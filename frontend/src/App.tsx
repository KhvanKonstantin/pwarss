// Created by Konstantin Khvan on 7/11/18 2:04 PM

import React, {useEffect} from 'react';
import {observer} from "mobx-react";
import AuthStore from "./stores/AuthStore";
import {Login} from "./forms/Login";
import {Main} from "./forms/Main";
import Splash from "./forms/Splash";
import {useStores} from "./hooks/stores";

export const App: React.FC<{ authStore?: AuthStore }> = observer((props) => {
    const {authStore} = useStores();

    useEffect(() => {
        authStore.updateUserState();
    }, [authStore]);

    const userRefreshed = authStore.userRefreshed;
    const loggedIn = authStore.isLoggedIn;

    if (!userRefreshed) {
        return <Splash/>;
    }

    if (!loggedIn) {
        return <Login doLogin={(login: string, password: string) => authStore.login(login, password)}/>;
    }

    return <Main/>;
});
