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

function Spinner() {
    // By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL
    // https://github.com/SamHerbert/SVG-Loaders
    return <svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff">
        <g fill="none" fill-rule="evenodd">
            <g transform="translate(1 1)" stroke-width="2">
                <circle stroke-opacity=".5" cx="18" cy="18" r="18"/>
                <path d="M36 18c0-9.94-8.06-18-18-18">
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 18 18"
                        to="360 18 18"
                        dur="1s"
                        repeatCount="indefinite"/>
                </path>
            </g>
        </g>
    </svg>
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

export function ModalSpinner() {
    return <Modal><Spinner/></Modal>
}


