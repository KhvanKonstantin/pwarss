// Created by Konstantin Khvan on 7/16/18 3:06 PM


import {computed, observable, runInAction} from "mobx";
import {User} from "../model/User";
import api from "../api";

export default class AuthStore {

    @observable
    currentUser: User | null;

    @observable
    userRefreshed: boolean;

    @computed
    get isLoggedIn() {
        return this.currentUser != null;
    }

    setUserState(value: User | null) {
        runInAction(() => {
            this.userRefreshed = true;
            this.currentUser = value;
        });
    }

    async login(login: string, password: string): Promise<User> {
        try {
            const user = await api.user.login(login, password);
            this.setUserState(user);
            return user;
        } catch (e) {
            this.setUserState(null);
            throw e
        }
    }

    async logout(): Promise<any> {
        try {
            await api.user.logout();
            this.setUserState(null);
            return "logout";
        } catch (e) {
            this.setUserState(null);
            throw e
        }
    }

    async updateUserState(): Promise<any> {
        try {
            const user = await api.user.user();
            this.setUserState(user);
        } catch (e) {
            this.setUserState(null);
            // throw e
        }
        return "refresh";
    }
}

