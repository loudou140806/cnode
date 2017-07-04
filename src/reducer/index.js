const initialState = {
    page: 1, 
    tab: 'all',
    nextBtn: true, 
    limit: 10, 
    mdrender: false, 
    lists: [],
    isFetching: false
};

function fetchList(state = initialState, action) {
  let newState;
  switch (action.type) {
    case 'BEGIN_FETCH_LIST':
      if(state.isFetching) return state;
      newState = Object.assign({}, state, {
          isFetching: true
      });
      return newState;
    case 'DONE_FETCH_LIST':
      newState = Object.assign({}, state, {
        isFetching: false,
        lists: action.payload,
      })
      return newState;
    default:
      return state
  }
}

export default {
  fetchList: fetchList
};