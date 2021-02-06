// Created by Konstantin Khvan on 7/16/18 9:24 AM


export type IdType = string

export class NewsEntry {
    id: IdType = "";
    tags: string[] = [];
    link: string = "";
    title: string = "";
    date: string = "";
    content: string = "";
}

export const NullEntry: NewsEntry = {
    id: "-1",
    tags: [],
    link: "",
    title: "",
    date: "",
    content: ""
};


export const TAG_READ = "read"
export const TAG_MARKED = "marked"

export function newsEntryStarred(entry: NewsEntry): boolean {
    return !!entry.tags && (entry.tags.indexOf(TAG_MARKED) != -1);
}

export function newsEntryRead(entry: NewsEntry): boolean {
    return !!entry.tags && (entry.tags.indexOf(TAG_READ) != -1);
}
