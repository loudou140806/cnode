import { Tool } from '../tool';

let actions = {
    fetchList: function() {
        return function(dispatch, getState) {
            dispatch(actions.beginFetchList());

            fetch('/api/v1/topics')
                .then(res => {
                    if(res.status != 200) {
                        dispatch(actions.failFetchList(res.statusText));
                    }
                    if(res.ok) {
                        res.json().then(function(data) {
                            console.log(data);
                            dispatch(actions.doneFetchList(data.data));
                        });
                    }
                }).catch(e => {
                dispatch(actions.failFetchList(e.statusText));
            });

        }
    },

    beginFetchList: () => ({
        type: 'BEGIN_FETCH_LIST'
    }),

    doneFetchList: data => ({
        type: 'DONE_FETCH_LIST',
        payload: data
    }),

    failFetchList: errMsg => ({
        type: 'FAIL_FETCH_LIST',
        error: new Error(errMsg)
    })

};

export default actions;