import React from 'react';

class List extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div>
               <h2>{this.props.title}</h2> 
            </div>
        )
    }
}

export default List;
