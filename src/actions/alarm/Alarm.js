/**
 * Created by ${user} on ${date}.
 */

export default [{
        action: 'save',
        method: 'post',
        url: (payload) => `/api/alarm`
    }, {
        action: 'update',
        method: 'put',
        url: (payload) => `/api/alarm`
    }, {
        action: 'delete',
        method: 'delete',
        url: (payload) => `/api/alarm`
    }, {
        action: 'get',
        method: "get",
        url: (payload) => `/api/alarm/${payload.id}`
    }, {
        action: 'list',
        method: "get",
        url: (payload) => '/api/alarm'
    }];
