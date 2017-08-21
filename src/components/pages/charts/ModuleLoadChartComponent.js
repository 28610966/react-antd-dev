/**
 * Created by binwang on 17/8/2.
 */
import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {connect} from 'react-redux';
import _ from 'lodash';
import echarts from 'echarts';

class ModuleLoadChartComponent extends React.Component {
    constructor() {
        super()
        this.state = {
            option: {
                tooltip: {},
                xAxis: {
                    data: ["XX1","XX2","XX3","XX4"]
                },
                yAxis: {},

            }
        }
    }

    componentWillMount() {
        let option = _.assign(this.state.option, {
            series: [
                {
                    name: '2016',
                    type: 'bar',
                    data: [5, 20, 54,36]
                }
            ]
        });
        this.setState({
            option: option
        })
    }

    render() {
        const {option} = this.state;
        return (
            <ReactEcharts
                option={option}
                style={{height: '300px', width: '100%'}}
                modules={['echarts/lib/chart/bar', 'echarts/lib/component/tooltip', 'echarts/lib/component/title']}
                className='react_for_echarts'/>
        );
    }
}
//redux store 属性 对接组件的 props 属性。
function mapStoreToProps(store) {
    return {}
}

export default connect(mapStoreToProps)(ModuleLoadChartComponent);
