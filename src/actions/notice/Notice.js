/**
 * Created by ${user} on ${date}.
 */

export default [{
        action: 'save',
        method: 'post',
        url: (payload) => `/api/notice`
    }, {
        action: 'update',
        method: 'put',
        url: (payload) => `/api/notice`
    }, {
        action: 'delete',
        method: 'delete',
        url: (payload) => `/api/notice`
    }, {
        action: 'get',
        method: "get",
        url: (payload) => `/api/notice/${payload.id}`
    }, {
        action: 'list',
        method: "get",
        url: (payload) => '/api/notice'
    }];
