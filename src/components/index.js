import React from 'react';
import {Route} from 'react-router';
import One from './one';

function App({match}) {
    return (
        <div>
            App
            <Route path={`${match.url}`} component={One}></Route>
        </div>
    );
}

export default App;
