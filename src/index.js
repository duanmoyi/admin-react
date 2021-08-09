import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as models from "./models"
import {init} from "@rematch/core"
import {Provider} from "react-redux"
import routes from "./routes"
import {Router} from "react-router";
import {createBrowserHistory} from "history"

const store = init({models});
const browserHistory = createBrowserHistory()

debugger
ReactDOM.render(

    <Provider store={store}>
        <Router history={browserHistory}>
            {routes}
        </Router>,
    </Provider>,
    document.getElementById('root')
);
