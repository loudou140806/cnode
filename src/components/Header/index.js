import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './index.less';

class Header extends Component {
    render() {
        const {leftIcon, leftClick, rightTo, rightIcon, rightClick, title } = this.props;
        let left = null;
        if(leftIcon){
            left = (
                <a onClick={leftClick} className='left'>
                    <i className={'iconfont icon-' + leftIcon }></i>                        
                </a>
            )
        }
        let right = null;
        if (rightTo && rightIcon) {
            right = (
                <NavLink to={rightTo} className='right'>
                    <i className={'iconfont icon-' + rightIcon}></i>
                </NavLink>
            );
        } else if (rightClick && rightIcon) {
            right = (
                <a onClick={rightClick} className='right'>
                    <i className={'iconfont icon-' + rightIcon}></i>
                </a>
            );
        }
        return (
            <div className="topic-head">
                {left}
                <h3 className="title">{title}</h3>
                {right}
            </div>
        );
    }
}

export default Header;
