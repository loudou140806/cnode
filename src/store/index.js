import { createStore, combineReducers, applyMiddleware } from 'redux';
import Reducer from '../reducer';
import thunk from 'redux-thunk';

var store = createStore(
    combineReducers(Reducer),
    applyMiddleware(thunk)
);

export default store;