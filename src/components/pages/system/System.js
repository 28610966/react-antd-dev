/**
 * Created by binwang on 17/8/17.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import  Dict from './Dict';
import SeconderyMenu from '../../frame/SeconderyMenu';
import  ExternalPage from './ExternalPage';

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
        const data = [{
            tab: '字典',
            key: 'tab_dict',
            component: <Dict></Dict>
        },{
            tab: '外部页面',
            key: 'tab_externalpage',
            component: <ExternalPage></ExternalPage>
        },]
        return <SeconderyMenu data={data}></SeconderyMenu>
    }

}
//redux store 属性 对接组件的 props 属性。
function mapStoreToProps(store) {
    return {}
}

export default connect(mapStoreToProps)(System);