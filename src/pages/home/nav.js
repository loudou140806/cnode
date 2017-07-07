import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Nav extends Component {
    render() {
        return (
            <div className="topNav">
                <ul data-flex="box:mean">
                    <li>
                        <NavLink to="/home" exact activeClassName="topNavActive">全部</NavLink>
                    </li>
                    <li>
                        <NavLink to="/home/good" activeClassName="topNavActive">精华</NavLink>
                    </li>
                    <li>
                        <NavLink to="/home/share" activeClassName="topNavActive">分享</NavLink>
                    </li>
                    <li>
                        <NavLink to="/home/ask" activeClassName="topNavActive">问答</NavLink>
                    </li>
                    <li>
                        <NavLink to="/home/job" activeClassName="topNavActive">招聘</NavLink>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Nav;