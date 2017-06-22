import React from 'react';
import { NavLink, Router, Route, hashHistory } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import Home from '../pages/home';
import Publish from '../pages/publish';
import Message from '../pages/message';
import Mine from '../pages/mine';
const history = createBrowserHistory();
import '../style/style.less';

function Routes() {
    return (
        <Router history={history}>
            <div>
                <div className={style.nav}>
                    <NavLink to="/home">首页</NavLink>
                    <NavLink to="/publish">发表</NavLink>
                    <NavLink to="/message">消息</NavLink>
                    <NavLink to="/mine">我的</NavLink>
                </div>
                <div>
                    <Route path="/home" component={Home} />
                    <Route path="/publish" component={Publish} />
                    <Route path="/message" component={Message} />
                    <Route path="/mine" component={Mine} />
                </div>
            </div>
        </Router>
    );
}


export default Routes;