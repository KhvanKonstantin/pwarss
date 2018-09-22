// Created by Konstantin Khvan on 9/22/18 8:46 AM

export enum NotificationKind {
    INFO = "info",
    ERROR = "error"
}

export interface NotificationInfo {
    kind: NotificationKind
    content?: string | null
    autoHideMillis?: number | null
}
