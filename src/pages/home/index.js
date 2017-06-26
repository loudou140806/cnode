import React from 'react';
import { NavLink } from 'react-router-dom';
import _style from '../../style/style.less';

function Home({match}) {
    return (
        <div className={_style.topNav}>
            <ul data-flex="box:mean">
                <li>
                    <NavLink to={`${macth}.url`} activeClassName="active">全部</NavLink>
                </li>
                <li>
                    <NavLink to="/?tab=good" activeClassName="active">精华</NavLink>
                </li>
                <li>
                    <NavLink to="/?tab=share" activeClassName="active">分享</NavLink>
                </li>
                <li>
                    <NavLink to="/?tab=ask" activeClassName="active">问答</NavLink>
                </li>
                <li>
                    <NavLink to="/?tab=job" activeClassName="active">招聘</NavLink>
                </li>
            </ul>
        </div>
    );
}

export default Home;
