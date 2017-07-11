import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import queryString from 'query-string';
import actions from '../../actions';
import _style from '../../style/style.less';
import './index.less';
import Nav from './nav';
import List from './list';

class Home extends Component {
    constructor(props){
        super(props);
        this.handleScroll = (e) => {
            const indexList = document.querySelector('.index-list');
            if(!indexList)return;
            const scrollTop = window.scrollY;
            const listHeight = indexList.clientHeight - 80;
            const containerHeight = window.outerHeight;
            const { page, limit, mdrender, isFetching } = this.props.state;
            const tab = queryString.parse(this.props.location.search).tab || 'all';
            if(scrollTop > (listHeight - containerHeight -30)) {
                if(isFetching) return;
                this.props.actions.fetchList('/api/v1/topics', {
                    tab: tab,
                    limit,
                    page,
                    mdrender
                });
            }
        };
        this.changeTab = (tab) => {
            const { limit, mdrender } = this.props.state;
            let page = this.props.state.page;
            if( tab !== this.props.state.tab ) {
                page = 1;
            }
            this.props.actions.fetchList('/api/v1/topics', {
                tab: tab || 'all',
                limit,
                page: page,
                mdrender
            });
            this.setState(this.props.state);
        }
    }
    componentDidMount() {
        const scroll = window.addEventListener('scroll', this.handleScroll);
        const { page, limit, mdrender } = this.props.state;
        this.props.actions.fetchList('/api/v1/topics', {
            tab: queryString.parse(this.props.location.search).tab || 'all',
            limit,
            page,
            mdrender
        });
    }
    componentUnMount() {
        console.log('unmount HOME')
        window.removeEventListener('scroll', scroll);
    }
    render(){
        const tab = queryString.parse(this.props.location.search).tab || 'all';
        const { state } = this.props;
        return (
            <div>
                <Nav tab={tab} changeTab={this.changeTab} {...this.props}/>
                <List key={tab} data={state.lists} isFetching={state.isFetching}/>
            </div>
        );
    }
}

export default connect( state => {
    return { state: state.fetchList };
}, (dispatch) => {
    return { actions: bindActionCreators(actions, dispatch)};
})(Home);