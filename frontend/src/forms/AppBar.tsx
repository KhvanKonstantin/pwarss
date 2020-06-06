// Created by Konstantin Khvan on 9/22/18 10:01 AM

import * as React from "react";
import {MutableRefObject, ReactElement, useRef, useState} from "react";
import {AppBar, Drawer, IconButton, makeStyles, Menu, Toolbar, Typography} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowBack from "@material-ui/icons/ArrowBack";
import MoreIcon from "@material-ui/icons/MoreVert";


const useStyles = makeStyles(theme => ({
    title: {
        flexGrow: 1
    }
}));

export interface AppBarWithMenuProps {
    title: string
    hideMenusRef: MutableRefObject<() => void>
    leftMenu?: ReactElement
    rightMenu: ReactElement[]
    onGoBack?: () => void
    showBack: boolean
    extraToolbarElements?: ReactElement[]
}


export function useHideMenuRef(): React.MutableRefObject<() => void> {
    return useRef<() => void>(() => 0);
}

export const AppBarWithMenu: React.FC<AppBarWithMenuProps> = (props) => {
    const [left, setLeft] = useState<null | HTMLElement>(null);
    const [right, setRight] = useState<null | HTMLElement>(null);

    const classes = useStyles();

    const {
        title,
        hideMenusRef,
        leftMenu,
        rightMenu,
        onGoBack,
        showBack,
        extraToolbarElements
    } = props;

    const hideMenus = () => {
        setLeft(null);
        setRight(null);
    };

    hideMenusRef.current = hideMenus;

    const showLeft = (event: React.MouseEvent<HTMLElement>) => {
        hideMenus();
        setLeft(event.currentTarget);
    };

    const showRight = (event: React.MouseEvent<HTMLElement>) => {
        hideMenus();
        setRight(event.currentTarget);
    };

    return <AppBar position="sticky">

        <Toolbar>
            <IconButton edge="start" color="inherit"
                        onClick={showBack ? onGoBack : showLeft}>
                {showBack ? <ArrowBack/> : <MenuIcon/>}
            </IconButton>

            <Typography variant="h6" className={classes.title}>
                {title}
            </Typography>

            {extraToolbarElements}

            <IconButton edge="end" color="inherit" onClick={showRight}>
                <MoreIcon/>
            </IconButton>
        </Toolbar>

        {leftMenu && <Drawer anchor="left" open={!!left} onClose={hideMenus}>
            {leftMenu}
        </Drawer>
        }

        <Menu anchorEl={right}
              anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
              }}
              open={!!right}
              onClose={hideMenus}>
            {rightMenu}
        </Menu>
    </AppBar>;
};


