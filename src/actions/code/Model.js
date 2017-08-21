/**
 * Created by binwang on 17/8/21.
 */

import createReducer from '@/util/createReducer';
export default
    [{
        action: 'save',
        method: 'post',
        url: (payload) => `/api/model`
    }, {
        action: 'update',
        method: 'put',
        url: (payload) => `/api/model`
    }, {
        action: 'delete',
        method: 'delete',
        url: (payload) => `/api/model`
    }, {
        action: 'get',
        method: "get",
        url: (payload) => `/api/model/${payload.id}`
    }, {
        action: 'list',
        method: "get",
        url: (payload) => '/api/model'
    }];

