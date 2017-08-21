/**
 * Created by ${user} on ${date}.
 */

export default [{
        action: 'save',
        method: 'post',
        url: (payload) => `/api/tenant`
    }, {
        action: 'update',
        method: 'put',
        url: (payload) => `/api/tenant`
    }, {
        action: 'delete',
        method: 'delete',
        url: (payload) => `/api/tenant`
    }, {
        action: 'get',
        method: "get",
        url: (payload) => `/api/tenant/${payload.id}`
    }, {
        action: 'list',
        method: "get",
        url: (payload) => '/api/tenant'
    }];
