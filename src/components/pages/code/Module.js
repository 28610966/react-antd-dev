/**
 * Created by binwang on 17/8/4.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as Antd from 'antd';
import _ from 'lodash';
import {Icon, Tabs, Menu, Alert, Button, Popconfirm, Row, Col, Form, Modal} from 'antd';

import {ReactUtil, I18nUtil, RegExUtil}  from '../../../util';
import ModuleEditor from './ModuleEditor';
import {Set} from 'immutable';

import DynamicForm from '../../commons/dynamicForm';

import * as ModuleEditorAction from '../../../actions/code/ModuleEditor';

const entityName = '代码模板';
const SubMenu = Menu.SubMenu;
class Module extends Component {

    static defaultProps = {};

    static propTypes = {};

    //构造函数，在创建组件的时候调用一次。
    constructor(props, context) {
        super(props);
        // let list = _.map(['Grid','Tree','Chart','Action','Reducer','Saga'],m => {return {type:m}});
        this.state = {
            selectModuleEditor: undefined
        }
    }

    //在组件挂载之前调用一次。如果在这个函数里面调用setState，本次的render函数可以看到更新后的state，并且只渲染一次。
    componentWillMount() {
        this.load();
    }

    load() {
        ReactUtil(this).action("ModuleEditor.list",({sortField: 'order'}));
    }

    //在组件挂载之后调用一次。这个时候，子主键也都挂载好了，可以在这里使用refs。
    componentDidMount() {

    }

    //props是父组件传递给子组件的。父组件发生render的时候子组件就会调用componentWillReceiveProps（不管props有没有更新，也不管父子组件之间有没有数据交换）。
    componentWillReceiveProps(nextProps) {

        if (_.get(nextProps, 'ModuleEditor.get') !== _.get(this.props, 'ModuleEditor.get')) {
            ReactUtil(this).setState({ModuleEditor: _.get(nextProps, 'ModuleEditor.get', null)});
        }

        ['save', 'update', 'delete'].forEach((op) => {
            let dataId = `ModuleEditor.${op}.data`;
            let errorId = `ModuleEditor.${op}.error`;
            if (!_.isEqual(_.get(nextProps, dataId), _.get(this.props, dataId)) && _.get(nextProps, dataId, false)) {
                Antd.message.success(I18nUtil.get(`${op}.success`, '', {name: _.get(nextProps, dataId + '.type')}));
                this.openNewModal(false);
                this.load();
            } else if (_.get(nextProps, errorId, false) && !_.isEqual(_.get(nextProps, errorId), _.get(this.props, errorId))) {
                Antd.message.error(_.get(nextProps, errorId));
            }
        });

    }


//组件挂载之后，每次调用setState后都会调用shouldComponentUpdate判断是否需要重新渲染组件。默认返回true，需要重新render。在比较复杂的应用里，有一些数据的改变并不影响界面展示，可以在这里做判断，优化渲染效率。
    shouldComponentUpdate(nextProps, nextState) {
        if (_.get(nextProps, 'ModuleEditor.list.data', null) === null)
            return false;
        return true;
    }

//shouldComponentUpdate返回true或者调用forceUpdate之后，componentWillUpdate会被调用。
    componentWillUpdate(nextProps, nextState) {

    }

//除了首次render之后调用componentDidMount，其它render结束之后都是调用componentDidUpdate。
    componentDidUpdate() {
    }

    selectOne(m) {
        this.setState({selectModuleEditor: m});
    }

    updateOne(e, val) {
        e.preventDefault();
        ReactUtil(this).action("ModuleEditor.get",({id: val.id}));
        this.setState({view: false}, this.openNewModal.bind(this, true));
    }

    view(val) {
        ReactUtil(this).action("ModuleEditor.get",({id: val.id}));
        this.setState({view: true}, this.openNewModal.bind(this, true));
    }

    deleteOne(val) {
        ReactUtil(this).action("ModuleEditor.delete",({id: val.id}));
    }

    handleOk() {
        this.refs.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({ModuleEditor: {data: values}});
                if (_.get(values, 'id', null) === null) {
                    ReactUtil(this).action("ModuleEditor.save",(values));
                } else {
                    ReactUtil(this).action("ModuleEditor.update",(values));
                }
            }
        });
    }

    openNewModal = (flag) => {
        let e = {modalShow: flag};
        if (flag) {
            Object.assign(e, {ModuleEditor: null});
        } else {
            Object.assign(e, {view: false});
        }
        ReactUtil(this).setState(e);
    }

    getGroups() {
        const _list = _.get(this.props, 'ModuleEditor.list.data', []);
        return _.chain(_list).groupBy('group').value();
    }

    renderNewModal() {
        const WrappedForm = Form.create()(ModuleForm);
        const data = _.get(this.state, 'ModuleEditor', null);
        const {view = false, modalShow} = this.state;
        let title = '';
        if (view) {
            title = I18nUtil.get('modal.title.view', '', {name: entityName});
        } else if (_.get(data, 'data.id', null) === null) {
            title = I18nUtil.get('modal.title.add', '', {name: entityName});
        } else {
            title = I18nUtil.get('modal.title.edit', '', {name: entityName});
        }
        return (<Modal
            style={{top: '20px', display: modalShow ? 'block' : 'none'}}
            width={800}
            title={title}
            visible={modalShow}
            okText={I18nUtil.get('ok')}
            onOk={!view ? this.handleOk.bind(this) : this.openNewModal.bind(this, false)}
            cancelText={I18nUtil.get('cancel')}
            onCancel={this.openNewModal.bind(this, false)}>
            <Antd.Spin spinning={false}>
                <WrappedForm ref="form"
                             submit={this.handleOk.bind(this)}
                             data={data} view={view}></WrappedForm>
            </Antd.Spin>
        </Modal>);
    }

    renderTools() {
        return (
            <div className="table-top-tools">
                <Row>
                    <Col span={24}>
                        <Button type="primary"
                                onClick={this.openNewModal.bind(this, true)}
                                icon='plus'>{I18nUtil.get('button.text.new')}</Button>
                    </Col>
                </Row>

            </div>
        );
    }

//主体渲染入口，不要在render里面修改state。
    render() {
        const {selectModuleEditor = null} = this.state;
        const list = this.getGroups()
        return (
            <div className="module-manager" style={{height: "100%"}}>
                <Row>
                    <Col span="4" style={{paddingRight: '10px'}}>
                        {this.renderTools()}
                        <Menu
                            style={{height: 'calc(100% - 70px )', backgroud: '#e9e9e9', border: '1px solid #e9e9e9'}}
                            mode="inline"
                        >
                            {
                                _.map(_.chain(list).map((v, k) => {
                                    return {v: v, k: k}
                                }).sortBy(k => k.k).value(), (m) => <SubMenu key={`module_menu_${m.k}`}
                                                                             title={m.k}>
                                    {
                                        _.map(m.v, m => {
                                            return <Menu.Item key={m.type}>
                                                <div onClick={this.selectOne.bind(this, m)}>
                                                    {m.type}
                                                    <Popconfirm title={I18nUtil.get('are.you.sure')}
                                                                okText={I18nUtil.get('yes')}
                                                                cancelText={I18nUtil.get('no')}
                                                                onConfirm={this.deleteOne.bind(this, m)}>
                                                        <Icon type="delete"
                                                              style={{display: (!m.lock || m.lock.length === 0 ? 'block' : 'none')}}/>
                                                    </Popconfirm>
                                                    <Icon type="edit" onClick={e => this.updateOne(e, m)}/>
                                                </div>
                                            </Menu.Item>
                                        })
                                    }
                                </SubMenu>)
                            }
                        </Menu>
                    </Col>
                    <Col span="20">
                        {
                            !!selectModuleEditor ? <ModuleEditor SelectModuleEditor={selectModuleEditor}/> : null
                        }

                    </Col>
                </Row>
                {this.renderNewModal()}
            </div>
        )
    }

//组件被卸载的时候调用。一般在componentDidMount里面注册的事件需要在这里删除。
    componentWillUnmount() {

    }
}


class ModuleForm extends Component {
    static propTypes = {
        form: React.PropTypes.object.required,
    }

    constructor() {
        super();
        this.state = {
        }
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {

    }

    onSelect(value) {
        console.log('onSelect', value);
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {submit} = this.props;
        const dict = _.get(this.props, 'dict.list.data');
        const data = _.get(this.props, 'data.data', null);
        const loading = _.get(this.props, 'data.loading', false);
        const view = _.get(this.props, 'view', false);

        const fields = [
            {
                id: 'id',
                type: 'hidden',
                style: {display: 'none'}
            },
            {
                id: 'type',
                label: '模板名',
                type: 'input',
                rules: [{
                    required: true, message: I18nUtil.get('please.input', {name: '模板名'}),
                },]
            },
            {
                id: 'group',
                label: '分组',
                type: 'input',
                rules: [
                    {required: true, message: I18nUtil.get('please.input', {name: '模板分组'}),}
                ]
            },
            {
                id: 'route',
                label: '默认路径',
                type: 'input',
                addonBefore:'/src/',
                style:{width:'100%'},
                span: 24,
                rules: [{
                    required:true, message: I18nUtil.get('please.input', {name: '默认路径'}),
                }]
            },
            {
                id: 'description',
                label: '说明',
                type: 'textarea',
                rows: 4,
                span: 24,
                rules: [{
                    message: I18nUtil.get('please.input', {name: '模板说明'}),
                }]
            }, {
                id: 'lock',
                label: '不可删除',
                type: 'checkbox',
                option: [{text: '', value: true}],
            },
            {
                id: 'order',
                label: '排序',
                type: 'number',
                min: 1,
                rules: []
            }, {
                id: 'code',
                type: 'hidden',
            },
        ]
        const props = {
            fields: fields,
            getFieldDecorator: getFieldDecorator,
            loading: loading,
            view: view,
            data: data,
            submit: submit,
            span: 12
        }
        return (
            <DynamicForm {...props}/>
        )
    }

}

//redux store 属性 对接组件的 props 属性。
function mapStoreToProps(store) {
    return {
        ModuleEditor: store.get("ModuleEditor")
    }
}

export default connect(mapStoreToProps)(Module);