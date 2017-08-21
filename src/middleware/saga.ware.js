/**
 * Created by bin.wang on 2017/4/5.
 */

import {fork, put} from 'redux-saga/effects';
import {takeEvery, takeLatest} from 'redux-saga';
import {fetch} from '../util/fetch.client';
import NProgress from 'nprogress';
import _ from 'lodash';

export function buildRoot(options) {

    const sagaArr = [];
    _.forEach(options, opt => {
        if (opt.action instanceof Array) {
            _.forEach(opt.action, saga => {
                saga.action = `${opt.name}.${saga.action}`;
                if(!!saga.url)
                    sagaArr.push(createSaga(saga));
            })
        } else {
            // sagaArr.push(opt);
        }
    })

    return function*() {
        for (let saga of sagaArr) {
            yield fork(saga);
        }
    }
}

function bodyHandler(data, type, method) {
    try {
        if (method !== 'get' && data) {
            if (type === 'json') {
                return JSON.stringify(data);
            } else if (type === 'form') {
                let pairs = [];
                for (let key of data) {
                    pairs.push(key + '=' + data[key]);
                }
                return pairs.join('&');
            }
        }
    } catch (e) {
        return {success: false, errorMsg: e};
    }
    return data;
}

export function createSaga(item) {
    return function*() {
        let take = item.takeEvery ? takeEvery : takeLatest;
        console.log(item.action);
        yield take(item.action, function*({payload}) {
            let result;
            NProgress.start();
            try {
                let type = item.type || 'json';
                let bodyParser = item.body || bodyHandler;
                result = yield fetch(createUrl(item, payload), createOptions(item.method, type, item.headers, bodyParser(payload, type, item.method)));
                if (result && result.success) {
                    yield put({type: `${item.action}_SUCCESS`, loading: false, result: result.content, payload})
                } else {
                    yield put({type: `${item.action}_FAIL`, loading: false, error: result.errorMsg, payload})
                }
                NProgress.done();
            } catch (error) {
                console.error(error);
                NProgress.done();
            }
        });
    }
}

function createUrl(item, payload) {
    if (item.method === 'get') {
        let params = _.keys(payload).map(k => {
            if (_.isNull(payload[k]) || _.isUndefined(payload[k]) || _.isEqual(payload[k], '')) {
                return null;
            } else {
                return k + "=" + payload[k]
            }
        }).filter(m => m !== null).join("&");
        let s = item.url(payload) + ((params === "") ? "" : ("?" + params));
        if (process.env.NODE_ENV === `development`)
            console.log(s);
        // return item.url(payload);
        return s;
    } else {
        return item.url(payload);
    }
}

function createOptions(method, type, extHeaders, payload) {
    let options = {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': type === 'json' ? 'application/json' : 'application/x-www-form-urlencoded'
        }
    };
    options.headers = Object.assign(options.headers, extHeaders || {});
    if (method !== 'get') {
        options.body = payload;
    }
    return options;
}
