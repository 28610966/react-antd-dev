/**
 * Created by binwang on 17/8/16.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Tabs} from 'antd';
import Right from './Right';
import Role from './Role';

const TabPane = Tabs.TabPane;

export default class RoleRight extends Component {

    static defaultProps = {};

    static propTypes = {};

    //构造函数，在创建组件的时候调用一次。
    constructor(props, context) {
        super(props);
        this.state = {}
    }

    //主体渲染入口，不要在render里面修改state。
    render() {
        const style = {height:"100%"}
        return (<Tabs style={style} defaultActiveKey={'tab_role'} tabPosition="left">
            <TabPane style={style} tab={'角色'} key="tab_role"><Role></Role></TabPane>
            <TabPane style={style} tab={'权限'} key="tab_right"><Right></Right></TabPane>
        </Tabs>);
    }

}