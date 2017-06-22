import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import Router from './route';

function App() {
    return (
        <Provider store={store}>
            <Router />
        </Provider>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));
