import { Tool } from '../tool';
import fetch from 'isomorphic-fetch';

let actions = {
    //首页
    fetchList: function(url, options) {
        return function(dispatch, getState) {
            dispatch(actions.beginFetchList());
            const address = Tool.setUrlParams(url, options);
            fetch(address)
                .then(res => {
                    if(res.status != 200) {
                        dispatch(actions.failFetchList(res.statusText));
                    }
                    if(res.ok) {
                        res.json().then(function(data) {
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
    }),

    //详情页
    fetchTopic: function(url, options) {
        return function(dispatch, getState) {
            dispatch(actions.beginfetchTopic());
            const state = getState().fetchTopic;
            const address = Tool.setUrlParams(url, options);
            fetch(address)
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
        type: 'BEGIN_FETCH_TOPIC'
    }),

    donefetchTopic: data => ({
        type: 'DONE_FETCH_TOPIC',
        payload: data
    }),

    failfetchTopic: errMsg => ({
        type: 'FAIL_FETCH_TOPIC',
        error: new Error(errMsg)
    }),

    //发表
    createTopic: function(url, options) {
        return function(dispatch, getState) {
            dispatch(actions.beginCreateTopic());
            const address = Tool.setUrlParams(url, options);
            fetch(address)
                .then(res => {
                    if(res.status != 200) {
                        dispatch(actions.failCreateTopic(res.statusText));
                    }
                    if(res.ok) {
                        res.json().then(function(data) {
                            dispatch(actions.doneCreateTopic(data.data));
                        });
                    }
                }).catch(e => {
                dispatch(actions.failCreateTopic(e.statusText));
            });

        }
    },

    beginCreateTopic: () => ({
        type: 'BEGIN_CREATE_TOPIC'
    }),

    doneCreateTopic: data => ({
        type: 'DONE_CREATE_TOPIC',
        payload: data
    }),

    failCreateTopic: errMsg => ({
        type: 'FAIL_CREATE_TOPIC',
        error: new Error(errMsg)
    }),

    //消息
    fetchMessage: function(url, options) {
        return function(dispatch, getState) {
            dispatch(actions.beginFetchMessage());
            const address = Tool.setUrlParams(url, options);
            fetch(address)
                .then(res => {
                    if(res.status != 200) {
                        dispatch(actions.failFetchMessage(res.statusText));
                    }
                    if(res.ok) {
                        res.json().then(function(data) {
                            dispatch(actions.doneFetchMessage(data.data));
                        });
                    }
                }).catch(e => {
                dispatch(actions.failFetchMessage(e.statusText));
            });

        }
    },

    beginFetchMessage: () => ({
        type: 'BEGIN_CREATE_TOPIC'
    }),

    doneFetchMessage: data => ({
        type: 'DONE_CREATE_TOPIC',
        payload: data
    }),

    failFetchMessage: errMsg => ({
        type: 'FAIL_CREATE_TOPIC',
        error: new Error(errMsg)
    }),

    //登录
    loginIn: (data) => ({
        type: 'LOGIN_IN_SUCCESS',
        payload: data
    }),
    
}

export default actions;