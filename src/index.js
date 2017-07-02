import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import Router from './route';
import 'normalize.css';
import 'flex.css/dist/data-flex.css';
import './iconfont/iconfont.css';
import 'github-markdown-css'; //markdown css

function App() {
    return (
        <Provider store={store}>
            <Router />
        </Provider>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));
