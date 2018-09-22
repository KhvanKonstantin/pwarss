// Created by Konstantin Khvan on 9/22/18 10:01 AM

import * as React from "react";


export interface AppBarProps {
    leftMenuHandler: () => any,
    rightMenuHandler: () => any,
    backMenuHandler: () => any,
    title: string,
    showBack: boolean
}

export class AppBar extends React.Component<AppBarProps> {
    render(): React.ReactNode {
        return <div className="app-bar">
            <div className="item">
                {this.props.showBack
                    ? <div onClick={this.props.backMenuHandler}>←</div>
                    : <div onClick={this.props.leftMenuHandler}>☰</div>}
            </div>

            <div className="item title">{this.props.title}</div>

            <div className="item">
                <div onClick={this.props.rightMenuHandler}>⋮</div>
            </div>
        </div>
    }
}

