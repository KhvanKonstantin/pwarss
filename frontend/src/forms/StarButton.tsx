// Created by Konstantin Khvan on 5/24/20, 1:15 AM

import {IdType, NewsEntry, newsEntryStarred} from "../model/NewsEntry";
import * as React from "react";
import {observer} from "mobx-react";
import {useStores} from "../hooks/stores";
import StarFilled from "@material-ui/icons/Star";
import StarBorder from "@material-ui/icons/StarBorder";
import {IconButton, makeStyles} from "@material-ui/core";
import {grey, yellow} from "@material-ui/core/colors";

const useStyles = makeStyles(theme => ({
    star: {
        display: "block",
        width: "24px",
        height: "24px",
        margin: "10px",
        alignSelf: "flex-end",
        color: grey[500],

        "&.starred": {
            color: yellow[700]
        },

        "&.monochrome": {
            color: grey[50]
        },
        "&.starred.monochrome": {
            color: grey[50]
        }
    }
}));

export interface StarButtonProps {
    entryId?: IdType | null
    monochrome?: boolean
}

export const StarButton: React.FC<StarButtonProps> = observer((props) => {
    const classes = useStyles();

    const {newsStore} = useStores();

    const {entryId, monochrome} = props;

    const starEntry = (event: React.MouseEvent, id: IdType | undefined | null, star: boolean) => {
        event.stopPropagation();

        if (id) {
            newsStore.starEntry(id, star);
        }
    };

    const entry: NewsEntry | null = entryId ? newsStore.entryById(entryId) : null;
    const starred = entry && newsEntryStarred(entry)

    let starClass = starred ? classes.star + " starred" : classes.star;
    starClass = monochrome ? starClass + " monochrome" : starClass;

    return <IconButton edge="end" color="inherit" onClick={(event) => starEntry(event, entry?.id, !starred)}>
        {starred ? <StarFilled className={starClass}/> : <StarBorder className={starClass}/>}
    </IconButton>
});
