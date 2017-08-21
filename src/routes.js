/**
 * Created by binwang on 2017/4/5.
 */
import React from 'react';
import {Route, IndexRoute, hashHistory} from 'react-router';
import * as Pages from './components/pages/index';
import ReactUtil from './util/ReactUtil';
import App from'./app';
const route = <Route path='/' icon="home" breadcrumbName="首页" component={App}>
    <IndexRoute component={Pages.IFrame} iframe="true"/>
    <Route path='/login' component={Pages.Login}></Route>
    <Route breadcrumbName="平台">
        <Route breadcrumbName="租户管理"  path='/tenant_management' component={Pages.Tenant}></Route>
        <Route breadcrumbName="系统配置"  path='/system_setting' component={Pages.System}></Route>
    </Route>
    <Route breadcrumbName="配置">
        <Route breadcrumbName="服务管理"  path='/service_management' component={Pages.Server}></Route>
        <Route breadcrumbName="服务组管理"  path='/service_group_management' component={Pages.ServerGroup}></Route>
    </Route>
    <Route breadcrumbName="租户">
        <Route breadcrumbName="组织管理"  path='/org_management' component={Pages.Org}></Route>
        <Route breadcrumbName="人员管理"  path='/user_management' component={Pages.User}></Route>
        <Route breadcrumbName="权限管理"  path='/right_management' component={Pages.RoleRight}></Route>
    </Route>
    <Route breadcrumbName="运维">
        <Route breadcrumbName="告警管理" path="/alarm_management" component={Pages.Alarm}></Route>
        <Route breadcrumbName="事故管理" path="/accident_management" component={Pages.Accisdent}></Route>
        <Route breadcrumbName="事件管理" path="/event_management" component={Pages.Event}></Route>
        <Route breadcrumbName="通知管理" path="/notice_management" component={Pages.Notice}></Route>
    </Route>
    {ReactUtil().isDevelopment() ? <Route path='/development_assistent' breadcrumbName="开发助手" component={Pages.DevelopmentAssistent}></Route> : null}
    <Route path="*" breadcrubName="404" component={Pages.NoMatch}/>
</Route>;

export default route;