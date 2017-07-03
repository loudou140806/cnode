import React from 'react';
import ReactLoading from 'react-loading';
 
const Example = ({ type, color }) => (
    <div data-flex="main:center cross:center">
        <ReactLoading width="50px" type={type} color={color} />                
    </div>
);
export default Example;