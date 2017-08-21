/**
 * Created by binwang on 17/8/21.
 */

export default
[{
    action: 'save',
    method: 'post',
    url: (payload) => `/api/entityfield`
}, {
    action: 'update',
    method: 'put',
    url: (payload) => `/api/entityfield`
}, {
    action: 'delete',
    method: 'delete',
    url: (payload) => `/api/entityfield`
}, {
    action: 'get',
    method: "get",
    url: (payload) => `/api/entityfield/${payload.id}`
}, {
    action: 'list',
    method: "get",
    url: (payload) => '/api/entityfield'
}];

