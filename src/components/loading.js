import React from 'react';
import ReactLoading from 'react-loading';
 
class Loading extends React.Component {
    render() {
        return (
            <div data-flex="main:center cross:center">
                <ReactLoading width="50px" type={this.props.type} color={this.props.color} />                
            </div>
        );
    }
}
    
export default Loading;