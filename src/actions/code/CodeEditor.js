/**
 * Created by binwang on 17/8/21.
 */

import createReducer from '@/util/createReducer';
export default
    [{
        action: 'save',
        method: 'post',
        url: (payload) => `/api/codeeditor`
    }, {
        action: 'update',
        method: 'put',
        url: (payload) => `/api/codeeditor`
    }, {
        action: 'delete',
        method: 'delete',
        url: (payload) => `/api/codeeditor`
    }, {
        action: 'get',
        method: "get",
        url: (payload) => `/api/codeeditor`
    }, {
        action: 'list',
        method: "get",
        url: (payload) => '/api/codeeditor'
    }];

