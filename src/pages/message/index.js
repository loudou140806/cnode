import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../../actions';
import { Tool } from '../../tool';
import Content from './Content';
import { Loading, Header, TipMsgSignin, UserHeadImg, NoData } from '../../components';

class Message extends Component {

    componentDidMount() {
        const url = 'api/v1/messages';
        const accesstoken = this.props.User.accesstoken;
        if(!accesstoken) return;
        this.props.messageAction.fetchMessage(url, {
            accesstoken: accesstoken,
            mdrender: true
        });
    }
    render() {
        var { data, isFetching, id, tabIndex } = this.props.state;
        var { User } = this.props;
        var main = null;
        if (!User) {
            main = <TipMsgSignin />
        } else if (!data) {
            main = <Loading loadAnimation={isFetching} />;
        } else {
            let {hasnot_read_messages, has_read_messages} = data;
            Array.prototype.push.apply(hasnot_read_messages, has_read_messages);
            if(hasnot_read_messages.length <= 0){
                main = <NoData />;
            }else{
                main = <Content list={hasnot_read_messages} />;
            }
            debugger;
        }
        return (
            <div>
                <Header title="消息" />
                <div style={{marginTop: '60px'}}>
                    {main}
                </div>
            </div>
        );
    }
}

export default connect(
    state => {
        return { state: state.fetchMessage, User: state.User }
    }, dispatch => {
        return { messageAction: bindActionCreators(actions, dispatch) }
    }
)(Message);