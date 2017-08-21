/**
 * Created by binwang on 17/8/21.
 */

import createReducer from '@/util/createReducer';
export default
    [{
        action: 'save',
        method: 'post',
        url: (payload) => `/api/moduleeditor`
    }, {
        action: 'update',
        method: 'put',
        url: (payload) => `/api/moduleeditor`
    }, {
        action: 'delete',
        method: 'delete',
        url: (payload) => `/api/moduleeditor`
    }, {
        action: 'get',
        method: "get",
        url: (payload) => `/api/moduleeditor/${payload.id}`
    }, {
        action: 'list',
        method: "get",
        url: (payload) => '/api/moduleeditor'
    }];

