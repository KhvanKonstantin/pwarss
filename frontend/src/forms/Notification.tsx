// Created by Konstantin Khvan on 9/22/18 8:46 AM

import * as React from "react";
import {UIStateStore} from "../stores/UIStateStore";
import {observer} from "mobx-react";
import {NotificationInfo, NotificationKind} from "../model/Notifications";
import styled from "styled-components";


const Wrapper = styled.div`
    user-select: none;

    margin: 0;
    padding: 0;
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;

    background: white;

    display: flex;
    align-items: center;
    justify-content: center;

    box-shadow: 0 5px 15px rgba(0, 0, 0, .3);
`;

const Content = styled.div`
    max-height: 50vh;
    padding: 10px;
`;

const ContentInfo = styled.div``;

export function Notification({info}: { info: NotificationInfo | null }) {
    if (!info) {
        return null;
    }

    return <Wrapper>
        {info?.kind === NotificationKind.INFO
            ? <ContentInfo>{info.content}</ContentInfo>
            : <Content>{info.content}</Content>}
    </Wrapper>
}


export const SmartNotification = observer(({store}: { store: UIStateStore }) =>
    <div className="notification-wrap">
        <Notification info={store.currentNotification}/>
    </div>);
