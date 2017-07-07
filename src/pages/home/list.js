import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Loading from '../../components/loading';
import { TabIcon, UserHeadImg } from '../../components';
import { Tool } from '../../tool';

class List extends Component {
    render(){
        console.log('list')
        const { data, isFetching } = this.props;
        return (
            <ul className="index-list">
                {isFetching ? <Loading type='bubbles' color='#80bd01'/> :
                    data.map((item, index) => {
                        return <ListItem key={item.id} {...item} />
                    })
                }
            </ul>
        );
    }
}

class ListItem extends Component {
    shouldComponentUpdate(nextProps) {
        return nextProps.state != this.props.state;
    }
    render() {
        let {id, title, author, visit_count, reply_count, create_at, last_reply_at} = this.props;
        return (
            <li>
                <NavLink to={`/topic/${id}`}>
                    <div data-flex="box:first">
                        <div className="font" data-flex="cross:center"><TabIcon {...this.props} /></div>
                        <h3 className="tit">{title}</h3>
                    </div>
                    <div className="bottom" data-flex="box:first">
                        <div className="author" data-flex="cross:center">
                            <UserHeadImg url={author.avatar_url} />
                        </div>
                        <div className="con" data-flex="dir:top main:center">
                            <p data-flex="cross:center box:last">
                                <span className="name">{author.loginname}</span>
                                <span className="count">{reply_count}/{visit_count}</span>
                            </p>
                            <p data-flex="cross:center box:last">
                                <time className="create">{Tool.formatDate(create_at)}</time>
                                <time className="re">{Tool.formatDate(last_reply_at)}</time>
                            </p>
                        </div>
                    </div>
                </NavLink>
            </li>
        );
    }
}

export default List;