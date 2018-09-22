// Created by Konstantin Khvan on 9/22/18 12:59 PM

import * as React from "react";
import {sideMenusDiv} from "../pageElements";
import * as ReactDom from "react-dom";

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
            <div key="content"
                 className={`side-menu-content ${this.props.rightSide ? 'right' : ''}`}>
                {this.props.children}
            </div>
        ], this.el);
    }
}

export class MenuItem extends React.Component<{ handler?: () => any }> {
    render(): React.ReactNode {
        const handler = this.props.handler;

        return handler
            ? <div className="menu-item" onClick={handler}>{this.props.children}</div>
            : <div className="menu-item">{this.props.children}</div>
    }
}