import React from 'react';
import { NavLink, Router, Route, Switch, hashHistory, Redirect } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import createHashHistory from 'history/createHashHistory';
import Index from '../pages';
import Topic from '../pages/topic';
import Login from '../pages/login';

const history = createHashHistory();

function Routes() {
    return (
        <Router history={history}>
            <Switch>
                <Route path='/login' component={Login}/>
                <Route path='/topic/:id?' component={Topic} />
                <Route path='/' component={Index} />
                <Redirect from='' to="/" />
            </Switch>
        </Router>
    );
}

export default Routes;