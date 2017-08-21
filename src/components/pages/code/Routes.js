/**
 * Created by binwang on 17/8/4.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import CodeEditor from './CodeEditor';
import * as Antd from 'antd';

export default  class Routes extends Component {

    static defaultProps = {};

    static propTypes = {};

    //构造函数，在创建组件的时候调用一次。
    constructor(props, context) {
        super(props);
        this.state = {}
    }

    refresh(){
        this.setState({refresh:Math.random()})
    }

    //主体渲染入口，不要在render里面修改state。
    render() {
        return (<CodeEditor path="/routes.js"  refresh={this.state.refresh}></CodeEditor>);
    }

    //组件被卸载的时候调用。一般在componentDidMount里面注册的事件需要在这里删除。
    componentWillUnmount() {
    }
}