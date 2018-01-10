/**
 * Created by binwang on 17/8/4.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Icon, Tabs} from 'antd';
import _ from 'lodash';
import EntityManager from './EntityManager';
import MenuManager from './MenuManager';
import Module from './Module';
import LayoutCreator from './LayoutCreator';
import CodeCreator from './CodeCreator';
import RegularExpression from './RegularExpression';
import Routes from './Routes';
import I18n from './I18n';
import SeconderyMenu from '../../frame/SeconderyMenu';
import CodeManager from './CodeManager';

const TabPane = Tabs.TabPane;

class DevelopmentAssistent extends Component {

    static defaultProps = {};

    static propTypes = {};

    //构造函数，在创建组件的时候调用一次。
    constructor(props, context) {
        super(props);
        this.state = {}
    }

    //主体渲染入口，不要在render里面修改state。
    render() {
        const data = [{
            tab: '实体管理',
            key:'tab_entity_manager',
            component: <EntityManager></EntityManager>
        }, {
            tab: '代码生成',
            key: 'tab_code_creator',
            component: <CodeCreator></CodeCreator>
        }, {
            tab: '模板管理',
            key:'tab_module',
            component: <Module></Module>
        }, {
            tab: '代码管理',
            key: 'tab_code_manager',
            component: <CodeManager></CodeManager>
        },
        ]
        return <SeconderyMenu data={data}></SeconderyMenu>


    }
}
//redux store 属性 对接组件的 props 属性。
function mapStoreToProps(store) {
    return {}
}

export default connect(mapStoreToProps)(DevelopmentAssistent);