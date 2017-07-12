import { Tool } from '../tool';
import fetch from 'isomorphic-fetch';
const target = process.env.NODE_ENV !== 'production' ? '' : 'https://cnodejs.org'; //目标网站

let actions = {
    //首页
    fetchList: function(url, options) {
        return function(dispatch, getState) {
            dispatch(actions.beginFetchList(options.tab));
            const address = target + Tool.setUrlParams(url, options);
            fetch(address)
                .then(res => {
                    if(res.status != 200) {
                        dispatch(actions.failFetchList(res.statusText));
                    }
                    if(res.ok) {
                        res.json().then(function(data) {
                            dispatch(actions.doneFetchList(data.data, options.tab));
                        });
                    }
                }).catch(e => {
                dispatch(actions.failFetchList(e.statusText));
            });

        }
    },

    beginFetchList: tab => ({
        type: 'BEGIN_FETCH_LIST',
        tab: tab
    }),

    doneFetchList: (data, tab) => ({
        type: 'DONE_FETCH_LIST',
        payload: data,
        tab: tab
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
            const address = target + Tool.setUrlParams(url, options);
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
            const address = target + Tool.setUrlParams(url, options);
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
            const address = target + Tool.setUrlParams(url, options);
            fetch(address)
                .then(res => {
                    if(res.status != 200) {
                        dispatch(actions.failFetchMessage(res.statusText));
                    }
                    if(res.ok) {
                        res.json().then(function(data) {
                            console.log(data.data);
                            dispatch(actions.doneFetchMessage(data.data));
                        });
                    }
                }).catch(e => {
                dispatch(actions.failFetchMessage(e.statusText));
            });

        }
    },

    beginFetchMessage: () => ({
        type: 'BEGIN_FETCH_MESSAGE'
    }),

    doneFetchMessage: data => ({
        type: 'DONE_FETCH_MESSAGE',
        payload: data
    }),

    failFetchMessage: errMsg => ({
        type: 'FAIL_FETCH_MESSAGE',
        error: new Error(errMsg)
    }),

    //登录
    loginIn: (data) => ({
        type: 'LOGIN_IN_SUCCESS',
        payload: data
    }),

    //退出登录
    loginOut: () => ({
        type: 'LOGIN_OUT'
    }),

    //用户详情
    fetchDetail: function(url, options) {
        return function(dispatch, getState) {
            dispatch(actions.beginFetchDetail());
            const address = target + Tool.setUrlParams(url, options);
            fetch(address)
                .then(res => {
                    if(res.status != 200) {
                        dispatch(actions.failFetchDetail(res.statusText));
                    }
                    if(res.ok) {
                        res.json().then(function(data) {
                            // console.log(data.data);
                            dispatch(actions.doneFetchDetail(data.data));
                        });
                    }
                }).catch(e => {
                dispatch(actions.failFetchDetail(e.statusText));
            });

        }
    },

    beginFetchDetail: () => ({
        type: 'BEGIN_FETCH_DETAIL'
    }),

    doneFetchDetail: data => ({
        type: 'DONE_FETCH_DETAIL',
        payload: data
    }),

    failFetchDetail: errMsg => ({
        type: 'FAIL_FETCH_DETAIL',
        error: new Error(errMsg)
    }),
    
}

export default actions;