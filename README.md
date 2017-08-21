
## 特性

- 基于 Webpack + React + [Antd](https://github.com/antd) 的企业级开发框架。

## 运行
```
安装最新版本 node npm

npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install
npm start
npm server
```
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
### 调用 Action
```
ReactUti(this).action("User.save",user);  //创建
ReactUti(this).action("User.update",user);  //更新
ReactUti(this).action("User.delete",user);  //删除
ReactUti(this).action("User.get",user);  //获取单条
ReactUti(this).action("User.list",user);  //获取分页列表
```

## 打包代码到 /build 下
  npm build