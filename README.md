
## 特性

- 基于 npm + webpack + [antd](https://github.com/antd) 的企业级开发框架。

## 运行
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install
npm start
npm server

运行后端服务，提供简易mock数据
- package.json的 proxy属性代表代理服务的url， 默认为 [http://localhost:8000](http://localhost:8000)

## 开发指南

### 创建action
./src/actions/User.js
```
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
```

### redux store 结构 保持一致
```
${NAME} = {
    get: { //请求单条记录操作
        data, loading, error
    },
    list: { //请求多条记录操作
        data, loading, error
    },
    save: { //请求保存操作
        data, loading, error
    },
    update: { //请求更新操作
        data, loading, error
    },
    delete: { //请求删除操作
        data, loading, error
    }
}
```
- data: 服务端返回的数值
- loading: （true:请求中等待响应，false:已响应)，通常用于 页面 loading 的控制
- error: 错误消息


## 打包代码到 /build 下
  npm build