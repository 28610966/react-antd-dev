/**
 * Created by ${user} on ${date}.
 */

export default [{
        action: 'save',
        method: 'post',
        url: (payload) => `/api/org`
    }, {
        action: 'update',
        method: 'put',
        url: (payload) => `/api/org`
    }, {
        action: 'delete',
        method: 'delete',
        url: (payload) => `/api/org`
    }, {
        action: 'get',
        method: "get",
        url: (payload) => `/api/org/${payload.id}`
    }, {
        action: 'list',
        method: "get",
        url: (payload) => '/api/org'
    }];
