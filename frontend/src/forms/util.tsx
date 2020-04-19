// Created by Konstantin Khvan on 7/23/18 11:07 AM

import * as React from "react";

function spanIf({text, color}: { text?: string, color?: string }) {
    if (text) {
        return color ? <span style={{color}}>{text}</span> : <span>{text}</span>;
    }
    return null
}

export function ErrorSpan({text}: { text?: string }) {
    return spanIf({text, color: "red"});
}


export function extractTextFromHtmlString(html: string) {
    return (new DOMParser()).parseFromString(html, "text/html").documentElement.textContent;
}


const MAX_SHOW_SPINNER_DELAY = 300;

export function withLoading(component: React.Component<any, { loading: boolean }>, block: () => Promise<any>) {
    let done = false;
    const markDone = function () {
        return done = true;
    };

    const promise = block();

    promise.then(markDone, markDone);

    setTimeout(function () {
        if (!done) {
            component.setState({loading: true}, async () => {
                try {
                    await promise;
                } finally {
                    component.setState({loading: false})
                }
            });
        }
    }, MAX_SHOW_SPINNER_DELAY);
}
