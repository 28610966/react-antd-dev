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
        const style = {height: '100%'};
        const tabs = [{
            name: '实体管理',
            render: <EntityManager></EntityManager>
        }, {
            name: '代码生成',
            render: <CodeCreator></CodeCreator>
        }, {
            name: '模板管理',
            render: <Module></Module>
        }, {
            name: '代码管理',
            render: <CodeManager></CodeManager>
        },
        //     {
        //     name: '布局生成器',
        //     render: <LayoutCreator></LayoutCreator>
        // }
        ]
        return (<Tabs style={style} tabPosition="left">
            {_.map(tabs, tab => <TabPane style={style} tab={tab.name}
                                         key={tab.name}>{tab.render}</TabPane>)}
        </Tabs>);

    }
}
//redux store 属性 对接组件的 props 属性。
function mapStoreToProps(store) {
    return {}
}

export default connect(mapStoreToProps)(DevelopmentAssistent);