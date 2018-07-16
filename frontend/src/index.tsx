import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import {configure} from "mobx";
import {onError, Provider} from "mobx-react";
import AuthStore from "./stores/AuthStore";
// import registerServiceWorker from './registerServiceWorker';

configure({enforceActions: "strict"});

onError(error => {
    console.log(error)
});

const authStore = new AuthStore();

ReactDOM.render(<Provider authStore={authStore}>
    <App/>
</Provider>, document.getElementById('root'));

//registerServiceWorker();
