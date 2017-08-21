/**
 * Created by binwang on 17/8/8.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {ReactUtil, I18nUtil, RegExUtil}  from '../../../util';
import {Map, List, is} from 'immutable';
import {Steps, Checkbox, Transfer, Row, Col, Input, Select, Button, message, Progress, Icon} from 'antd';

const Step = Steps.Step;
const option = Select.Option;


class CodeCreator extends Component {

    static defaultProps = {
        EntityManager: null
    };

    static propTypes = {
        EntityManager: React.PropTypes.object
    };

    //构造函数，在创建组件的时候调用一次。
    constructor(props, context) {
        super(props);
        this.state = {
            step: 0,
            Strategy: Map({type: 'Grid'}),
            targetKeys: [],
            selectedKeys: [],
            result: null
        }
    }

    //在组件挂载之前调用一次。如果在这个函数里面调用setState，本次的render函数可以看到更新后的state，并且只渲染一次。
    componentWillMount() {
        ReactUtil(this).action("EntityManager.list");
        this.setState({step: 0});
    }

    //在组件挂载之后调用一次。这个时候，子主键也都挂载好了，可以在这里使用refs。
    componentDidMount() {

    }

    //props是父组件传递给子组件的。父组件发生render的时候子组件就会调用componentWillReceiveProps（不管props有没有更新，也不管父子组件之间有没有数据交换）。
    componentWillReceiveProps(nextProps) {
        const CodeCreator = _.get(nextProps, 'CodeCreator.save.data', []);
        if (ReactUtil(this).diff(nextProps,'CodeCreator.save.data') && CodeCreator.length !== 0) {
            this.setState({result: CodeCreator, step: 2});
        }
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

    renderSteps() {
        const {step = 0} = this.state;
        return (
            <div style={{width: '98%', marginBottom: '10px'}}>
                <Steps current={step}>
                    <Step key="step0" title="选择实体"/>
                    <Step key="step1" title="选择生成策略"/>
                    <Step key="step2" title="生成完毕"/>
                </Steps>
            </div>
        )
    }

    selectEntity() {

    }

    handleChange = (nextTargetKeys, direction, moveKeys) => {
        let step = 0;
        if (nextTargetKeys.length !== 0) {
            step = 1;
        }
        this.setState({targetKeys: nextTargetKeys, step});
    }

    handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys]});
    }

    changeStrategyType(v) {
        ReactUtil(this).setState({Strategy: this.state.Strategy.set('type', v)});
    }

    changeDirectory(e) {
        const value = e.nativeEvent.target.value;
        ReactUtil(this).setState({Strategy: this.state.Strategy.set('directory', value)});
    }

    filterOption = (inputValue, option) => {
        return option.name.indexOf(inputValue) > -1 || option.zh_name.indexOf(inputValue) > -1;
    }

    createCode() {
        ReactUtil(this).action("CodeCreator.save",({
            entitys: this.state.targetKeys,
            strategy: this.state.Strategy,
        }));
    }

    resetAll() {
        ReactUtil(this).setState({
            step: 0,
            Strategy: Map({type: 'Grid'}),
            targetKeys: [],
            selectedKeys: [],
            result: null
        });
    }

    renderSelectEntity() {
        let entityManagerList = _.get(this.props, 'EntityManager.list.data', []);
        entityManagerList = entityManagerList.map(m => {
            return {...m, key: m.id};
        });
        return (
            <Transfer
                dataSource={entityManagerList}
                titles={['待选', '已选']}
                listStyle={{
                    height: document.body.clientHeight - 150,
                }}
                showSearch
                filterOption={this.filterOption}
                targetKeys={this.state.targetKeys}
                selectedKeys={this.state.selectedKeys}
                onChange={this.handleChange}
                onSelectChange={this.handleSelectChange}
                onScroll={this.handleScroll}
                render={item => `${item.name}(${item.zh_name})`}
            />
        )
    }

    renderGridOption() {

    }

    renderTreeOption() {

    }

    renderChartOption() {

    }

    renderStrategyOption() {
        const type = this.state.Strategy.get('type');
        if (type === 'Grid')
            return this.renderGridOption();
        else if (type === 'Tree')
            return this.renderTreeOption();
        else if (type === 'Chart')
            return this.renderChartOption();
    }

    renderSelectStrategy() {
        const style = {width: '150px'}
        const strage = this.state.Strategy;
        if (this.state.step > 0) {

            return (
                <div>
                    <p style={{lineHeight: '40px'}}>
                        <Select defaultValue="Grid" style={style} placeholder="组件类型"
                                onSelect={this.changeStrategyType.bind(this)}>
                            <Option key="1" value={'Grid'}>Grid 模板</Option>
                            {/*<Option key="2" value={'Tree'}>Tree 模板</Option>*/}
                            {/*<Option key="3" value={'Chart'}>Chart 模板</Option>*/}
                        </Select>
                    </p>
                    <p style={{lineHeight: '40px'}}><Button type='primary'
                                                            onClick={this.createCode.bind(this)}>一键生成</Button></p>
                </div>
            );
        }
    }

    renderResult() {
        const result = _.get(this.state, 'result', []);
        const {step = 0} = this.state;

        if (step === 2 && result) {
            return (
                <div>
                    <Progress type="circle" percent={100} width={80}/>
                    { _.map(result, c => <div style={{textAlign: 'left'}}><Icon style={{
                        fontSize: "9px",
                        background: 'green',
                        color: "#fff",
                        borderRadius: '100%',
                        marginRight: '10px'
                    }} type={c.status}/>{c.path}</div>)}
                    <Button type='primary' onClick={this.resetAll.bind(this)}>结束</Button>
                </div>
            );
        }
    }

    //主体渲染入口，不要在render里面修改state。
    render() {
        return (<div>
            <Row>
                <Col span={24}>
                    {this.renderSteps()}
                </Col>
            </Row>
            <Row>
                <Col span="10">
                    {this.renderSelectEntity()}
                </Col>
                <Col span="8">
                    {this.renderSelectStrategy()}
                    {this.renderStrategyOption()}
                </Col>
                <Col span="6" style={{textAlign: 'center'}}>
                    {this.renderResult()}
                </Col>
            </Row>
        </div>);
    }

    //组件被卸载的时候调用。一般在componentDidMount里面注册的事件需要在这里删除。
    componentWillUnmount() {
        this.resetAll()
    }
}
//redux store 属性 对接组件的 props 属性。
function mapStoreToProps(store) {
    return {
        EntityManager: store.get("EntityManager"),
        CodeCreator: store.get("CodeCreator"),
    }
}

export default connect(mapStoreToProps)(CodeCreator);