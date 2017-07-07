import React, { Component } from 'react';
import { NavLink } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from './header';
import Article from './article';
import fetchActions from '../../actions/fetchTopic';
import './index.less';

class Topic extends Component {
    render() {
        return (
            <div>
                <Header {...this.props} />
                <Article {...this.props} />                
            </div>
        );
    }
}

export default connect(state => {
    return { state: state.fetchTopic }
}, dispatch => {
    return { fetchTopicAction: bindActionCreators(fetchActions, dispatch) }
})(Topic);