/**
 * Created by ${user} on ${date}.
 */

export default [{
        action: 'save',
        method: 'post',
        url: (payload) => `/api/server`
    }, {
        action: 'update',
        method: 'put',
        url: (payload) => `/api/server`
    }, {
        action: 'delete',
        method: 'delete',
        url: (payload) => `/api/server`
    }, {
        action: 'get',
        method: "get",
        url: (payload) => `/api/server/${payload.id}`
    }, {
        action: 'list',
        method: "get",
        url: (payload) => '/api/server'
    }];
