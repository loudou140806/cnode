import React from 'react';
import { NavLink, Router, Route, hashHistory, Redirect } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import Root from '../pages/Index';
import Topic from '../pages/topic';
import Home from '../pages/home';
import Publish from '../pages/publish';
import Message from '../pages/message';
import Mine from '../pages/mine';

const history = createBrowserHistory();

function Routes() {
    return (
        <Router history={history}>
            <div>
                <Redirect from='/' to='/home'/>
                <Route path='/' component={Root} />
                <Route path='/home' component={Home} />
                <Route path='/publish' component={Publish} />
                <Route path='/message' component={Message} />
                <Route path='/mine' component={Mine} />
                <Route path='/topic/:id' component={Topic} />
            </div>
        </Router>
    );
}

export default Routes;