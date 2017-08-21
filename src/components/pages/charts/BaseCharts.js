/**
 * Created by binwang on 17/8/7.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as Antd from 'antd';
import {Row,Col} from 'antd';
import ChartAPIComponent from './ChartAPIComponent';
import GaugeComponent from './GaugeComponent';
import MapChartComponent from './MapChartComponent';
import ModuleLoadChartComponent from './ModuleLoadChartComponent';

class BaseCharts extends Component {

    static defaultProps = {};

    static propTypes = {};

    //构造函数，在创建组件的时候调用一次。
    constructor(props, context) {
        super(props);
        this.state = {}
    }

    //主体渲染入口，不要在render里面修改state。
    render() {
        return (<Antd.Row type="flex">
            <Col span={8}>
                <ChartAPIComponent></ChartAPIComponent>
            </Col>
            <Col span={8}>
                <ChartAPIComponent></ChartAPIComponent>
            </Col>
            <Col span={8}>
                <ChartAPIComponent></ChartAPIComponent>
            </Col>
            <Col span={8}>
                <GaugeComponent></GaugeComponent>
            </Col>
            <Col span={8}>
                <ModuleLoadChartComponent></ModuleLoadChartComponent>
            </Col>

        </Antd.Row>);
    }

    //组件被卸载的时候调用。一般在componentDidMount里面注册的事件需要在这里删除。
    componentWillUnmount() {

    }
}
//redux store 属性 对接组件的 props 属性。
function mapStoreToProps(store) {
    return {}
}

export default connect(mapStoreToProps)(BaseCharts);