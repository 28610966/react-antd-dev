/**
 * Created by ${user} on ${date}.
 */

export default [{
        action: 'save',
        method: 'post',
        url: (payload) => `/api/servergroup`
    }, {
        action: 'update',
        method: 'put',
        url: (payload) => `/api/servergroup`
    }, {
        action: 'delete',
        method: 'delete',
        url: (payload) => `/api/servergroup`
    }, {
        action: 'get',
        method: "get",
        url: (payload) => `/api/servergroup/${payload.id}`
    }, {
        action: 'list',
        method: "get",
        url: (payload) => '/api/servergroup'
    }];
