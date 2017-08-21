/**
 * Created by binwang on 17/8/15.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {Map, List, is} from 'immutable';
import {Row, Col, Card, Icon, Button, Table, Menu} from 'antd';

class LayoutCreator extends Component {

    static defaultProps = {};

    static propTypes = {};

    //构造函数，在创建组件的时候调用一次。
    constructor(props, context) {
        super(props);
        const borderStyle = {
            border: "1px dotted #e9e9e9",
            height: '200px'
        }
        this.state = {
            selectComponents: List(),
            components: [
                {name: 'Row', dom: <Row className="droptarget" style={borderStyle}></Row>},
                {name: 'Col', dom: <Col className="droptarget" style={borderStyle}></Col>},
                {name: 'Table', dom: <Table></Table>},
                {name: 'Menu', dom: <Menu></Menu>},
                {name: 'Button', dom: <Button type='primary'>按钮</Button>},
                {name: 'Input',},
            ]
        }
    }


    //在组件挂载之前调用一次。如果在这个函数里面调用setState，本次的render函数可以看到更新后的state，并且只渲染一次。
    componentWillMount() {

    }

    //在组件挂载之后调用一次。这个时候，子主键也都挂载好了，可以在这里使用refs。
    componentDidMount() {
        document.addEventListener("dragenter", function (event) {
            if (event.target.className == "droptarget") {
                event.target.style.border = "2px dotted gray";
            }
        });
        document.addEventListener("dragleave", function (event) {
            if (event.target.className == "droptarget") {
                event.target.style.border = "";
            }
        });
    }

    //props是父组件传递给子组件的。父组件发生render的时候子组件就会调用componentWillReceiveProps（不管props有没有更新，也不管父子组件之间有没有数据交换）。
    componentWillReceiveProps(nextProps) {

    }

    //组件挂载之后，每次调用setState后都会调用shouldComponentUpdate判断是否需要重新渲染组件。默认返回true，需要重新render。在比较复杂的应用里，有一些数据的改变并不影响界面展示，可以在这里做判断，优化渲染效率。
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    //shouldComponentUpdate返回true或者调用forceUpdate之后，componentWillUpdate会被调用。
    componentWillUpdate(nextProps, nextState) {

    }

    //除了首次render之后调用componentDidMount，其它render结束之后都是调用componentDidUpdate。
    componentDidUpdate() {

    }

    addComponent(c) {
        const selectComponents = this.state.selectComponents.push(c);
        this.setState({selectComponents})
    }

    //主体渲染入口，不要在render里面修改state。
    render() {
        const {components, selectComponents} = this.state;
        return (<div class="layout-creator" style={{height: '100%'}}>
            <Row>
                <Col span="4">
                    {
                        _.map(components, c => <Card style={{color: "#ffffff", background: "rgb(16, 142, 233)"}}
                                                     draggable="true">{c.name}</Card>)
                    }
                </Col>
                <Col span="19" offset={1}>
                    <div className="droptarget" style={{height: '600px', width: '100%'}}></div>
                    {
                        _.map(selectComponents.toArray(), sc => sc.dom)
                    }
                </Col>
            </Row>
        </div>);
    }

    //组件被卸载的时候调用。一般在componentDidMount里面注册的事件需要在这里删除。
    componentWillUnmount() {

    }
}
//redux store 属性 对接组件的 props 属性。
function mapStoreToProps(store) {
    return {}
}

export default connect(mapStoreToProps)(LayoutCreator);