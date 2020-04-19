// Created by Konstantin Khvan on 9/22/18 10:01 AM

import * as React from "react";
import styled from "styled-components";

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

