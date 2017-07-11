import React, { Component } from 'react';
import PropTypes from 'react-dom';
import { Tool } from '../../tool';

//回复框

class ReplyBox extends Component {
    constructor(props) {
        super(props);
        this.state = { btnname: '回复' }

        // 提交回复
        this.submit = () => {
            this.state = { btnname: '提交中...' }
            var data = this.props.data;
            console.log(data);
            if (data.reply_id) {
                data.content = `[@${this.props.loginname}](/user/${this.props.loginname}) ${this.refs.content.value}`;
            } else {
                data.content = this.refs.content.value;
            }
            if (data.content == '') {
                return alert('回复内容不能为空！');
            }
            data.content += '\n\r</br>-----来自<a href="https://loudou140806.github.io/cnode/" target="_blank">cnode手机版</a>';
            Tool.post(`/api/v1//topic/${data.id}/replies`, data, (res) => {
                this.setState({ btnname: '回复成功，刷新页面中..' });
                this.refs.content.value = '';
                Tool.get(`/api/v1//topic/${data.id}`, {}, (res) => {
                    this.props.reLoadData(res.data); //刷新页面
                    this.setState({ btnname: '回复' });
                }, () => {
                    this.state = { btnname: '刷新失败，请手动刷新试试' }
                });

            }, (res) => {
                this.setState({ btnname: '回复失败' });
            });
        }

    }
    render() {
        return (
            <div className="reply-box" style={{ display: this.props.display }}>
                <div className="text"><textarea ref="content" placeholder={this.props.placeholder}></textarea></div>
                <div data-flex="main:right">
                    <button className="btn" onClick={this.submit}>{this.state.btnname}</button>
                </div>
            </div>
        );
    }
}

ReplyBox.defaultProps = {
    display: 'block',
    placeholder: '回复支持Markdown语法,请注意标记代码'
};

export default ReplyBox;