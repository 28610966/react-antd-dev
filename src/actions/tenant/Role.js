/**
 * Created by ${user} on ${date}.
 */

export default [{
        action: 'save',
        method: 'post',
        url: (payload) => `/api/role`
    }, {
        action: 'update',
        method: 'put',
        url: (payload) => `/api/role`
    }, {
        action: 'delete',
        method: 'delete',
        url: (payload) => `/api/role`
    }, {
        action: 'get',
        method: "get",
        url: (payload) => `/api/role/${payload.id}`
    }, {
        action: 'list',
        method: "get",
        url: (payload) => '/api/role'
    }];
