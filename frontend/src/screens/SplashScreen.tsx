// Created by Konstantin Khvan on 7/16/18 3:35 PM


import * as React from 'react';


export const SplashScreen = () =>
    <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "12vw",
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 0,
        padding: 0
    }}>
        <img style={{
            width: "50%"
        }}
             src="/static/images/logo.png" alt="PWARSS"/>
    </div>;
