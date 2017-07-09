import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import queryString from 'query-string';

class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFecthing: false,
            page: 1
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        console.log('点击'+ this.props.tab);
    }
    render() {
        const { tab } = this.props;
        const sec = {};
        sec[tab] = 'on';
        return (
            <div className="topNav">
                <ul data-flex="box:mean">
                    <li className={sec.all}>
                        <NavLink to="/?tab=all" activeClassName="topNavActive" onClick={this.handleClick}>全部</NavLink>
                    </li>
                    <li className={sec.good}>
                        <NavLink to="/?tab=good" activeClassName="topNavActive" onClick={this.handleClick}>精华</NavLink>
                    </li>
                    <li className={sec.share}>
                        <NavLink to="/?tab=share" activeClassName="topNavActive" onClick={this.handleClick}>分享</NavLink>
                    </li>
                    <li className={sec.ask}>
                        <NavLink to="/?tab=ask" activeClassName="topNavActive" onClick={this.handleClick}>问答</NavLink>
                    </li>
                    <li className={sec.job}>
                        <NavLink to="/?tab=job" activeClassName="topNavActive" onClick={this.handleClick}>招聘</NavLink>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Nav;