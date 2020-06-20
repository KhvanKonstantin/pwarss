// Created by Konstantin Khvan on 5/24/20, 1:15 AM

import * as React from "react";
import {MutableRefObject, useEffect, useRef, useState} from "react";
import {observer} from "mobx-react";
import {IdType} from "../model/NewsEntry";
import {NEWS_FILTER} from "../stores/NewsStore";
import {useHistory} from "react-router-dom";
import {useStores} from "../hooks/stores";
import {AppBarWithMenu, useHideMenuRef} from "../forms/AppBar";
import {
    Avatar,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogTitle,
    Fab,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    makeStyles,
    MenuItem,
    Typography
} from "@material-ui/core";
import {grey, red, yellow} from "@material-ui/core/colors";
import Refresh from "@material-ui/icons/Refresh";
import {StarButton} from "../forms/StarButton";
import {FullScreenProgressWithDelay} from "../forms/util";
import {FixedSizeList, ListChildComponentProps, ListOnScrollProps} from "react-window";
import {useHeightObserver} from "../hooks/heightObserver";

const useStyles = makeStyles(theme => ({
    progress: {
        position: "absolute",
        left: "0",
        right: "0",
        zIndex: 1
    },

    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },

    list: {
        overflowX: "hidden",
        overflowY: "auto",
        height: "calc(100vh - 64px)"
    },

    row: {
        display: "flex",

        height: "90px",
        margin: "0",
        padding: "0",
        background: "white",
        overflow: "hidden",
        borderBottom: "1px solid lightgrey",
        alignItems: "flex-start",
        cursor: "pointer"
    },

    avatar: {
        backgroundColor: red[500],
        margin: "10px",
        alignSelf: "center",
        width: theme.spacing(6),
        height: theme.spacing(6),
    },

    title: {
        position: 'relative',
        flexGrow: 1,
        minWidth: "0",
        margin: "5px",

        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        "-webkit-line-clamp": 2,
        "-webkit-box-orient": "vertical",

        "&.unread": {
            fontWeight: "bold",
        }
    },

    star: {
        display: "block",
        width: "24px",
        height: "24px",
        margin: "10px",
        alignSelf: "flex-end",
        color: grey[500],

        "&.starred": {
            color: yellow[700]
        }
    }
}));

export interface NewsEntryListProps {
    onTitleClicked: (id: IdType) => any
    entryList: MutableRefObject<{ resetScroll: () => void } | null>
}

export const NewsEntryList: React.FC<NewsEntryListProps> = observer(({onTitleClicked, entryList}) => {
    const classes = useStyles();
    const {newsStore, uiStateStore} = useStores();
    const entries = newsStore.entries();

    const [listRoot, height] = useHeightObserver<HTMLDivElement>();

    const listRef = useRef<FixedSizeList | null>(null);
    const scrollOffset = useRef(0);

    const onScroll = (props: ListOnScrollProps) => {
        scrollOffset.current = props.scrollOffset;
    };

    useEffect(() => {
        if (entries.length !== 0 ) {
            listRef.current?.scrollTo(uiStateStore.newsListScroll);
        }
    }, [entries, uiStateStore]);

    entryList.current = {
        resetScroll() {
            listRef.current?.scrollTo(0);
        }
    };

    const row = (props: ListChildComponentProps) => {
        const {index, style} = props;

        const {id, title, read} = entries[index];
        const rowTitleClass = classes.title + (read ? "" : " unread");

        const onClick = () => {
            onTitleClicked(id);
            uiStateStore.newsListScroll = scrollOffset.current;
        }

        return <div key={index} style={style} className={classes.row} onClick={onClick}>
            <Avatar className={classes.avatar}>R</Avatar>
            <Typography variant="h6" className={rowTitleClass}>{title}</Typography>
            <StarButton entryId={id}/>
        </div>
    };

    return <div className={classes.list} ref={listRoot}>
        <FixedSizeList height={height} width="100%" itemSize={90} itemCount={entries.length}
                       ref={listRef} onScroll={onScroll}>
            {row}
        </FixedSizeList>
    </div>
});

export const NewsListScreen: React.FC = observer(() => {
    const [loading, setLoading] = useState(false);
    const [showConfirmReadAll, setShowConfirmReadAll] = useState(false);
    const history = useHistory();

    const {authStore, newsStore} = useStores();

    const classes = useStyles();

    const hideMenus = useHideMenuRef();

    const newsEntryListRef = useRef<{ resetScroll: () => void } | null>(null);

    useEffect(() => {
        if (newsStore.entries().length === 0) {
            refresh();
        }
    }, []);

    const doHideAllMenus = () => {
        hideMenus?.current();
        setShowConfirmReadAll(false);
    };

    const logout = () => {
        newsStore.reset();
        authStore.logout();
    }

    const refresh = () => {
        doHideAllMenus();
        (async () => {
            setLoading(true);
            try {
                await newsStore.refresh();
                newsEntryListRef.current?.resetScroll();
            } finally {
                setLoading(false);
            }
        })();
    };

    const changeFilter = (filter: NEWS_FILTER) => {
        doHideAllMenus();
        (async () => {
            setLoading(true);
            try {
                await newsStore.update(filter);
                newsEntryListRef.current?.resetScroll();
            } finally {
                setLoading(false);
            }
        })();
    };

    const showUnread = () => changeFilter(NEWS_FILTER.UNREAD);
    const showAll = () => changeFilter(NEWS_FILTER.ALL);
    const showStarred = () => changeFilter(NEWS_FILTER.STARRED);

    const showNewsEntry = (id: IdType) => {
        doHideAllMenus();
        history.push(`/news/${id}`);
    };

    const confirmReadAll = () => {
        doHideAllMenus();
        setShowConfirmReadAll(true);
    };

    const readAll = () => {
        setShowConfirmReadAll(false);
        newsStore.readAll();
    };

    const confirmDialog = <Dialog open={showConfirmReadAll} onClose={doHideAllMenus}>
        <DialogTitle>Mark all read?</DialogTitle>
        <DialogActions>
            <Button onClick={() => setShowConfirmReadAll(false)} color="primary" autoFocus>
                Cancel
            </Button>
            <Button onClick={readAll} color="primary">
                Mark read
            </Button>
        </DialogActions>
    </Dialog>

    const leftMenu = <List>
        <ListItem><ListItemText>{authStore.currentUser!.login}</ListItemText></ListItem>
        <ListItem onClick={showUnread}><ListItemText>Unread</ListItemText></ListItem>
        <ListItem onClick={showAll}><ListItemText>All entries</ListItemText></ListItem>
        <ListItem onClick={showStarred}><ListItemText>Starred</ListItemText></ListItem>
        <ListItem onClick={logout}><ListItemText>Logout</ListItemText></ListItem>
    </List>;

    const rightMenu = [
        <MenuItem key="mark-all-read" onClick={confirmReadAll}>Mark all read</MenuItem>
    ];

    return (<Container disableGutters maxWidth={false}>
            <AppBarWithMenu title="Title"
                            hideMenusRef={hideMenus}
                            leftMenu={leftMenu} rightMenu={rightMenu}
                            showBack={false}/>

            <LinearProgress color={"secondary"} className={classes.progress}
                            style={{visibility: loading ? "visible" : "hidden"}}/>

            <NewsEntryList onTitleClicked={showNewsEntry} entryList={newsEntryListRef}/>

            <Fab color="secondary" size="medium" className={classes.fab} onClick={refresh}>
                <Refresh/>
            </Fab>

            <FullScreenProgressWithDelay loading={loading}/>

            {confirmDialog}

        </Container>
    );
});



