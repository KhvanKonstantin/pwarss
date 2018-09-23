// Created by Konstantin Khvan on 9/22/18 8:46 AM


import {action, observable} from "mobx";
import {NotificationInfo} from "../model/Notifications";
import {IdType} from "../model/NewsEntry";


function getNewsEntryIdFromPath(): IdType | null {
    const pathname = window.location.pathname;
    const match = pathname.match(new RegExp("^/?news/([0-9]+)/?$"));
    return (match && match.length == 2) ? match[1] : null;
}

export class UIStateStore {
    @observable
    currentNotification: NotificationInfo | null;

    @observable
    newsEntryId: IdType | null;

    private allNotifications: NotificationInfo[] = [];


    constructor() {
        window.addEventListener("popstate", () => this.updateEntryId());
        this.updateEntryId();
    }

    @action
    updateEntryId() {
        this.newsEntryId = getNewsEntryIdFromPath();
    };

    goBack() {
        window.history.back();
    }

    showNewsList() {
        // @ts-ignore
        window.history.pushState(null, null, `/`);
        this.updateEntryId();
    }

    showNewsEntry(id: IdType) {
        // @ts-ignore
        window.history.pushState(null, null, `/news/${id}`);
        this.updateEntryId();
    }

    pushNotification(info: NotificationInfo): () => void {
        this.allNotifications.push(info);
        this.updateCurrent();

        const dispose = () => {
            this.allNotifications = this.allNotifications.filter(e => e !== info);
            this.updateCurrent();
        };

        const timeout = info.autoHideMillis ? info.autoHideMillis : 0;

        if (timeout > 0) {
            setTimeout(dispose, info.autoHideMillis)
        }

        return dispose
    }

    @action
    private updateCurrent() {
        const infos = this.allNotifications;
        this.currentNotification = infos.length <= 0 ? null : infos[infos.length - 1]
    }


}