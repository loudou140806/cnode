import React, { Component } from 'react';
import { NavLink } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Loading, Header } from '../../components';
import Article from './Article';
import actions from '../../actions';
import { Tool } from '../../tool';
import './index.less';

class Topic extends Component {
    constructor(props) {
        super(props);
        //点赞或取消赞
        this.clickZan = (id, index, loginname) => {
            var accesstoken = this.props.User ? this.props.User.accesstoken : '';
            var uid = this.props.User ? this.props.User.id : '';
            if (!accesstoken) {
                return this.props.history.push({ pathname: '/login' }); //跳转到登录
            } else if (this.props.User.loginname === loginname) {
                return alert('你不能给自己点赞');
            }
            Tool.post(`/api/v1/reply/${id}/ups`, { accesstoken }, (res) => {
                var ups = this.props.state.data.replies[index - 1].ups;
                if (res.action == 'down') { //取消点赞
                    for (let i = 0; i < ups.length; i++) {
                        if (ups[i] === uid) {
                            ups.splice(i, 1);
                        };
                    }
                } else {
                    ups.push(uid);
                }
                this.setState(this.props.state);
            });
        }

        // 显示回复框
        this.showReplyBox = (index) => {
            var accesstoken = this.props.User ? this.props.User.accesstoken : '';
            if (!accesstoken) {
                return this.props.history.push({ pathname: '/signin' }); //跳转到登录
            }
            --index;
            if (this.props.state.data.replies[index].display === 'block') {
                this.props.state.data.replies[index].display = 'none';
            } else {
                this.props.state.data.replies[index].display = 'block';
            }

            this.setState(this.props.state);
        }
        // 回复成功后，重新加载数据
        this.reLoadData = (data) => {
            this.props.state.data = data;
            this.setState(this.props.state);
        }
    }
    componentDidMount() {
        const url = 'api/v1/' + this.props.location.pathname;
        this.props.actions.fetchTopic(url, {
            mdrender: true
        });
    }
    render() {
        var {data, isFetching, id} = this.props.state;
        console.log(this.props.state);
        var main = data ? <Article {...this.props} reLoadData={this.reLoadData} clickZan={this.clickZan} showReplyBox={this.showReplyBox} /> : <Loading loadAnimation={isFetching} />;
        var headerSet = {
            leftIcon: 'fanhui',
            leftClick: this.props.history.goBack
        };
        return (
            <div>
                <Header {...this.props} {...headerSet} title="详情"/>
                <div style={{marginTop: "60px"}}>
                    {main}
                </div>
            </div>
        );
    }
}

export default connect(state => {
    return { state: state.fetchTopic,User: state.User }
}, dispatch => {
    return { actions: bindActionCreators(actions, dispatch) }
})(Topic);