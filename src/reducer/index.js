//首页
function fetchList(state = {isFetching: false, lists: [], page: 1, nextBtn: true, limit: 10, mdrender: false}, action) {
  let newState;
  switch (action.type) {
    case 'BEGIN_FETCH_LIST':
      if(state.isFetching) return state;
      newState = Object.assign({}, state, {
          isFetching: true
      });
      return newState;
    case 'FAIL_FETCH_LIST':
      newState = Object.assign({}, state, {
        isFetching: false
      })
      return newState;
    case 'DONE_FETCH_LIST':
      newState = Object.assign({}, state, {
        isFetching: false,
        lists: state.lists.concat(action.payload),
        page: state.page + 1
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
function login(state = {}, action){
  let newState;
  switch (action.type) {
    case 'LOGIN_IN_SUCCESS':
      newState = Object.assign({}, state, {
        loginname: action.payload.loginname, 
        id: action.payload.id, 
        avatar_url: action.payload.avatar_url,
        accesstoken: action.payload.accesstoken
      });
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
  User: login
};