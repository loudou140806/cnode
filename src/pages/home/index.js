import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import actions from '../../actions';
import _style from '../../style/style.less';
import './index.less';
import queryString from 'query-string';
import Nav from './nav';
import List from './list';

class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            tab: 'all',
            data: this.props.fetchList.lists
        }
        this.handleScroll = this.handleScroll.bind(this);
    }
    handleScroll(e) {
        const indexList = document.querySelector('.index-list');
        if(!indexList)return;
        const scrollTop = window.scrollY;
        const listHeight = indexList.clientHeight - 80;
        const containerHeight = window.outerHeight;
        const { page, limit, mdrender, isFetching } = this.props.fetchList;
        const tab = queryString.parse(this.props.location.search).tab || 'all';
        if(scrollTop > (listHeight - containerHeight -30)) {
            if(isFetching) return false;
            this.props.fetchListAction.fetchList('/api/v1/topics', {
                tab: tab,
                limit,
                page,
                mdrender
            });
        }
    }
    componentDidMount() {
        const scroll = window.addEventListener('scroll', this.handleScroll);
        const { page, limit, mdrender } = this.props.fetchList;
        this.props.fetchListAction.fetchList('/api/v1/topics', {
            tab: this.state.tab,
            limit,
            page,
            mdrender
        });
    }
    componentUnMount() {
        console.log('unmount HOME')
        window.removeEventListener('scroll', scroll);
    }
    componentWillReceiveProps() {

    }
    // shouldComponentUpdate(np) {
    //     return this.props.fetchList.lists !== np.fetchList.lists;
    // }
    render(){
        const tab = queryString.parse(this.props.location.search).tab || 'all';
        const { fetchListAction, fetchList } = this.props;
        return (
            <div>
                <Nav tab={tab} {...this.props}/>
                <List data={fetchList.lists} isFetching={fetchList.isFetching}/>
            </div>
        );
    }
}

export default connect( state => {
    return { fetchList: state.fetchList };
}, (dispatch) => {
    return { fetchListAction: bindActionCreators(actions, dispatch)};
})(Home);