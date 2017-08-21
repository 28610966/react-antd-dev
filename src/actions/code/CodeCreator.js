/**
 * Created by binwang on 17/8/21.
 */

import createReducer from '@/util/createReducer';
export default
    [{
        action: 'save',
        method: 'post',
        url: (payload) => `/api/codecreator`
    }, {
        action: 'update',
        method: 'put',
        url: (payload) => `/api/codecreator`
    }, {
        action: 'delete',
        method: 'delete',
        url: (payload) => `/api/codecreator`
    }, {
        action: 'get',
        method: "get",
        url: (payload) => `/api/codecreator/${payload.id}`
    }, {
        action: 'list',
        method: "get",
        url: (payload) => '/api/codecreator'
    }];

