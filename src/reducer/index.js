import {Tool} from '../tool';
import 'es6-object-assign/auto';
//首页
function fetchList(state = {isFetching: false, lists: [], page: 1, nextBtn: true, limit: 10, mdrender: false, tab: 'all'}, action) {
  let newState, lists, page, tab;
  switch (action.type) {
    case 'BEGIN_FETCH_LIST':
      if(state.isFetching) return state;
      if(state.tab !== action.tab){
        lists = [];
        tab = action.tab;
      }else {
        lists = state.lists;
      }
      newState = Object.assign({}, state, {
          isFetching: true,
          lists: lists,
          tab: tab || state.tab
      });
      return newState;
    case 'FAIL_FETCH_LIST':
      newState = Object.assign({}, state, {
        isFetching: false
      })
      return newState;
    case 'DONE_FETCH_LIST':
      if(state.tab !== action.tab){
        lists = action.payload;
        page = 2;
        tab = action.tab;
      }else {
        lists = state.lists.concat(action.payload);
        page = state.page + 1;
      }
      newState = Object.assign({}, state, {
        isFetching: false,
        lists: lists,
        page: page,
        tab: tab || state.tab
      })
      return newState;
    default:
      return state
  }
}
//详情
function fetchTopic(state = {isFetching: false, data:null}, action){
  let newState;
  switch (action.type) {
    case 'BEGIN_FETCH_TOPIC':
      newState = Object.assign({}, state, {
        isFetching: true
      });
      return newState;
    case 'DONE_FETCH_TOPIC':
      newState = Object.assign({}, state, {
        isFetching: false,
        data: action.payload
      })
      return newState;
    default:
      return state
  }
}
//发表
function createTopic(state = {isFetching: false, data:null}, action){
  let newState;
  switch (action.type) {
    case 'BEGIN_CREATE_TOPIC':
      newState = Object.assign({}, state, {
        isFetching: true
      });
      return newState;
    case 'DONE_CREATE_TOPIC':
      newState = Object.assign({}, state, {
        isFetching: false,
        data: action.payload
      })
      return newState;
    default:
      return state
  }
}

//消息
function fetchMessage(state = {isFetching: false, data:null}, action){
  let newState;
  switch (action.type) {
    case 'BEGIN_FETCH_MESSAGE':
      newState = Object.assign({}, state, {
        isFetching: true
      });
      return newState;
    case 'DONE_FETCH_MESSAGE':
      newState = Object.assign({}, state, {
        isFetching: false,
        data: action.payload
      })
      return newState;
    default:
      return state
  }
}

//登录
// console.log(Tool.getOrSetItem('user'));
function login(state = Tool.getOrSetItem('user'), action){
  let newState;
  switch (action.type) {
    case 'LOGIN_IN_SUCCESS':
      Tool.getOrSetItem('user', action.payload);
      newState = action.payload;
      return newState;
    case 'LOGIN_OUT':
      Tool.removeItem('user');
      return null;
    default:
      return state
  }
}

//个人中心
function fetchDetail(state = {isFetching: false, data:null}, action){
  let newState;
  switch (action.type) {
    case 'BEGIN_FETCH_DETAIL':
      newState = Object.assign({}, state, {
        isFetching: true
      });
      return newState;
    case 'DONE_FETCH_DETAIL':
      newState = Object.assign({}, state, {
        isFetching: false,
        data: action.payload
      })
      return newState;
    default:
      return state
  }
}


export default {
  fetchList: fetchList,
  fetchTopic: fetchTopic,
  createTopic: createTopic,
  fetchMessage: fetchMessage,
  User: login,
  fetchDetail: fetchDetail
};