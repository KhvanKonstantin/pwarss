// Created by Konstantin Khvan on 9/22/18 8:46 AM


import {action, observable} from "mobx";
import {NotificationInfo} from "../model/Notifications";


export class UIStateStore {
    @observable
    currentNotification: NotificationInfo | null = null;

    private allNotifications: NotificationInfo[] = [];

    newsListScroll = 0;

    pushNotification(info: NotificationInfo): () => void {
        this.allNotifications.push(info);
        this.updateCurrent();

        const dispose = () => {
            this.allNotifications = this.allNotifications.filter(e => e !== info);
            this.updateCurrent();
        };

        const timeout = info.autoHideMillis ? info.autoHideMillis : 0;

        if (timeout > 0) {
            setTimeout(dispose, timeout)
        }

        return dispose
    }

    @action
    private updateCurrent() {
        const infos = this.allNotifications;
        this.currentNotification = infos.length <= 0 ? null : infos[infos.length - 1]
    }
}
