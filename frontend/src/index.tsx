import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import "normalize.css";
import './index.css';
import * as Mobx from "mobx";
import * as MobxReact from "mobx-react";
import AuthStore from "./stores/AuthStore";
import NewsStore from "./stores/NewsStore";
import {rootDiv} from "./pageElements";
import {UIStateStore} from "./stores/UIStateStore";
// import registerServiceWorker from './registerServiceWorker';

Mobx.configure({enforceActions: "always"});

// MobxReact.onError(error => {
//     console.log(error)
// });

const authStore = new AuthStore();
const newsStore = new NewsStore();
const uiStateStore = new UIStateStore();
const element = <MobxReact.Provider authStore={authStore} newsStore={newsStore} uiStateStore={uiStateStore}>
    <App/>
</MobxReact.Provider>;

ReactDOM.render(element, rootDiv);

//registerServiceWorker();
