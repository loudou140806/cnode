import React, { Component } from 'react';

// 消息内容
class Content extends Component {
    render() {
        var list = this.props.list;
        return (
            <div className="msg-box">
                <ul className="list">
                    {
                        list.map((item, index) => {
                            var {type, author, topic, reply, has_read} = item;
                            var content = null;

                            if (type == 'at') {
                                content = <div>在话题<NavLink to={`/topic/${topic.id}`}>{topic.title}</NavLink>中 @了你</div>;
                            } else {
                                content = <div>回复你了的话题<NavLink to={`/topic/${topic.id}`}>{topic.title}</NavLink></div>
                            }
                            return (
                                <li data-flex="box:first" key={index}>
                                    <NavLink className="user" to={`/user/${author.loginname}`}>
                                        <UserHeadImg url={author.avatar_url} />
                                    </NavLink>
                                    <div>
                                        <div className="name">{author.loginname}<time>{Tool.formatDate(reply.create_at)}</time></div>
                                        <div data-flex="box:first">
                                            <div data-flex="cross:center"><div className={`dian-${has_read}`}></div></div>
                                            {content}
                                        </div>
                                    </div>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        );
    }
}

export default Content;