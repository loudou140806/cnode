import React, { Component } from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';


class Root extends Component {
    render() {
        const {match} =  this.props;
        return (
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
            </div>
        );
    }
}

export default Root;
