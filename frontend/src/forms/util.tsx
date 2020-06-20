// Created by Konstantin Khvan on 7/23/18 11:07 AM

import {Backdrop, CircularProgress, Fade} from "@material-ui/core";
import React from "react";

export function extractTextFromHtmlString(html: string) {
    return (new DOMParser()).parseFromString(html, "text/html").documentElement.textContent;
}

export interface CircularProgressWithDelayProps {
    loading: boolean
    delay?: number | null
}

export const FullScreenProgressWithDelay: React.FC<CircularProgressWithDelayProps> = ({loading, delay = 2000}) => {
    const transitionDelay = loading ? `${delay}ms` : '0ms';

    return <Fade in={loading} style={{transitionDelay}}>
        <Backdrop open={loading} style={{zIndex: "unset"}}>
            <CircularProgress/>
        </Backdrop>
    </Fade>
}
