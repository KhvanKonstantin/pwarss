// Created by Konstantin Khvan on 9/22/18 8:46 AM

import * as React from "react";
import {UIStateStore} from "../stores/UIStateStore";
import {observer} from "mobx-react";
import {NotificationInfo} from "../model/Notifications";

export function Notification({info}: { info: NotificationInfo | null }) {
    if (!info) {
        return null;
    }

    return <div className={`notification ${info.kind}`}>
        <div className="content">{info.content}</div>
    </div>
}


export const SmartNotification = observer(({store}: { store: UIStateStore }) =>
    <div className="notification-wrap">
        <Notification info={store.currentNotification}/>
    </div>);