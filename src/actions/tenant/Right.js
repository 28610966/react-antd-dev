/**
 * Created by ${user} on ${date}.
 */

export default [{
        action: 'save',
        method: 'post',
        url: (payload) => `/api/right`
    }, {
        action: 'update',
        method: 'put',
        url: (payload) => `/api/right`
    }, {
        action: 'delete',
        method: 'delete',
        url: (payload) => `/api/right`
    }, {
        action: 'get',
        method: "get",
        url: (payload) => `/api/right/${payload.id}`
    }, {
        action: 'list',
        method: "get",
        url: (payload) => '/api/right'
    }];
