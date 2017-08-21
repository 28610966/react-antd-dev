/**
 * Created by ${user} on ${date}.
 */

export default [{
        action: 'save',
        method: 'post',
        url: (payload) => `/api/user`
    }, {
        action: 'update',
        method: 'put',
        url: (payload) => `/api/user`
    }, {
        action: 'delete',
        method: 'delete',
        url: (payload) => `/api/user`
    }, {
        action: 'get',
        method: "get",
        url: (payload) => `/api/user/${payload.id}`
    }, {
        action: 'list',
        method: "get",
        url: (payload) => '/api/user'
    }];



