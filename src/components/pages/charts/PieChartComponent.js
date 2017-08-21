/**
 * Created by binwang on 17/8/2.
 */
import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {connect} from 'react-redux';
import _ from 'lodash';
import echarts from 'echarts';

class PieChartComponent extends React.Component {
    constructor() {
        super()
        this.state = {
            option: {
                title: {
                    // text: '预警分布图',
                    subtext: '纯属虚构',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['系统软件', '应用软件', '服务器', '网络设备', 'Agent']
                },
                series: [
                    {
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: [
                            {value: 335, name: '系统软件'},
                            {value: 310, name: '应用软件'},
                            {value: 234, name: '服务器'},
                            {value: 135, name: '网络设备'},
                            {value: 1548, name: 'Agent'}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            }
        }
    }

    componentWillMount() {
        let option = _.assign(this.state.option, this.props.option);
        this.setState({
            option: option
        })
    }

    render() {
        const {option} = this.state;
        return (
            <ReactEcharts
                option={option}
                style={{height: '450px', width: '100%'}}
                modules={['echarts/lib/chart/bar', 'echarts/lib/component/tooltip', 'echarts/lib/component/title']}
                className='react_for_echarts'/>
        );
    }
}
//redux store 属性 对接组件的 props 属性。
function mapStoreToProps(store) {
    return {}
}

export default connect(mapStoreToProps)(PieChartComponent);
