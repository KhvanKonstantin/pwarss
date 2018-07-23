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

