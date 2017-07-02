import React from 'react';
import { NavLink } from 'react-router-dom';
import _style from '../../style/style.less';

function Home() {
    return (
        <div className={_style.topNav}>
            <ul data-flex="box:mean">
                <li>
                    <NavLink to="/home/all" activeClassName={_style.topNavActive}>全部</NavLink>
                </li>
                <li>
                    <NavLink to="/home/good" activeClassName={_style.topNavActive}>精华</NavLink>
                </li>
                <li>
                    <NavLink to={`/home/share`} activeClassName={_style.topNavActive}>分享</NavLink>
                </li>
                <li>
                    <NavLink to={`/home/ask`} activeClassName={_style.topNavActive}>问答</NavLink>
                </li>
                <li>
                    <NavLink to={`/home/job`} activeClassName={_style.topNavActive}>招聘</NavLink>
                </li>
            </ul>
        </div>
    );
}

export default Home;
