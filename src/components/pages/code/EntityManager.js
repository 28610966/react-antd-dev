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
import LightWord from '../../commons/LightWord';


import {ReactUtil, I18nUtil, RegExUtil}  from '../../../util';


import EntityField from './EntityField';

const {Table, Card, Row, Col, Button, Modal, Form, Icon, Spin, Alert, Menu, Input} = Antd;
const entityName = {name: I18nUtil.get('EntityManager', '实体')};
const Search = Input.Search;
const InputGroup = Input.Group;
class EntityManager extends Component {

    static propTypes = {};

    //构造函数，在创建组件的时候调用一次。
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            selectedRows: null,
            query: Map(),
            EntityManager: null,
            selectEntityManager: null,
            EntityManagerList: [],
            listFilter: null,
        }
    }

    //在组件挂载之前调用一次。如果在这个函数里面调用setState，本次的render函数可以看到更新后的state，并且只渲染一次。
    componentWillMount() {
    }

    loadGrid() {
        ReactUtil(this).action("EntityManager.list",this.state.query.toObject());
        this.setState({selectedRows: null, message: null});
    }

    //在组件挂载之后调用一次。这个时候，子主键也都挂载好了，可以在这里使用refs。
    componentDidMount() {
        this.loadGrid();
    }

    //props是父组件传递给子组件的。父组件发生render的时候子组件就会调用componentWillReceiveProps（不管props有没有更新，也不管父子组件之间有没有数据交换）。
    componentWillReceiveProps(nextProps) {
        let reactUtil = ReactUtil(this);

        if (reactUtil.diff(nextProps,"EntityManager.get.data.id")) {
            reactUtil.setState({EntityManager: _.get(nextProps, 'EntityManager.get')});
        }
        if (reactUtil.diff(nextProps,"EntityManager.list.data")) {
            reactUtil.setState({EntityManagerList: _.get(nextProps, 'EntityManager.list.data')});
        }

        ['save', 'update', 'delete'].forEach((op) => {
            let dataId = `EntityManager.${op}.data`;
            let errorId = `EntityManager.${op}.error`;
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
        if (_.get(nextProps, 'EntityManager.list.data', null) === null) {
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
            Object.assign(e, {EntityManager: null});
        } else {
            Object.assign(e, {view: false});
        }
        ReactUtil(this).setState(e);
    }

    handleOk() {
        this.refs.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({EntityManager: {data: values}});
                if (_.get(values, 'id', null) === null) {
                    ReactUtil(this).action("EntityManager.save",values);
                } else {
                    ReactUtil(this).action("EntityManager.update",values);
                }
            }
        });
    }

    updateOne(e, val) {
        e.preventDefault();
        ReactUtil(this).action("EntityManager.get",{id: val.id});
        this.setState({view: false}, this.openNewModal.bind(this, true));
    }

    view(val) {
        ReactUtil(this).action("EntityManager.get",{id: val.id});
        this.setState({view: true}, this.openNewModal.bind(this, true));
    }

    deleteOne(val) {
        ReactUtil(this).action("EntityManager.delete",{id: val.id});
    }

    deleteMore() {
        if (_.isNull(this.state.selectedRows) || _.isEmpty(this.state.selectedRows)) {
            Antd.message.error(I18nUtil.get('no.data.selected'));
        } else {
            Modal.confirm({
                title: I18nUtil.get('are.you.sure'),
                onOk: () => {
                    var ids = this.state.selectedRows.map(m => m.id).join(',');
                    ReactUtil(this).action("EntityManager.delete",{id: ids});
                }
            });
        }
    }

    getLoading() {
        return _.get(this.props, 'EntityManager.get.loading', false)
            || _.get(this.props, 'EntityManager.save.loading', false)
            || _.get(this.props, 'EntityManager.update.loading', false);
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
        const WrappedForm = Form.create()(EntityManagerForm);
        const data = _.get(this.state, 'EntityManager', null);
        const loading = this.getLoading();
        const {view = false, modalShow} = this.state;
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
                <WrappedForm ref="form" dict={this.props.Dict}
                             submit={this.handleOk.bind(this) }
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

    renderTable() {
        let list = _.get(this.state, 'EntityManagerList', []);
        let listFilter = this.state.listFilter;
        if(!!listFilter){
            listFilter = listFilter.toLowerCase();
            list = _.filter(list, l => l.name.toLowerCase().indexOf(listFilter) > -1 || l.zh_name.indexOf(listFilter) > -1);
        }
        return (
            <div className="entity-manager" style={{height:"100%"}}>
                {this.renderTools()}
                <InputGroup compact>
                    <Input disabled value={`总数:${list.length}`} style={{width:'80px'}}/>
                    <Search  style={{width:'calc(100% - 80px)'}}
                        placeholder="input search text"
                        onSearch={value => this.setState({listFilter: value})}
                    />
                </InputGroup>

                    <Menu
                        style={{height: 'calc(100% - 70px )'}}
                        //  defaultSelectedKeys={list.map(m=>m.name)}
                        mode="inline"
                    >{ list.map(m => {
                            return <Menu.Item key={m.name}>
                                <div onClick={this.selectOne.bind(this, m)}>
                                    {m.zh_name}({m.name})
                                    <Antd.Popconfirm title={I18nUtil.get('are.you.sure')} okText={I18nUtil.get('yes')}
                                                     cancelText={I18nUtil.get('no')}
                                                     onConfirm={this.deleteOne.bind(this, m)}>
                                        <Icon type="delete"/>
                                    </Antd.Popconfirm>
                                    <Icon type="edit" onClick={e => this.updateOne(e, m)}/>
                                </div>
                            </Menu.Item>
                        })}
                    </Menu>
            </div>);
    }

    selectOne(m) {
        this.setState({selectEntityManager: m});
    }

    //主体渲染入口，不要在render里面修改state。
    render() {
        const style = {paddingRight: "5px", height: '100%'};
        const entityId = _.get(this.state, 'selectEntityManager.id');
        return (
            <Row style={{height: '100%'}}>
                <Col style={style} span={6}>
                    {this.renderTable()}
                    {this.renderNewModal()}
                </Col>
                <Col span={18} style={style}>
                    <Antd.Layout.Content>
                        {
                            entityId ? <EntityField entityId={entityId}></EntityField> : null
                        }
                    </Antd.Layout.Content>
                </Col>
            </Row>);
    }

    //组件被卸载的时候调用。一般在componentDidMount里面注册的事件需要在这里删除。
    //componentWillUnmount() {

    //}
}

class EntityManagerForm extends Component {
    static propTypes = {
        form: React.PropTypes.object.required,
    }

    constructor() {
        super();
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
                id: 'name',
                label: '实体名',
                type: 'input',
                rules: [{
                    required: true, message: I18nUtil.get('please.input', {name: '实体名'}),
                }, {
                    pattern: RegExUtil.english, message: I18nUtil.get('please.input', {name: '英文名'}),
                }]
            },
            {
                id: 'zh_name',
                label: '中文名',
                type: 'input',
                rules: [{
                    pattern: RegExUtil.chinese,
                    required: true, message: I18nUtil.get('please.input', {name: '中文名'}),
                }]
            }, {
                id: 'route',
                label: '分组',
                type: 'input',
                addonBefore: '/',
                rules: [{
                    required: true, message: I18nUtil.get('please.input', {name: '分组'}),
                }, {
                    pattern: RegExUtil.english, message: I18nUtil.get('please.input', {name: '分组'}),
                }]
            }
            ,
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
        EntityManager: store.get('EntityManager'),
    }
}

export default connect(mapStoreToProps)(EntityManager);