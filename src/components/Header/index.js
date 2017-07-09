import React, { Component } from 'react';
import './index.less';

class Header extends Component {
    render() {
        const {leftIcon, leftClick, rightIcon, rightClick, title } = this.props;
        return (
            <div className="topic-head">
                {leftIcon ? 
                    <a onClick={leftClick} className='left'>
                        <i className={'iconfont icon-' + leftIcon }></i>                        
                    </a> : null
                }
                <h3 className="title">{title}</h3>
                {rightIcon ? 
                    <a onClick={rightClick} className='right'>
                        <i className= {'iconfont icon-' + rightIcon}></i>                        
                    </a> : null
                }
            </div>
        );
    }
}

export default Header;
