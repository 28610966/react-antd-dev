/**
 * Created by ${user} on ${date}.
 */

export default [{
        action: 'save',
        method: 'post',
        url: (payload) => `/api/externalpage`
    }, {
        action: 'update',
        method: 'put',
        url: (payload) => `/api/externalpage`
    }, {
        action: 'delete',
        method: 'delete',
        url: (payload) => `/api/externalpage`
    }, {
        action: 'get',
        method: "get",
        url: (payload) => `/api/externalpage/${payload.id}`
    }, {
        action: 'list',
        method: "get",
        url: (payload) => '/api/externalpage'
    }];
