/**
 *  auto create grid component
 *  author binwang.local date 2017-08-16
 */

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as Antd from 'antd';
import moment from  'moment';
import _ from 'lodash';
import {Map} from 'immutable';

import DynamicQueryForm from '../../commons/dynamicQueryForm';
import DynamicForm from '../../commons/dynamicForm';

import {ReactUtil, I18nUtil, RegExUtil}  from '../../../util';

const {Table, Card, Row, Col, Button, Modal, Form, Icon, Spin, Alert, Menu, Dropdown, Checkbox} = Antd;
const entityName = {name: I18nUtil.get('Role', '角色')};

class Role extends Component {

    static propTypes = {};

    //构造函数，在创建组件的时候调用一次。
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            selectedRows: null,
            filteredInfo: null,
            sortedInfo: null,
            query: Map(),
            Role: null,
            Dict: Map({
                rights: null
            })
        }
    }

    //在组件挂载之前调用一次。如果在这个函数里面调用setState，本次的render函数可以看到更新后的state，并且只渲染一次。
    componentWillMount() {
        ReactUtil(this).action("Right.list");
    }

    loadGrid() {
        ReactUtil(this).action("Role.list",(this.state.query.toObject()));
        this.setState({selectedRows: null, message: null});
    }

    //在组件挂载之后调用一次。这个时候，子主键也都挂载好了，可以在这里使用refs。
    componentDidMount() {
        this.loadGrid();
    }

    //props是父组件传递给子组件的。父组件发生render的时候子组件就会调用componentWillReceiveProps（不管props有没有更新，也不管父子组件之间有没有数据交换）。
    componentWillReceiveProps(nextProps) {
        let reactUtil = ReactUtil(this);

        if (_.get(nextProps, 'Role.get.data.id') !== null && !_.isEqual(_.get(nextProps, 'Role.get.data.id'), _.get(this.props, 'Role.get.data.id'))) {
            reactUtil.setState({Role: _.get(nextProps, 'Role.get')});
        }

        if (_.get(nextProps, 'Right.list.data') !== null && !_.isEqual(_.get(nextProps, 'Right.list.data'), _.get(this.props, 'Right.list.data'))) {
            reactUtil.setState({
                Dict: this.state.Dict.set("rights", _.get(nextProps, 'Right.list.data')).set("rights_dict", _.map(_.get(nextProps, 'Right.list.data'), m => {
                    return {value: m.id, label: m.name};
                }))
            });
        }

        ['save', 'update', 'delete'].forEach((op) => {
            let dataId = `Role.${op}.data`;
            let errorId = `Role.${op}.error`;
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
        if (_.get(nextProps, 'Role.list.data', null) === null) {
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
            Object.assign(e, {Role: null});
        } else {
            Object.assign(e, {view: false});
        }
        ReactUtil(this).setState(e);
    }

    handleOk() {
        this.refs.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({Role: {data: values}});
                if (_.get(values, 'id', null) === null) {
                    ReactUtil(this).action("Role.save",(values));
                } else {
                    ReactUtil(this).action("Role.update",(values));
                }
            }
        });
    }

    dictDecorator(dict) {
        return _.map(dict, (v, k) => {
            return {'text': v, 'value': k}
        });
    }

    buildColumn() {
        const filters = _.chain(_.get(this.props, 'Role.list.data', [])).map(r => {
            return {
                text: r.name,
                value: r.name,
            }
        }).value();
        let columns = [
            {
                dataIndex: 'name',
                title: '角色名',
                fixed: 'left',
                width: '220',
                filters: filters,
                onFilter: (value, record) => record.name.indexOf(value) === 0,
                render: (v, e) => {

                    return <div style={{display: 'flex'}}>
                        {v}
                        <span className="separator">|</span>
                        <a onClick={this.updateOne.bind(this, e)}>{I18nUtil.get('button.text.edit')}</a>
                        <span className="separator">|</span>
                        <Antd.Popconfirm title={I18nUtil.get('are.you.sure')} okText={I18nUtil.get('yes')}
                                         cancelText={I18nUtil.get('no')}
                                         onConfirm={this.deleteOne.bind(this, e)}>
                            <a style={{color: "gray"}}>{I18nUtil.get('button.text.delete')}</a>
                        </Antd.Popconfirm>
                    </div>
                }
            }
        ]
        const rights = this.state.Dict.get("rights");
        if (!!rights) {
            let rightsGroup = _.groupBy(rights, "group");
            let c = columns.concat(_.chain(rightsGroup).mapValues((v, k) => {
                return {
                    title: k,
                    children: _.map(v, r => {
                        return {
                            dataIndex: r.id,
                            title: r.name,
                            width: '40px',
                            render: (v, e) => {
                                return <Checkbox key={e.id+"_"+r.id} defaultChecked={_.indexOf(_.get(e,'right',[]), r.id) > -1}></Checkbox>;
                            }
                        }
                    })

                }
            }).values().value());
            return c;
        } else
            return columns;
    }

    updateOne(e) {
        ReactUtil(this).action("Role.get",(e));
        this.setState({view: false}, this.openNewModal.bind(this, true));
    }

    view(e) {
        ReactUtil(this).action("Role.get",(e));
        this.setState({view: true}, this.openNewModal.bind(this, true));
    }

    deleteOne(e) {
        ReactUtil(this).action("Role.delete",(e));
    }

    deleteMore() {
        if (_.isNull(this.state.selectedRows) || _.isEmpty(this.state.selectedRows)) {
            Antd.message.error(I18nUtil.get('no.data.selected'));
        } else {
            Modal.confirm({
                title: I18nUtil.get('are.you.sure'),
                onOk: () => {
                    var ids = this.state.selectedRows.map(m => m.id).join(',');
                    ReactUtil(this).action("Role.delete",{id: ids});
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
        return _.get(this.props, 'Role.get.loading', false)
            || _.get(this.props, 'Role.save.loading', false)
            || _.get(this.props, 'Role.update.loading', false);
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
        const WrappedForm = Form.create()(RoleForm);
        const data = _.get(this.state, 'Role', null);
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
                <WrappedForm ref="form" dict={this.state.Dict}
                             data={data}
                             view={view}
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
                    </Col>
                </Row>
            </div>
        );
    }

    renderTable() {
        let columns = this.buildColumn();
        const pageSize = this.state.query.get('pageSize');
        const list = _.get(this.props, 'Role.list.data', null);
        const loading = _.get(this.props, 'Role.list.loading', false);
        return (
            <div style={{minHeight: '400px'}}>
                {this.renderTools()}
                <Spin spinning={loading}>
                    <Table
                        pagination={false}
                        bordered={true}
                        // rowSelection={this.rowSelection}
                        columns={columns}
                        size="small"
                        dataSource={list}
                        // onChange={this.handleTableChange}
                    ></Table>
                </Spin>
            </div>);
    }

    renderSearch() {
        var props = {
            expand: false,
            prefix: '',
            forms: [
                {
                    id: 'name', label: '角色名', type: 'input',
                },
            ],
            loading: _.get(this.props, 'Role.list.loading', false),
            search: () => {
                let condition = this.refs['qForm'].getCondition();
                this.setState({query: this.state.query.merge(condition)}, this.loadGrid);
            }
        }
        return (
            <Card className="search-card">
                <DynamicQueryForm ref="qForm" {...props}/>
            </Card>
        )
    }

    //主体渲染入口，不要在render里面修改state。
    render() {
        return (
            <div>
                {/*{this.renderSearch()}*/}
                {this.renderTable()}
                {this.renderNewModal()}
            </div>);
    }

    //组件被卸载的时候调用。一般在componentDidMount里面注册的事件需要在这里删除。
    //componentWillUnmount() {

    //}
}

class RoleForm extends Component {
    static propTypes = {
        submit: React.PropTypes.fun,
        form: React.PropTypes.object.required,
    }

    constructor() {
        super();
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {submit} = this.props;
        const dict = _.get(this.props, 'dict');
        const data = _.get(this.props, 'data.data', null);
        const loading = _.get(this.props, 'data.loading', false);
        const view = _.get(this.props, 'view', false);

        const fields = [
            {
                id: 'id',
                label: '主键',
                type: 'hidden',
                rules: [],
            },
            {
                id: 'name',
                label: '角色名',
                type: 'input',
                rules: [
                    {
                        required: true, message: I18nUtil.get('please.input', {name: '角色名'}),
                    },
                ],
            },
            {
                id: 'right',
                label: '权限',
                type: 'checkbox',
                span: 24,
                option: dict.get("rights_dict"), //字典
                rules: [],
            },
        ]
        const props = {
            fields: fields,
            getFieldDecorator: getFieldDecorator,
            submit: submit,
            loading: loading,
            view: view,
            data: data,
            span: 12,
        }
        return (
            <DynamicForm {...props}/>
        )
    }

}
//redux store 属性 对接组件的 props 属性。
function mapStoreToProps(store) {
    return {
        Role: store.get('Role'),
        Right: store.get('Right'),
    }
}

export default connect(mapStoreToProps)(Role);
