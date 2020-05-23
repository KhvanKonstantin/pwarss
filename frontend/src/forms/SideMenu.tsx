// Created by Konstantin Khvan on 9/22/18 12:59 PM

import React, {useEffect, useState} from 'react';
import {sideMenusDiv} from "../pageElements";
import * as ReactDom from "react-dom";
import styled from "styled-components";

const Content = styled.div`
    user-select: none;

    margin: 0;
    padding: 0;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;

    display: flex;
    flex-direction: column;
    align-items: flex-start;

    font-size: 1.2em;

    background: white;
    box-shadow: 0 5px 15px rgba(0, 0, 0, .3);

    .header {
        width: 100%;
        height: 50px;
        background: mediumpurple;
        color: white;
    }
`;

const ContentRight = styled(Content)`
    left: initial;
    right: 0;
`;


const MenuItemWrap = styled.div`
    padding: 5px;
`;


function makeSideMenuDiv(): HTMLDivElement {
    const div = document.createElement('div');
    div.className = "side-menu-root";
    return div;
}

export interface SideMenuProps {
    visible: boolean,
    rightSide: boolean,
    hideMenu: () => any
}

export const SideMenu: React.FC<SideMenuProps> = (props) => {
    const [el] = useState(() => makeSideMenuDiv());

    useEffect(() => {
        sideMenusDiv.appendChild(el);
        return () => {
            sideMenusDiv.removeChild(el);
        }
    }, [el]);

    if (!props.visible) {
        return null
    }

    return ReactDom.createPortal([
        <div key="glass" className="modal-glass" onClick={props.hideMenu}/>,
        props.rightSide
            ? <ContentRight key="content">{props.children}</ContentRight>
            : <Content key="content">{props.children}</Content>,
    ], el);
}


export const MenuItem: React.FC<{ handler?: () => any }> = (props) => {
    const handler = props.handler;

    return handler
        ? <MenuItemWrap onClick={handler}>{props.children}</MenuItemWrap>
        : <MenuItemWrap>{props.children}</MenuItemWrap>
}
