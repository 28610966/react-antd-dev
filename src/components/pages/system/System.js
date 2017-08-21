/**
 * Created by binwang on 17/8/17.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Tabs} from 'antd';
import  Dict from './Dict';
import  GrafanaSetting from '../grafana/GrafanaSetting';
import  ExternalPage from './ExternalPage';
const TabPane =Tabs.TabPane;

class System extends Component {

    static defaultProps = {};

    static propTypes = {};

    //构造函数，在创建组件的时候调用一次。
    constructor(props, context) {
        super(props);
        this.state = {}
    }

    //主体渲染入口，不要在render里面修改state。
    render() {
        const style = {
            height: '100%'
        }
        return (
        <Tabs style={style} defaultActiveKey={'tab_dict'} tabPosition="left">
            <TabPane style={style} tab={'字典'} key="tab_dict"><Dict></Dict></TabPane>
            <TabPane style={style} tab={'外部页面'} key="tab_externalpage"><ExternalPage></ExternalPage></TabPane>
        </Tabs>
        );
    }

}
//redux store 属性 对接组件的 props 属性。
function mapStoreToProps(store) {
    return {}
}

export default connect(mapStoreToProps)(System);