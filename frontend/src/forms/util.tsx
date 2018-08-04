// Created by Konstantin Khvan on 7/23/18 11:07 AM

import * as React from "react";
import * as ReactDom from "react-dom";
import {modalDiv} from "../pageElements";


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
    return (new DOMParser).parseFromString(html, "text/html").documentElement.textContent;
}


function makeModalDiv(): HTMLDivElement {
    let div = document.createElement('div');
    div.className = "modal-root";
    return div;
}

export class Modal extends React.Component {
    el = makeModalDiv();

    componentDidMount() {
        modalDiv.appendChild(this.el);
    }

    componentWillUnmount() {
        modalDiv.removeChild(this.el);
    }

    render() {
        return ReactDom.createPortal([
            <div className="modal-glass"/>,
            <div className="modal-content">{this.props.children}</div>
        ], this.el);
    }
}

export interface InfoProps {
    content: string
    textOk: string
    onOk: () => any
}

export interface ConfirmProps extends InfoProps {
    textCancel: string
    onCancel: () => any
}

export function Confirm({content, textOk, textCancel, onOk, onCancel}: ConfirmProps) {
    return <Modal>
        <div className="confirm">
            <div className="content">{content}</div>
            <div className="buttons">
                <div className="btn ok" onClick={onOk}>{textOk}</div>
                <div className="btn cancel" onClick={onCancel}>{textCancel}</div>
            </div>
        </div>
    </Modal>;
}

export function Info({content, textOk, onOk}: InfoProps) {
    return <Modal>
        <div className="confirm info">
            <div className="content">{content}</div>
            <div className="buttons">
                <div className="btn ok" onClick={onOk}>{textOk}</div>
            </div>
        </div>
    </Modal>;
}


