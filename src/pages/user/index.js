import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Loading, Header, UserHeadImg } from '../../components';
import actions from '../../actions';
import { Tool } from '../../tool';

class UserView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 0
        };
        this.tab = (tabIndex) => {
            this.setState({
               tabIndex: tabIndex
            }) ;
        }
        this.signOut = () => {
            this.props.history.push()
        }
        const url = '/api/v1/user/'+ this.props.User.loginname;
        this.props.actions.fetchDetail(url, {});
    }
    render() {
        console.log(this.props);
        var {data, isFetching, tabIndex} = this.props.state;
        let { User, match} = this.props;
        let params = match.params;
        User = User || {};
        var main = data ? <Home data={data} tabIndex={tabIndex} tab={this.tab} tabIndex={this.state.tabIndex} /> : <Loading loadAnimation={isFetching} />;
        var title = params.loginname === User.loginname ? '个人中心' : params.loginname + '的个人中心';
        var leftIcon = params.loginname === User.loginname ? null : 'fanhui';
        var rightIcon = params.loginname === User.loginname ? 'tuichu' : null;
        return (
            <div>
                <Header title={title} leftIcon={leftIcon} rightIcon={rightIcon} rightTo='/login' />
                <div style={{marginTop: '60px'}}>
                    {main}
                </div>
            </div>
        );
    }
}


//  个人主页
class Home extends Component {
    render() {
        var {avatar_url, loginname, score, recent_topics, recent_replies, create_at} = this.props.data;
        var {tabIndex} = this.props;
        var arrOn = [];
        var arrDisplay = [];
        arrOn[tabIndex] = 'on';
        arrDisplay[tabIndex] = 'block';
        return (
            <div className="user-index">
                <div className="headimg" data-flex="dir:top main:center cross:center">
                    <UserHeadImg url={avatar_url} />
                    <div className="name">{loginname}</div>
                    <div className="score">积分：{score}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注册于：{Tool.formatDate(create_at)}</div>
                </div>
                <ul className="tab-nav" data-flex="box:mean">
                    <li onClick={() => { this.props.tab(0) } } className={arrOn[0]}>主题</li>
                    <li onClick={() => { this.props.tab(1) } } className={arrOn[1]}>回复</li>
                </ul>
                <HomeList list={recent_topics} display={arrDisplay[0]} />
                <HomeList list={recent_replies} display={arrDisplay[1]} />
            </div>
        );
    }
}

// 发布的主题和回复的主题列表
class HomeList extends Component {
    render() {
        var {list, display} = this.props;
        return (
            <ul className="list" style={{ display: display }}>
                {
                    list.map((item, index) => {
                        let {id, title, last_reply_at} = item;
                        return (
                            <li key={index}>
                                <NavLink data-flex="box:last" to={`/topic/${id}`}>
                                    <div className="tit">{title}</div>
                                    <time className>{Tool.formatDate(last_reply_at)}</time>
                                </NavLink>
                            </li>
                        );
                    })
                }
            </ul>
        );
    }
}
export default connect(state => {
    return { User: state.User, state: state.fetchDetail }
}, dispatch => {
    return { actions: bindActionCreators(actions, dispatch) }
})(UserView);