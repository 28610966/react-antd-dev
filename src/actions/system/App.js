/**
 * Created by binwang on 17/8/21.
 */

export default
[{
    action: 'save',
    method: 'post',
    url: (payload) => `/api/app`
}, {
    action: 'update',
    method: 'put',
    url: (payload) => `/api/app`
}, {
    action: 'delete',
    method: 'delete',
    url: (payload) => `/api/app`
}, {
    action: 'get',
    method: "get",
    url: (payload) => `/api/app/${payload.id}`
}, {
    action: 'list',
    method: "get",
    url: (payload) => '/api/app'
}];

