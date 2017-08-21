/**
 * Created by ${user} on ${date}.
 */

export default [{
        action: 'save',
        method: 'post',
        url: (payload) => `/api/event`
    }, {
        action: 'update',
        method: 'put',
        url: (payload) => `/api/event`
    }, {
        action: 'delete',
        method: 'delete',
        url: (payload) => `/api/event`
    }, {
        action: 'get',
        method: "get",
        url: (payload) => `/api/event/${payload.id}`
    }, {
        action: 'list',
        method: "get",
        url: (payload) => '/api/event'
    }];
