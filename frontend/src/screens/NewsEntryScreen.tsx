// Created by Konstantin Khvan on 5/24/20, 1:15 AM

import React, {useEffect} from 'react';
import {IdType} from "../model/NewsEntry";
import {extractTextFromHtmlString} from "../forms/util";
import {observer} from "mobx-react";
import {useStores} from "../hooks/stores";
import {useHistory, useParams} from "react-router-dom";
import {AppBarWithMenu, useHideMenuRef} from "../forms/AppBar";
import {Card, CardContent, CardHeader, Container, Link as MaterialLink, MenuItem, Typography} from "@material-ui/core";
import {StarButton} from "../forms/StarButton";


interface NewsEntryContentProps {
    entryId: IdType | null
}

const NewsEntryContent: React.FC<NewsEntryContentProps> = ({entryId}) => {
    const {newsStore} = useStores();

    const entry = entryId ? newsStore.entryById(entryId) : null;

    if (entryId == null) {
        return null;
    }

    const {title, link, content, date} = entry!;

    const textContent = extractTextFromHtmlString(content);

    const entryTitle = <MaterialLink rel="noopener noreferrer" target="_blank" href={link}>
        <Typography variant="body1">
            {title}
        </Typography>
    </MaterialLink>;

    const subheader = <Typography variant="body2">{date}</Typography>;

    return <Card raised={false}>
        <CardHeader title={entryTitle} subheader={subheader}/>
        <CardContent>
            <Typography variant="body2">{textContent}</Typography>
        </CardContent>
    </Card>
};

interface NewsIdParam {
    id: string | undefined
}

export const NewsEntryScreen: React.FC = observer(() => {
    const history = useHistory();
    const urlParams = useParams<NewsIdParam>();
    const id: IdType | null = urlParams.id || null;

    const {newsStore} = useStores();

    useEffect(() => {
        if (id) {
            newsStore.readEntry(id, true);
        }
    }, [newsStore, id]);

    const hideMenusRef = useHideMenuRef();

    const back = () => {
        hideMenusRef?.current();
        history.goBack();
    };

    const unreadEntry = () => {
        hideMenusRef?.current();
        if (id) {
            newsStore.readEntry(id, false);
        }
    };

    return (<Container disableGutters maxWidth={false}>
            <AppBarWithMenu title="Title"
                            hideMenusRef={hideMenusRef}
                            rightMenu={[<MenuItem key="mark-all-read" onClick={unreadEntry}>Mark unread</MenuItem>]}
                            onGoBack={back} showBack={true}
                            extraToolbarElements={[<StarButton key="star" entryId={id} monochrome/>]}/>

            <NewsEntryContent entryId={id}/>

        </Container>
    );
});
