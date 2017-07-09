import React from 'react';
import './index.less';
 
class Loading extends React.Component {
    render() {
        let {loadAnimation, loadMsg} = this.props;
        return (
            <div className={'data-load data-load-' + loadAnimation}>
                {loadAnimation ? <div className="msg">{loadMsg}</div> : null }
            </div>
        );
    }
}
Loading.defaultProps = {
    loadAnimation: true, //默认显示加载动画
    loadMsg: '正在加载中'
}
    
export default Loading;