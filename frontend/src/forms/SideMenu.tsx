// Created by Konstantin Khvan on 9/22/18 12:59 PM

import * as React from "react";
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

    background: white;
    box-shadow: 0 5px 15px rgba(0, 0, 0, .3);

    .header {
        width:100%;
        height: 32px;
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

export class SideMenu extends React.Component<SideMenuProps> {
    el = makeSideMenuDiv();

    componentDidMount() {
        sideMenusDiv.appendChild(this.el);
    }

    componentWillUnmount() {
        sideMenusDiv.removeChild(this.el);
    }

    render(): React.ReactNode {
        if (!this.props.visible) {
            return null
        }

        return ReactDom.createPortal([
            <div key="glass" className="modal-glass" onClick={this.props.hideMenu}/>,
            this.props.rightSide
                ? <ContentRight key="content">{this.props.children}</ContentRight>
                : <Content key="content">{this.props.children}</Content>,
        ], this.el);
    }
}

export class MenuItem extends React.Component<{ handler?: () => any }> {
    render(): React.ReactNode {
        const handler = this.props.handler;

        return handler
            ? <MenuItemWrap onClick={handler}>{this.props.children}</MenuItemWrap>
            : <MenuItemWrap>{this.props.children}</MenuItemWrap>
    }
}
