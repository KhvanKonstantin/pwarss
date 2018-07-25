import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import "normalize.css";
import './index.css';
import {configure} from "mobx";
import {onError, Provider} from "mobx-react";
import AuthStore from "./stores/AuthStore";
import NewsStore from "./stores/NewsStore";
// import registerServiceWorker from './registerServiceWorker';

configure({enforceActions: "strict"});

onError(error => {
    console.log(error)
});

const authStore = new AuthStore();
const newsStore = new NewsStore();

ReactDOM.render(<Provider authStore={authStore} newsStore={newsStore}>
    <App/>
</Provider>, document.getElementById('root'));

//registerServiceWorker();
