import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';
import fetchActions from '../../actions/fetchList';
import ListItem from './listItem';
import Loading from '../../components/loading';

class List extends React.Component {
    render(){
        const { fetchList } = this.props;
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

export default List;
