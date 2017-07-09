import React from 'react';
import { NavLink } from 'react-router-dom';

class TipMsgSignin extends React.Component {
    render() {
        return (
            <div className="tip-msg-signin">
                你还未登录，请先<NavLink to="/login">登录</NavLink>
            </div>
        );
    }
}

export default TipMsgSignin;
