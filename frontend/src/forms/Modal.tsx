// Created by Konstantin Khvan on 1/12/20, 10:56 AM

import * as React from "react";
import {modalDiv} from "../pageElements";
import * as ReactDom from "react-dom";
import styled from "styled-components";


const ModalContent = styled.div`
    margin: 0;
    padding: 0;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    
    display: flex;
    align-items: center;
    justify-content: center;
    
    .confirm {
        display: flex;
        background: white;
        flex-direction: column;
    
        max-height: 300px;
    
        min-width: 250px;
    
        padding: 5px;
    
        .content {
            padding: 10px;
        }
    
        .buttons {
            display: flex;
    
            justify-content: flex-end;
    
            color: blue;
    
            .btn {
                padding: 10px;
            }
        }
    }
`;

// const ModalRoot = styled.div`
//     user-select: none;
// `;

const ModalGlass = styled.div`
    user-select: none;

    margin: 0;
    padding: 0;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background: black;
    opacity: 0.3;
`;

function makeModalDiv(): HTMLDivElement {
    const div = document.createElement('div');
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
            <ModalGlass key="glass"/>,
            <ModalContent key="content">{this.props.children}</ModalContent>
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

function Spinner() {
    // By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL
    // https://github.com/SamHerbert/SVG-Loaders
    return <svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff">
        <g fill="none" fillRule="evenodd">
            <g transform="translate(1 1)" strokeWidth="2">
                <circle strokeOpacity=".5" cx="18" cy="18" r="18"/>
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
