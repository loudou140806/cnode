import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import Router from './route';
import 'flex.css/dist/data-flex.css';

function App() {
    return (
        <Provider store={store}>
            <Router />
        </Provider>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));
