/**
 * Created by binwang on 17/8/7.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import * as Antd from 'antd';
import {Input, Row, Col} from 'antd';

export  default  class I18n extends Component {

    static defaultProps = {};

    static propTypes = {};

    //构造函数，在创建组件的时候调用一次。
    constructor(props, context) {
        super(props);
        this.state = {
            list: []
        }
    }

    refresh(){
        this.setState({refresh:Math.random()})
    }

    //主体渲染入口，不要在render里面修改state。
    render() {
        const {list} = this.state;
        return (<div>
            <Row style={{width:'800px'}}>
                <Col span="8">
                    Key
                </Col>
                <Col span="8">
                    中文
                </Col>
                <Col span="8">
                    英文
                </Col>
            </Row>
            {
                _.map(list , m=> <Row style={{width:'800px'}}>
                    <Col span="8">
                        <Input/>
                    </Col>
                    <Col span="8">
                        <Input/>
                    </Col>
                    <Col span="8">
                        <Input/>
                    </Col>
                </Row>)
            }
        </div>);
    }

    //组件被卸载的时候调用。一般在componentDidMount里面注册的事件需要在这里删除。
    componentWillUnmount() {

    }
}