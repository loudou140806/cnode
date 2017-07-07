import { Tool } from '../tool';
import fetch from 'isomorphic-fetch';

let actions = {
    fetchTopic: function(options) {
        return function(dispatch, getState) {
            dispatch(actions.beginfetchTopic());
            const state = getState().fetchTopic;
            const url = Tool.setUrlParams(options.url, options.params);
            fetch(url)
                .then(res => {
                    if(res.status != 200) {
                        dispatch(actions.failfetchTopic(res.statusText));
                    }
                    if(res.ok) {
                        res.json().then(function(data) {
                            dispatch(actions.donefetchTopic(data.data));
                        });
                    }
                }).catch(e => {
                dispatch(actions.failfetchTopic(e.statusText));
            });

        }
    },

    beginfetchTopic: () => ({
        type: 'BEGIN_FETCH_LIST'
    }),

    donefetchTopic: data => ({
        type: 'DONE_FETCH_LIST',
        payload: data
    }),

    failfetchTopic: errMsg => ({
        type: 'FAIL_FETCH_LIST',
        error: new Error(errMsg)
    })
};

export default actions;