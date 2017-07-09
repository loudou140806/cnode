import React, { Component } from 'react';
import NavLink from 'react-router-dom';
import　{ UserHeadImg, ReplyBox } from '../../components';
import { Tool } from '../../tool';
// 回复列表

class ReList extends Component {
    constructor(props) {
        super(props);

        // 验证回复项目是否点赞

        this.isUp = (arr) => {
            var id = this.props.User ? this.props.User.id : '';
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === id) return true;
            }
            return false;
        }

    }
    render() {
        var accesstoken = this.props.User ? this.props.User.accesstoken : '';
        return (
            <ul className="re-list">
                {
                    this.props.list.map((item, index) => {
                        var {id, content, author, ups, create_at, display = 'none'} = item;
                        var at = new Date(create_at);
                        var upState = this.isUp(ups);
                        var createMarkup = () => {
                            return {
                                __html: content
                            };
                        }


                        return (
                            <li key={index} data-flex>
                                <div className="headimg" data-flex-box="0">
                                    <UserHeadImg url={author.avatar_url} />
                                </div>
                                <div className="main" data-flex-box="1">
                                    <div data-flex="main:justify">
                                        {/*<NavLink to={'/Mine/' + author.loginname} className="name">{author.loginname}</NavLink>*/}
                                        <time data-flex-box="1">{Tool.formatDate(create_at)}</time>
                                        <div className="lou">#{++index}</div>
                                    </div>
                                    <div className="content markdown-body" dangerouslySetInnerHTML={createMarkup()}></div>
                                    <div className="bottom" data-flex="main:right">
                                        <div className={`font font-${upState}`} onClick={() => { this.props.clickZan(id, index, author.loginname); } }>
                                            <i className="iconfont icon-dianzan "></i>
                                            <em>{ups.length ? ups.length : ''}</em>
                                        </div>
                                        <div className="font" onClick={() => { this.props.showReplyBox(index) } }>
                                            <i className="iconfont icon-huifu"></i>
                                        </div>
                                    </div>
                                    {/*<ReplyBox placeholder={`@${author.loginname}`} reLoadData={this.props.reLoadData} display={display} loginname={author.loginname} data={{ accesstoken, id: this.props.id, reply_id: id }} />*/}
                                </div>
                            </li>
                        );
                    })
                }
            </ul>
        );
    }
}

export default ReList;