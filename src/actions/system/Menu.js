/**
 * Created by binwang on 17/8/21.
 */

import createReducer from '@/util/createReducer';
export default
    [{
        action: 'save',
        method: 'post',
        url: (payload) => `/api/menu`
    }, {
        action: 'update',
        method: 'put',
        url: (payload) => `/api/menu`
    }, {
        action: 'delete',
        method: 'delete',
        url: (payload) => `/api/menu`
    }, {
        action: 'get',
        method: "get",
        url: (payload) => `/api/menu/${payload.id}`
    }, {
        action: 'list',
        method: "get",
        url: (payload) => '/api/menu'
    }];

