import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';
import fetchActions from '../../actions/fetchList';
import _style from '../../style/style.less';
import List from './List';
import './index.less';

class Home extends Component {
    constructor(props){
        super(props);
        this.state = this.props.fetchList;
    }
    fetchList(params){
        this.props.actions.fetchList(params);
    }
    componentWillMount (){
        this.fetchList();
    }
    //参数代表下次要传递的props
    componentWillReceiveProps(nextProps){
        this.setState({
            tab: nextProps.match.params.name || 'all'
        });
    }
    render(){
        return (
            <div>
                <div className="topNav">
                    <ul data-flex="box:mean">
                        <li>
                            <NavLink to="/home" exact={true} activeClassName="topNavActive">全部</NavLink>
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
                <List {...this.props} />
            </div>
        );
    }
    
}

export default connect( state => {
    return { fetchList: state.fetchList };
}, dispatch => {
    return { actions: bindActionCreators(fetchActions, dispatch)};
})(Home);