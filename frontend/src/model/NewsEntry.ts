// Created by Konstantin Khvan on 7/16/18 9:24 AM


export type IdType = string

export class NewsEntry {
    id: IdType;
    read: boolean;
    marked: boolean;
    link: string;
    title: string;
    date: string;
    content: string;
}

export const NullEntry: NewsEntry = {
    id: "-1",
    read: true,
    marked: false,
    link: "",
    title: "",
    date: "",
    content: ""
};