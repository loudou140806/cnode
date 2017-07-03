import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';
import fetchActions from '../../actions/fetchList';
import ListItem from './listItem';
import Loading from '../../components/loading';

class List extends React.Component {
    render(){
        const { fetchList, actions } = this.props;
        if( __DEV__ ){
            console.log(fetchList.isFetching);
            console.log(actions);
            console.log(fetchList.lists);
        }
        actions.fetchList();
        return (
            <ul className="index-list">
                {fetchList.isFetching ? Loading({type: 'bubbles', color: '#80bd01'}) :
                    fetchList.lists.map((item, index) => {
                        return <ListItem key={item.id} {...item} />
                    })
                }
            </ul>
        );
    }
}

export default connect( state => {
    return { fetchList: state.fetchList };
}, dispatch => {
    return { actions: bindActionCreators(fetchActions, dispatch)};
})(List);
