/**
 * Created by binwang on 17/8/21.
 */

export default
    [{
        action: 'save',
        method: 'post',
        url: (payload) => `/api/entitymanager`
    }, {
        action: 'update',
        method: 'put',
        url: (payload) => `/api/entitymanager`
    }, {
        action: 'delete',
        method: 'delete',
        url: (payload) => `/api/entitymanager`
    }, {
        action: 'get',
        method: "get",
        url: (payload) => `/api/entitymanager/${payload.id}`
    }, {
        action: 'list',
        method: "get",
        url: (payload) => '/api/entitymanager'
    }];
