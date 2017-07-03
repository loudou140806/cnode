import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
import _style from '../../style/style.less';
import List from './List';
import './index.less';

class Home extends Component {
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div>
                <div className="topNav">
                    <ul data-flex="box:mean">
                        <li>
                            <NavLink to="/home/all" activeClassName="topNavActive">全部</NavLink>
                        </li>
                        <li>
                            <NavLink to="/home/good" activeClassName="topNavActive">精华</NavLink>
                        </li>
                        <li>
                            <NavLink to={`/home/share`} activeClassName="topNavActive">分享</NavLink>
                        </li>
                        <li>
                            <NavLink to={`/home/ask`} activeClassName="topNavActive">问答</NavLink>
                        </li>
                        <li>
                            <NavLink to={`/home/job`} activeClassName="topNavActive">招聘</NavLink>
                        </li>
                    </ul>
                </div>
                <List />
            </div>
        );
    }
    
}

export default Home;