/**
 * Created by binwang on 17/8/3.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as Antd from 'antd';
import moment from  'moment';
import _ from 'lodash';
import {Map} from 'immutable';

import DynamicQueryForm from '../../commons/dynamicQueryForm';
import DynamicForm from '../../commons/dynamicForm';

import * as EntityFieldAction from '../../../actions/code/EntityField';

import {ReactUtil, I18nUtil, RegExUtil}  from '../../../util';


const {Table, Card, Row, Col, Button, Modal, Form, Icon, Spin, Alert, Menu, Dropdown} = Antd;
const entityName = {name: I18nUtil.get('EntityField', '字段')};

class EntityField extends Component {

    static propTypes = {
        entityId: React.PropTypes.number
    };

    //构造函数，在创建组件的时候调用一次。
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            selectedRows: null,
            filteredInfo: null,
            sortedInfo: null,
            query: Map(),
            EntityField: null
        }
    }

    //在组件挂载之前调用一次。如果在这个函数里面调用setState，本次的render函数可以看到更新后的state，并且只渲染一次。

    loadGrid() {
        ReactUtil(this).action("EntityField.list",(this.state.query.toObject()));
        this.setState({selectedRows: null, message: null});
    }

    //在组件挂载之后调用一次。这个时候，子主键也都挂载好了，可以在这里使用refs。
    componentDidMount() {
        this.setState({query: this.state.query.set('entityId', this.props.entityId)}, this.loadGrid);
    }

    //props是父组件传递给子组件的。父组件发生render的时候子组件就会调用componentWillReceiveProps（不管props有没有更新，也不管父子组件之间有没有数据交换）。
    componentWillReceiveProps(nextProps) {
        if (this.props.entityId !== nextProps.entityId) {
            this.setState({query: this.state.query.set('entityId', nextProps.entityId)}, this.loadGrid);
        }
        let reactUtil = ReactUtil(this);

        if (_.get(nextProps, 'EntityField.get.data.id') !== null && !_.isEqual(_.get(nextProps, 'EntityField.get.data.id'), _.get(this.props, 'EntityField.get.data.id'))) {
            reactUtil.setState({EntityField: _.get(nextProps, 'EntityField.get')});
        }

        ['save', 'update', 'delete'].forEach((op) => {
            let dataId = `EntityField.${op}.data`;
            let errorId = `EntityField.${op}.error`;
            if (!_.isEqual(_.get(nextProps, dataId), _.get(this.props, dataId)) && _.get(nextProps, dataId, false)) {
                Antd.message.success(I18nUtil.get(`${op}.success`, '', entityName));
                this.openNewModal(false);
                this.loadGrid();
            } else if (_.get(nextProps, errorId, false) && !_.isEqual(_.get(nextProps, errorId), _.get(this.props, errorId))) {
                Antd.message.error(_.get(nextProps, errorId));
            }
        });

    }

    //组件挂载之后，每次调用setState后都会调用shouldComponentUpdate判断是否需要重新渲染组件。默认返回true，需要重新render。在比较复杂的应用里，有一些数据的改变并不影响界面展示，可以在这里做判断，优化渲染效率。
    shouldComponentUpdate(nextProps, nextState) {
        if (_.get(nextProps, 'EntityField.list.data', null) === null) {
            return false;
        }
        return true;
    }

    //除了首次render之后调用componentDidMount，其它render结束之后都是调用componentDidUpdate。
    // componentDidUpdate() {
    //
    // }

    openNewModal = (flag) => {
        let e = {modalShow: flag};
        if (flag) {
            Object.assign(e, {EntityField: null});
        } else {
            Object.assign(e, {view: false});
        }
        ReactUtil(this).setState(e);
    }

    handleOk() {
        this.refs.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({EntityField: {data: values}});
                if (_.get(values, 'id', null) === null) {
                    ReactUtil(this).action("EntityField.save",(values));
                } else {
                    ReactUtil(this).action("EntityField.update",(values));
                }
            }
        });
    }

    buildColumn() {
        let columns = [
            {
                title: '字段名',
                dataIndex: 'name',
                width: '20%',
                sorter: true,
            }, {
                title: '中文名',
                dataIndex: 'zh_name',
                width: '*',
                sorter: true,
            }, {
                title: '类型',
                dataIndex: 'type',
                width: '15%',
                sorter: true,
            }, {
                title: '排序',
                dataIndex: 'order',
                width: '10%',
                sorter: true,
            }, {
                title: '',
                dataIndex: 'id',
                key: 'id',
                render: (v, e) => {
                    return (<div style={{display: 'flex'}}>
                        <a onClick={this.updateOne.bind(this, e)}>{I18nUtil.get('button.text.edit')}</a>
                        <span className="separator">|</span>
                        <Antd.Popconfirm title={I18nUtil.get('are.you.sure')} okText={I18nUtil.get('yes')}
                                         cancelText={I18nUtil.get('no')}
                                         onConfirm={this.deleteOne.bind(this, e)}>
                            <a style={{color: "gray"}}>{I18nUtil.get('button.text.delete')}</a>
                        </Antd.Popconfirm>
                    </div>)
                }
            },
        ]
        return columns;
    }

    updateOne(e) {
        ReactUtil(this).action("EntityField.get",e);
        this.setState({view: false}, this.openNewModal.bind(this, true));
    }

    view(e) {
        ReactUtil(this).action("EntityField.get",e);
        this.setState({view: true}, this.openNewModal.bind(this, true));
    }

    deleteOne(e) {
        ReactUtil(this).action("EntityField.delete",e);
    }

    deleteMore() {
        if (_.isNull(this.state.selectedRows) || _.isEmpty(this.state.selectedRows)) {
            Antd.message.error(I18nUtil.get('no.data.selected'));
        } else {
            Modal.confirm({
                title: I18nUtil.get('are.you.sure'),
                onOk: () => {
                    var ids = this.state.selectedRows.map(m => m.id).join(',');
                    ReactUtil(this).action("EntityField.delete",{id: ids});
                }
            });
        }
    }

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            if (selectedRows.length !== 0) {
                this.setState({selectedRows: selectedRows, message: `选中了${selectedRows.length}条记录`});
            } else {
                this.setState({selectedRows: selectedRows, message: null});
            }
        },
    };


    getLoading() {
        return _.get(this.props, 'EntityField.get.loading', false)
            || _.get(this.props, 'EntityField.save.loading', false)
            || _.get(this.props, 'EntityField.update.loading', false);
    }

    handleTableChange = (pagination, filters, sorter) => {
        let query = this.state.query
            .set('current', pagination.current)
            .set('pageSize', pagination.pageSize)
            .set('sortField', sorter.field)
            // .set('filters',filters)
            .set('sortOrder', sorter.order);
        this.state.query = query;
        this.loadGrid();
    }

    renderNewModal() {
        const WrappedForm = Form.create()(EntityFieldForm);
        let data = _.get(this.state, 'EntityField', null);
        if (data === null)
            data = {data: {entityId: this.props.entityId}};
        const loading = this.getLoading();
        const {view = false, modalShow} = this.state;
        const max = _.get(_.maxBy(_.get(this.props, 'EntityField.list.data'), (e) => e.order),'order',0);
        let title = '';
        if (view) {
            title = I18nUtil.get('modal.title.view', '', entityName);
        } else if (_.get(data, 'data.id', null) === null) {
            title = I18nUtil.get('modal.title.add', '', entityName);
        } else {
            title = I18nUtil.get('modal.title.edit', '', entityName);
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
            <Antd.Spin spinning={loading}>
                <WrappedForm ref="form"
                             EntityManager={_.get(this.props, 'EntityManager.list.data')}
                             data={data} view={view} max={max}
                             submit={this.handleOk.bind(this)}
                ></WrappedForm>
            </Antd.Spin>
        </Modal>);
    }

    renderTools() {
        let menu = (
            <Menu>
                <Menu.Item key="menu_delete_more">
                    <a onClick={this.deleteMore.bind(this)}>{I18nUtil.get('button.text.delete.selected')}</a>
                </Menu.Item>
            </Menu>
        );
        return (
            <div className="table-top-tools">
                <Row>
                    <Col span={24}>
                        <Button type="primary"
                                onClick={this.openNewModal.bind(this, true)}
                                icon='plus'>{I18nUtil.get('button.text.new')}</Button>
                        <Dropdown overlay={menu}>
                            <Button>
                                {I18nUtil.get('button.text.batch.operation')} <Icon type="down"/>
                            </Button>
                        </Dropdown>
                    </Col>
                </Row>
            </div>
        );
    }

    renderTable() {
        let columns = this.buildColumn();
        const msg = _.get(this.state, 'message', null);
        return (
            <div>
                {this.renderTools()}
                {/*<Alert style={{marginBottom: '10px', display: _.isNull(msg) ? 'none' : 'block'}} message={msg}*/}
                {/*type="info" showIcon/>*/}
                <Spin spinning={_.get(this.props, 'EntityField.list.loading', false)}>
                    <Table
                        pagination={false}
                        bordered={true}
                        rowSelection={this.rowSelection}
                        columns={columns}
                        size="small"
                        dataSource={_.get(this.props, 'EntityField.list.data', null)}
                        onChange={this.handleTableChange}
                    ></Table>
                </Spin>
            </div>);
    }

    //主体渲染入口，不要在render里面修改state。
    render() {
        return (
            <div>
                {this.renderTable()}
                {this.renderNewModal()}
            </div>);
    }

    //组件被卸载的时候调用。一般在componentDidMount里面注册的事件需要在这里删除。
    //componentWillUnmount() {

    //}
}

const types_name = ['input',
    'number',
    'password',
    'textarea',
    'hidden',
    'select',
    'option',
    'radio',
    'checkbox',
    'datepicker'];
class EntityFieldForm extends Component {
    static propTypes = {
        form: React.PropTypes.object.required,
    }

    constructor() {
        super();
        this.state = {
            types: _.map(types_name, m => {
                return {label: m, value: m}
            }),
            select_option_style: {display: "hidden"}
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {submit} = this.props;
        const dict = _.get(this.props, 'dict.list.data');
        const data = _.get(this.props, 'data.data', null);
        const max = _.get(this.props, 'max', 0);
        const loading = _.get(this.props, 'data.loading', false);
        const view = _.get(this.props, 'view', false);

        const select_option_style = _.get(this.state, 'select_option_style');

        const {types} = this.state;
        const entitys = _.map(_.get(this.props, "EntityManager", []), e => {
            return e.name;
        })

        const fields = [
            {
                id: 'id',
                type: 'hidden',
                style: {display: 'none'}
            }, {
                id: 'entityId',
                type: 'hidden',
                style: {display: 'none'}
            },
            {
                id: 'name',
                label: '字段名',
                type: 'input',
                rules: [{
                    required: true, message: I18nUtil.get('please.input', {name: '字段名'}),
                    pattern: RegExUtil.english, message: I18nUtil.get('please.input', {name: '英文'}),
                }]
            },
            {
                id: 'zh_name',
                label: '中文名',
                type: 'input',
                rules: [{
                    pattern: RegExUtil.chinese, message: I18nUtil.get('please.input', {name: '中文'}),
                }]
            },
            {
                id: 'type',
                label: '类型',
                type: 'select',
                option: types,
                span: 24,
                onChange: (e) => {
                    if (e === 'select' || e === 'radio' || e === 'checkbox'){
                        this.setState({select_option_style: {display: 'block'}})
                    }else {
                        this.setState({select_option_style: {display: 'none'}})
                    }
                },
                rules: [{
                    required: true, message: I18nUtil.get('please.input', {name: '类型'}),
                }]
            },
            {
                id: 'required',
                label: '必选',
                type: 'checkbox',
                option: [{text: '', value: true}]
            },
            {
                id: 'row',
                label: '独占行',
                type: 'checkbox',
                option: [{text: '', value: true}]
            },
            {
                id: 'select_option',
                label: '数据来源',
                type: 'AutoComplete',
                dataSource: entitys,
                span: 24,
                style: select_option_style,
            },
            {
                id: 'select_option_id',
                label: 'Value',
                type: 'input',
                style: select_option_style,

            },
            {
                id: 'select_option_label',
                label: 'Label',
                type: 'input',
                style: _.get(this.state, 'select_option_style'),
            },
            {
                id: 'order',
                label: '排序',
                type: 'number',
                defaultValue: max + 1,
                min: 1,
                max: 10000
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
        EntityField: store.get('EntityField'),
        EntityManager: store.get('EntityManager'),
    }
}

export default connect(mapStoreToProps)(EntityField);