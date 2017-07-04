import React from 'react';
import { NavLink, Router, Route, hashHistory, Redirect } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import Home from '../pages/home';
import Publish from '../pages/publish';
import Message from '../pages/message';
import Mine from '../pages/mine';
const history = createBrowserHistory();

function Routes() {
    return (
        <Router history={history}>
            <div>
                <div className="nav" data-flex="box:mean">
                    <NavLink to="/home" activeClassName="active">
                        <i className="iconfont icon-shouye"></i>首页
                    </NavLink>
                    <NavLink to="/publish" activeClassName="active">
                        <i className="iconfont icon-fabu"></i>发表
                    </NavLink>
                    <NavLink to="/message" activeClassName="active">
                        <i className="iconfont icon-xiaoxi"></i>消息
                    </NavLink>
                    <NavLink to="/mine" activeClassName="active">
                        <i className="iconfont icon-wode"></i>我的
                    </NavLink>
                </div>
                <div>
                    <Redirect from="/" to="/home" />
                    <Route path="/home/:name?" component={Home} />
                    <Route path="/publish" component={Publish} />
                    <Route path="/message" component={Message} />
                    <Route path="/mine" component={Mine} />
                </div>
            </div>
        </Router>
    );
}


export default Routes;