// Created by Konstantin Khvan on 7/11/18 2:04 PM

import React, {useEffect} from 'react';
import {observer} from "mobx-react";
import AuthStore from "./stores/AuthStore";
import {LoginScreen} from "./screens/LoginScreen";
import {SplashScreen} from "./screens/SplashScreen";
import {useStores} from "./hooks/stores";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {NewsEntryScreen} from "./screens/NewsEntryScreen";
import {NewsListScreen} from "./screens/NewsListScreen";

export const App: React.FC<{ authStore?: AuthStore }> = observer((props) => {
    const {authStore} = useStores();

    useEffect(() => {
        authStore.updateUserState();
    }, [authStore]);

    const userRefreshed = authStore.userRefreshed;
    const loggedIn = authStore.isLoggedIn;

    if (!userRefreshed) {
        return <SplashScreen/>;
    }

    if (!loggedIn) {
        return <LoginScreen doLogin={(login: string, password: string) => authStore.login(login, password)}/>;
    }

    return <Router>
        <Switch>
            <Route path="/" exact children={<NewsListScreen/>}/>
            <Route path="/news/:id" exact children={<NewsEntryScreen/>}/>
        </Switch>
    </Router>;
});
