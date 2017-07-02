import React from 'react';
import { NavLink, Router, Route, hashHistory, Redirect } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import Home from '../pages/home';
import Publish from '../pages/publish';
import Message from '../pages/message';
import Mine from '../pages/mine';
const history = createBrowserHistory();
import _style from '../style/style.less';

function Routes() {
    return (
        <Router history={history}>
            <div>
                <div className={_style.nav} data-flex="box:mean">
                    <NavLink to="/home" activeClassName={_style.active}>
                        <i className="iconfont icon-shouye"></i>首页
                    </NavLink>
                    <NavLink to="/publish" activeClassName={_style.active}>
                        <i className="iconfont icon-shouye"></i>发表
                    </NavLink>
                    <NavLink to="/message" activeClassName={_style.active}>
                        <i className="iconfont icon-xiaoxi"></i>消息
                    </NavLink>
                    <NavLink to="/mine" activeClassName={_style.active}>
                        <i className="iconfont icon-wode"></i>消息
                    </NavLink>
                </div>
                <div>
                    <Redirect from="/" to="/home" />
                    <Redirect from="/home" to="/home/all" />                    
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