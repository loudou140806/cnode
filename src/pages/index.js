import React, { Component } from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Home from './home';
import Create from './create';
import Message from './message';
import UserView from './user';

class Root extends Component {
    render() {
        const {match, User} =  this.props;
        return (
            <div>
                <div className="nav" data-flex="box:mean">
                    <NavLink to="/" exact activeClassName="active">
                        <i className="iconfont icon-shouye"></i>首页
                    </NavLink>
                    <NavLink to="/create" activeClassName="active">
                        <i className="iconfont icon-fabu"></i>发表
                    </NavLink>
                    <NavLink to="/message" activeClassName="active">
                        <i className="iconfont icon-xiaoxi"></i>消息
                    </NavLink>
                    <NavLink to={User.loginname ? '/user/'+ User.loginname : '/login' } activeClassName="active">
                        <i className="iconfont icon-wode"></i>我的
                    </NavLink>
                </div>
                <div>
                    <Route path='/' exact component={Home} />
                    <Route path='/create' component={Create} />
                    <Route path='/message' component={Message} />
                    <Route path='/user/:loginname' component={UserView} />
                </div>
            </div>
        );
    }
}

export default connect(
    state => {
        return { User: state.User }
    }
)(Root);
