import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import fetchActions from '../../actions/fetchList';
import _style from '../../style/style.less';
import './index.less';
import Nav from './nav';
import List from './list';

class Home extends Component {
    componentDidMount() {
        console.log('home.didMount');
        this.props.fetchListAction.fetchList();
    }
    render(){
        const { fetchListAction, match, fetchList } = this.props;
        const tab = match.params.name || 'all';
        return (
            <div>
                <Nav tab={tab} />
                <List data={fetchList.lists} isFetching={fetchList.isFetching}/>
            </div>
        );
    }
}

export default connect( state => {
    return { fetchList: state.fetchList };
}, (dispatch) => {
    return { fetchListAction: bindActionCreators(fetchActions, dispatch)};
})(Home);