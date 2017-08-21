/**
 * Created by ${user} on ${date}.
 */

export default [{
        action: 'save',
        method: 'post',
        url: (payload) => `/api/accisdent`
    }, {
        action: 'update',
        method: 'put',
        url: (payload) => `/api/accisdent`
    }, {
        action: 'delete',
        method: 'delete',
        url: (payload) => `/api/accisdent`
    }, {
        action: 'get',
        method: "get",
        url: (payload) => `/api/accisdent/${payload.id}`
    }, {
        action: 'list',
        method: "get",
        url: (payload) => '/api/accisdent'
    }];
