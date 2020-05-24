// Created by Konstantin Khvan on 9/22/18 10:01 AM

import * as React from "react";
import styled from "styled-components";
import {Fragment, MutableRefObject, ReactElement, useState} from "react";
import {SideMenu} from "./SideMenu";

const Wrapper = styled.div`
    background: mediumpurple;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;

    overflow: hidden;

    display: flex;
    align-items: center;

    user-select: none;

    box-shadow: 0 5px 15px rgba(0, 0, 0, .3);
`;

const Item = styled.div`
    font-size: 1.5em;
    
    color: white;
    padding: 10px;
`;

const Title = styled(Item)`
    font-size: 1.5em;
    text-overflow: ellipsis;
    overflow: hidden;
    
    flex-grow: 1;
`;

interface AppBarProps {
    leftMenuHandler: () => any,
    rightMenuHandler: () => any,
    backMenuHandler: () => any,
    title: string,
    showBack: boolean
}

export const AppBar: React.FC<AppBarProps> = (props) => {
    const {
        leftMenuHandler,
        rightMenuHandler,
        backMenuHandler,
        title,
        showBack
    } = props;

    const backOrHamburger = showBack ? <div onClick={backMenuHandler}>←</div> : <div onClick={leftMenuHandler}>☰</div>;

    return <Wrapper>
        <Item>
            {backOrHamburger}
        </Item>

        <Title>{title}</Title>

        <Item>
            <div onClick={rightMenuHandler}>⋮</div>
        </Item>
    </Wrapper>

};

export interface AppBarWithMenuProps {
    title: string
    hideMenusRef: MutableRefObject<() => void>
    leftMenu?: ReactElement
    rightMenu: ReactElement
    onGoBack?: () => void
    showBack: boolean
}

export const AppBarWithMenu: React.FC<AppBarWithMenuProps> = (props) => {
    const [left, setLeft] = useState(false);
    const [right, setRight] = useState(false);

    const {title, hideMenusRef, leftMenu, rightMenu, onGoBack, showBack} = props;

    const hideMenus = () => {
        setLeft(false);
        setRight(false);
    };

    hideMenusRef.current = hideMenus;

    const showLeft = () => {
        hideMenus();
        setLeft(true);
    };

    const showRight = () => {
        hideMenus();
        setRight(true);
    };

    return <Fragment>
        <AppBar leftMenuHandler={showLeft}
                rightMenuHandler={showRight}
                backMenuHandler={onGoBack || (() => 0)}
                title={title}
                showBack={showBack}/>

        {leftMenu && <SideMenu visible={left} rightSide={false} hideMenu={hideMenus}>
            {leftMenu}
        </SideMenu>
        }

        <SideMenu visible={right} rightSide={true} hideMenu={hideMenus}>
            {rightMenu}
        </SideMenu>
    </Fragment>;
};


