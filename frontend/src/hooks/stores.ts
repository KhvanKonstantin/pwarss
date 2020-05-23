// Created by Konstantin Khvan on 5/23/20, 8:45 AM

import AuthStore from "../stores/AuthStore";
import NewsStore from "../stores/NewsStore";
import {UIStateStore} from "../stores/UIStateStore";
import React from "react";
import {MobXProviderContext} from "mobx-react";

export interface Stores {
    authStore: AuthStore,
    newsStore: NewsStore,
    uiStateStore: UIStateStore
}

export function useStores(): Stores {
    const context = React.useContext<any>(MobXProviderContext)
    return {
        authStore: context.authStore,
        newsStore: context.newsStore,
        uiStateStore: context.uiStateStore
    }
}
