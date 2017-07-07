import React, { Component } from 'react';

class Header extends Component {
    constructor(props){
        super(props);
        this.back = this.back.bind(this);
    }
    back() {
        this.props.history.goBack();
    }
    render() {
        return (
            <div className="topic-head">
                <a onClick={this.back}>
                    <i className="iconfont icon-fanhui"></i>                        
                </a>
                <h3 className="title">详情</h3>
            </div>
        );
    }
}

export default Header;
