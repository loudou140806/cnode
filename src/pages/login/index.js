import React, { Component} from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../../actions';
import { Tool } from '../../tool';
import './index.less';
import { Loading, Header, TipMsgSignin } from '../../components';

class Mine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            button: '登录'
        };
        this.signin = () => {
            var accesstoken = this.refs.accesstoken.value;
            if (!accesstoken) return alert('不能为空！');
            this.setState({ button: '登录中...' });
            Tool.post('/api/v1/accesstoken', { accesstoken }, (res) => {
                if (res.success) {
                    alert('登录成功');
                    res.accesstoken = accesstoken;
                    this.props.actions.loginIn(res);
                    this.context.router.history.push({
                        pathname: '/user/' + res.loginname
                    });
                } else {
                    alert('登录失败');
                    this.setState({ button: '登录' });
                }

            }, () => {
                alert('登录失败！');
                this.setState({ button: '登录' });
            });
        };
    }
    render() {
        console.log(this.props);
        return (
            <div>
                <Header title="登录" leftIcon="fanhui" leftClick={this.props.history.goBack}/>
                <div className="signin" data-flex="dir:top main:center cross:center" style={{marginTop:'60px'}}>
                    <div className="center">
                        <div className="text"><input ref="accesstoken" type="text" placeholder="Access Token" /></div>
                        <button className="btn" onClick={this.signin}>{this.state.button}</button>
                    </div>
                </div>
            </div>
        );
    }
}
Mine.contextTypes = {
    router: PropTypes.object
}


export default connect(
    state => { 
        return { User: state.User }
    },
    dispatch => { 
        return {
            actions: bindActionCreators(actions, dispatch)
        } 
    }
     )(Mine); //连接redux