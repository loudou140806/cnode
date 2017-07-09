import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../../actions';
import { Tool } from '../../tool';
import NewTopic from './NewTopic';
import './index.less';
import { Loading, TipMsgSignin, Header } from '../../components';

class Create extends Component {
    constructor(props) {
        super(props);

        // 初始化组件状态
        this.state = {
            title: '',
            tab: '',
            content: '',
            accesstoken: this.props.User ? this.props.User.accesstoken : ''
        };
        console.log(this.props.User)
        this.postState = false;
        // 发表主题
        this.rightClick = () => {
            var {state} = this;
            if (this.postState) return false;

            if (!state.tab) {
                return alert('请选择发表类型');
            } else if (state.title.length < 10) {
                return alert('标题字数10字以上');
            } else if (state.content.length < 30) {
                return alert('内容字数30字以上');
            }
            this.postState = true;
            Tool.post('/api/v1/topics', this.state, (res) => {
                if (res.success) {
                    this.context.router.history.push({
                        pathname: '/topic/' + res.topic_id
                    });
                } else {
                    alert('发表失败');
                    this.postState = false;
                }
            }, () => {
                alert('发表失败');
                this.postState = false;
            });

        }

        //监听用户选择发表类型

        this.tabInput = (e) => {
            this.state.tab = e.target.value;
        }

        // 监听用户输入标题
        this.titleInput = (e) => {
            this.state.title = e.target.value;
        }

        //监听用户输入内容
        this.contentInput = (e) => {
            this.state.content = e.target.value;
        }

    }
    render() {
        var { User } = this.props;
        var headerSet = {};
        var main = null;
        if (!User) {
            main = <TipMsgSignin />
        } else {
            main = <NewTopic {...this.state} tabInput={this.tabInput} titleInput={this.titleInput} contentInput={this.contentInput} />
            headerSet = {
                rightIcon: 'fabu',
                rightClick: this.rightClick
            };
        }
        return (
            <div>
                <Header title="发表主题" {...headerSet} />
                <div style={{marginTop: '60px'}}>
                    {main}
                </div>
            </div>
        );
    }
    shouldComponentUpdate() {
        return false;
    }
}

Create.contextTypes = {
    router: PropTypes.object.isRequired
}



export default connect(
    state => { 
        return { User: state.User } 
    }, dispatch => {
        return { createAction: bindActionCreators(actions, dispatch) }
    }
)(Create); //连接redux