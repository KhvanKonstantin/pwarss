// Created by Konstantin Khvan on 7/16/18 3:06 PM


import {observable, runInAction} from "mobx";
import {User} from "../model/User";
import api from "../api";

export default class AuthStore {

    @observable
    private _currentUser: User | null | undefined = undefined;

    get currentUser(): User | null {
        return this._currentUser ?? null;
    }

    private set user(value: User | null) {
        runInAction(() => {
            this._userRefreshed = true;
            this._currentUser = value;
        });
    }

    resetUserState() {
        this.user = null;
    }

    private _userRefreshed: boolean = false;

    get userRefreshed(): boolean {
        return this._userRefreshed;
    }

    get isLoggedIn() {
        return this._currentUser != null;
    }

    async login(login: string, password: string): Promise<User> {
        try {
            const user = await api.user.login(login, password);
            this.user = user;
            return user;
        } catch (e) {
            this.resetUserState();
            throw e
        }
    }

    async logout(): Promise<any> {
        try {
            await api.user.logout();
            this.user = null;
            return "logout";
        } catch (e) {
            this.resetUserState();
            throw e
        }
    }

    async updateUserState(): Promise<any> {
        try {
            this.user = await api.user.user();
        } catch (e) {
            this.resetUserState();
            // throw e
        }
        return "refresh";
    }
}

