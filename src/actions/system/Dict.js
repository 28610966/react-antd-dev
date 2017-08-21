/**
 * Created by ${user} on ${date}.
 */

export default [{
        action: 'save',
        method: 'post',
        url: (payload) => `/api/dict`
    }, {
        action: 'update',
        method: 'put',
        url: (payload) => `/api/dict`
    }, {
        action: 'delete',
        method: 'delete',
        url: (payload) => `/api/dict`
    }, {
        action: 'get',
        method: "get",
        url: (payload) => `/api/dict/${payload.id}`
    }, {
        action: 'list',
        method: "get",
        url: (payload) => '/api/dict'
    }];
