/**
 * Created by binwang on 2017/4/1.
 */
import  React from  'react';
import {Row, Col, Card, Icon, Table, Progress, Avatar, Tabs} from 'antd';
import TreemapComponent from './charts/TreemapComponent';
import MapChartComponent from './charts/MapChartComponent';
import LiquidfillComponent from './charts/LiquidfillComponent';
import ChartAPIComponent from './charts/ChartAPIComponent';
import GaugeComponent from './charts/GaugeComponent';
import PieChartComponent from './charts/PieChartComponent';
import ModuleLoadChartComponent from './charts/ModuleLoadChartComponent';

const TabPane = Tabs.TabPane
export default class Home extends React.Component {

    render() {
        const style = {marginLeft: '5px', marginRight: '5px', minHeight: '160px'}
        const rowStyle = {marginBottom: '10px'}
        return (<div className="home">
            <Row style={rowStyle}>
                <Col span={6}>
                    <Card style={style}>
                        <p><Icon type="appstore-o"></Icon> 应用软件</p>
                        <Row>
                            <Col span={17}>
                                <Progress type="circle" percent={99}/>
                            </Col>
                            <Col span={7}>
                                <p>总数 20</p>
                                <p>可用 18</p>
                                <p>监控中 16</p>
                                <p>故障 2</p>
                                <p>维护 2</p>
                                <p>即将到期 2</p>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={style}>
                        <p><Icon type="rocket"></Icon> 系统软件</p>
                        <Row>
                            <Col span={17}>
                                    <Progress type="circle" percent={99}/>
                            </Col>
                            <Col span={7}>
                                <p>总数 20</p>
                                <p>可用 18</p>
                                <p>监控中 16</p>
                                <p>故障 2</p>
                                <p>维护 2</p>
                                <p>即将到期 2</p>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={style}>
                        <p><Icon type="database"></Icon> 服务器</p>
                        <Row>
                            <Col span={17}>
                                <Progress type="circle" percent={75}/>
                            </Col>
                            <Col span={7}>
                                <p>总数 20</p>
                                <p>可用 18</p>
                                <p>监控中 16</p>
                                <p>故障 2</p>
                                <p>维护 2</p>
                                <p>即将到期 2</p>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={style}>
                        <p><Icon type="ie"></Icon> 网络设备</p>
                        <Row>
                            <Col span={17}>
                                <Progress type="circle" percent={40} status="exception"/>
                            </Col>
                            <Col span={7}>
                                <p>总数 20</p>
                                <p>可用 18</p>
                                <p>监控中 16</p>
                                <p>故障 2</p>
                                <p>维护 2</p>
                                <p>即将到期 2</p>
                            </Col>
                        </Row>
                    </Card>
                </Col>

            </Row>
            <Row style={rowStyle}>
                <Col span={15}>
                    <Card style={style}>
                        <Tabs defaultActiveKey={"1"} animated={false}>
                            <TabPane tab="预警分布" key="1"> <PieChartComponent
                            option={
                                {series: [
                                    {
                                        type: 'pie',
                                        radius: '55%',
                                        center: ['50%', '60%'],
                                        data: [
                                            {value: 33, name: '系统软件'},
                                            {value: 22, name: '应用软件'},
                                            {value: 11, name: '服务器'},
                                            {value: 102, name: '网络设备'},
                                            {value: 55, name: 'Agent'}
                                        ],
                                        itemStyle: {
                                            emphasis: {
                                                shadowBlur: 10,
                                                shadowOffsetX: 0,
                                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                                            }
                                        }
                                    }
                                ]}
                            }
                            ></PieChartComponent></TabPane>
                            <TabPane tab="故障分布" key="2"> <PieChartComponent></PieChartComponent></TabPane>
                        </Tabs>

                    </Card>
                </Col>
                <Col span={9}>
                    <Card title="监控排行榜" style={{...style, minHeight: '524px'}}>

                        <Table
                            size="middle"
                            bordered={false}
                            dataSource={[
                                {
                                    "name": "XXX1",
                                    chain: '10%',
                                    proportion: 30
                                }, {
                                    "name": "XXX2",
                                    chain: '20%',
                                    proportion: 20
                                }, {
                                    "name": "XXX3",
                                    chain: '1%',
                                    proportion: 20
                                }, {
                                    "name": "XXX4",
                                    chain: '2%',
                                    proportion: 20
                                }, {
                                    "name": "XXX5",
                                    chain: '2.2%',
                                    proportion: 20
                                }, {
                                    "name": "XXX6",
                                    chain: '22%',
                                    proportion: 20
                                }, {
                                    "name": "XXX7",
                                    chain: '35%',
                                    proportion: 20
                                }, {
                                    "name": "XXX8",
                                    chain: '46%',
                                    proportion: 20
                                }
                            ]}
                            columns={[
                                {
                                    title: "名称",
                                    dataIndex: "name",
                                    width: '20%'
                                }, {
                                    title: "占比",
                                    dataIndex: "proportion",
                                    width: '*',
                                    render: (e, render) => {
                                        return <Progress showInfo={false} percent={e} strokeWidth={5}/>
                                    }
                                },
                                {
                                    title: "环比",
                                    dataIndex: "chain",
                                    width: '20%'
                                },
                            ]}
                        ></Table>
                    </Card>
                </Col>
            </Row>
            <Row style={rowStyle}>
                <Col span={8}>
                    <Card style={style}>
                        <Icon type="appstore-o"></Icon> 机器使用情况
                    </Card>
                </Col>
                <Col span={8}>
                    <Card style={style}>
                        <Icon type="rocket"></Icon> 应用使用情况
                    </Card>
                </Col>
                <Col span={8}>
                    <Card style={style}>
                        <Icon type="database"></Icon> 应用质量
                        <div>
                            <ModuleLoadChartComponent/>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>)
    }
}