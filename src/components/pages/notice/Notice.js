/**
 *  auto create grid component
 *  author binwang.local date 2017-08-21
 */

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as Antd from 'antd';
import moment from  'moment';
import _ from 'lodash';
import {Map} from 'immutable';

import DynamicQueryForm from '@/components/commons/dynamicQueryForm';
import DynamicForm from '@/components/commons/dynamicForm';

import {ReactUtil, I18nUtil, RegExUtil}  from '@/util';

const {Table, Card, Row, Col, Button, Modal, Form, Icon, Spin, Alert, Menu, Dropdown} = Antd;
const entityName = {name: I18nUtil.get('Notice','通知')};

class Notice extends Component {

    static propTypes = {};

    //构造函数，在创建组件的时候调用一次。
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            selectedRows: null,
            filteredInfo: null,
            sortedInfo: null,
            query: Map({
                current: 1,
                pageSize: 20
            }),
            Dict: Map({
                Dicts : null,
            }),
            Notice: null
        }
    }

    //在组件挂载之前调用一次。如果在这个函数里面调用setState，本次的render函数可以看到更新后的state，并且只渲染一次。
    componentWillMount() {
            ReactUtil(this).action("Dict.list");
    }

    loadGrid() {
        ReactUtil(this).action("Notice.list",this.state.query.toObject());
        this.setState({selectedRows: null, message: null});
    }

    //在组件挂载之后调用一次。这个时候，子主键也都挂载好了，可以在这里使用refs。
    componentDidMount() {
        this.loadGrid();
    }

    //props是父组件传递给子组件的。父组件发生render的时候子组件就会调用componentWillReceiveProps（不管props有没有更新，也不管父子组件之间有没有数据交换）。
    componentWillReceiveProps(nextProps) {
        let reactUtil = ReactUtil(this);

        if (reactUtil.diff(nextProps,'Notice.get.data.id')) {
            reactUtil.setState({ Notice: _.get(nextProps, 'Notice.get')});
        }
        if (reactUtil.diff(nextProps,'Dict.list.data')) {
            let Dicts = _.get(nextProps, 'Dict.list.data');
            reactUtil.setState({Dict: this.state.Dict.set("Dicts", _.map(Dicts, m => {
                return {value: m.id, label: m.name };
            }))});
        }

        ['save', 'update', 'delete'].forEach((op) => {
            let dataId = `Notice.${op}.data`;
            let errorId = `Notice.${op}.error`;
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
        if (_.get(nextProps, 'Notice.list.data', null) === null) {
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
            Object.assign(e, { Notice: null});
        }else{
            Object.assign(e, {view: false});
        }
        ReactUtil(this).setState(e);
    }

    handleOk() {
        this.refs.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({ Notice: {data: values}});
                if (_.get(values, 'id', null) === null) {
                    ReactUtil(this).action("Notice.save",values);
                } else {
                    ReactUtil(this).action("Notice.update",values);
                }
            }
        });
    }

    buildColumn() {
        let columns = [
            {
                dataIndex: 'title',
                title: '标题',
                width: '10%',
                 sorter: true,
                 render: (v, e) => {
                    let vv = v;
                    return vv;
                }
            },
            {
                dataIndex: 'notice_time',
                title: '通知时间',
                width: '10%',
                 sorter: true,
                 render: (v, e) => {
                    let vv = v;
                     vv = !!v ? moment(v).format(I18nUtil.get("format.date")) : '';
                    return vv;
                }
            },
            {
                dataIndex: 'notice_area',
                title: '通知范围',
                width: '10%',
                 sorter: true,
                 render: (v, e) => {
                    let vv = v;
                       vv = _.chain(this.state.Dict.get("Dicts")).filter(s => v === s.value || _.indexOf(v,s.value) > -1).map(t => t.label).join(",").value();
                    return vv;
                }
            },
            {
                dataIndex: 'content',
                title: '内容',
                width: '10%',
                 sorter: true,
                 render: (v, e) => {
                    let vv = v;
                    return vv;
                }
            },
            {
                title: '',
                dataIndex: 'id',
                key: 'id',
                render: (v, e) => {
                    return (<div style={{display: 'flex'}}>
                        <a onClick={this.view.bind(this, e)}>{I18nUtil.get('button.text.view')}</a>
                        <span className="separator">|</span>
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
        ReactUtil(this).action("Notice.get",e);
        this.setState({view:false},this.openNewModal.bind(this,true));
    }
    view(e) {
        ReactUtil(this).action("Notice.get",e);
        this.setState({view:true},this.openNewModal.bind(this,true));
    }

    deleteOne(e) {
        ReactUtil(this).action("Notice.delete",e);
    }

    deleteMore() {
        if (_.isNull(this.state.selectedRows) || _.isEmpty(this.state.selectedRows)) {
            Antd.message.error(I18nUtil.get('no.data.selected'));
        } else {
            Modal.confirm({
                title: I18nUtil.get('are.you.sure'),
                onOk: () => {
                    var ids = this.state.selectedRows.map(m => m.id).join(',');
                     ReactUtil(this).action("Notice.delete",{id: ids});
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
        return _.get(this.props, 'Notice.get.loading', false)
            || _.get(this.props, 'Notice.save.loading', false)
            || _.get(this.props, 'Notice.update.loading', false);
    }
    
    handleTableChange = (pagination, filters, sorter) => {
        let query = this.state.query
            .set('current', pagination.current)
            .set('pageSize', pagination.pageSize)
            .set('sortField',sorter.field)
            // .set('filters',filters)
            .set('sortOrder',sorter.order);
        this.state.query = query;
        this.loadGrid();
    }

    renderNewModal() {
        const WrappedForm = Form.create()(NoticeForm);
        const data = _.get(this.state, 'Notice', null);
        const loading = this.getLoading();
        const {view = false, modalShow} = this.state;
        let title ='';
        if(view){
            title = I18nUtil.get('modal.title.view', '', entityName);
        }else if(_.get(data,'data.id',null) === null){
            title = I18nUtil.get('modal.title.add', '', entityName);
        }else {
            title = I18nUtil.get('modal.title.edit', '', entityName);
        }

        return (<Modal
            style={{top: '20px',display: modalShow?'block':'none'}}
            width={800}
            title={title}
            visible={modalShow}
            okText={I18nUtil.get('ok')}
            onOk={!view ? this.handleOk.bind(this): this.openNewModal.bind(this, false)}
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
        const pageSize = this.state.query.get('pageSize');
        const list = _.get(this.props, 'Notice.list.data.list', null);
        const total = _.get(this.props, 'Notice.list.data.total', 0);
        const loading = _.get(this.props, 'Notice.list.loading', false);
        return (
            <div>
                {this.renderTools()}
                <Spin spinning={loading}>
                    <Table
                        pagination={{
                            pageSize: pageSize,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            total: total
                        }}
                        bordered={true}
                        rowSelection={this.rowSelection}
                        columns={columns}
                        size="small"
                        dataSource={list}
                        onChange={this.handleTableChange}
                    ></Table>
                </Spin>
            </div>);
    }

    renderSearch() {
        var props = {
            expand: false,
            prefix: '',
            forms: [
                        {id: 'title', label: '标题', type: 'input',
                        },
                        {id: 'notice_time', label: '通知时间', type: 'datepicker',
                        span: 8, 
                        },
                        {id: 'notice_area', label: '通知范围', type: 'checkbox',
                        option: this.state.Dict.get("Dicts"), 
                        },
                        {id: 'content', label: '内容', type: 'textarea',
                        span: 24, 
                        rows: 4,
                        },
            ],
            loading: _.get(this.props, 'Notice.list.loading', false),
            search: () => {
                let condition = this.refs['qForm'].getCondition();
                this.setState({query:this.state.query.merge(condition)},this.loadGrid);
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
                {this.renderSearch()}
                {this.renderTable()}
                {this.renderNewModal()}
            </div>);
    }

    //组件被卸载的时候调用。一般在componentDidMount里面注册的事件需要在这里删除。
    //componentWillUnmount() {

    //}
}

class NoticeForm extends Component {
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
                rules: [
                ],
            },
            {
                id: 'title',
                label: '标题',
                type: 'input',
                rules: [
                    {
                    required:true, message: I18nUtil.get('please.input', {name: '标题'}),
                    },
                ],
            },
            {
                id: 'notice_time',
                label: '通知时间',
                type: 'datepicker',
                rules: [
                    {
                    required:true, message: I18nUtil.get('please.input', {name: '通知时间'}),
                    },
                ],
            },
            {
                id: 'notice_area',
                label: '通知范围',
                type: 'checkbox',
                span: 24,
                option: dict.get("Dicts") , //字典
                rules: [
                ],
            },
            {
                id: 'content',
                label: '内容',
                type: 'textarea',
                rows: 4,
                span: 24,
                rules: [
                    {
                    required:true, message: I18nUtil.get('please.input', {name: '内容'}),
                    },
                ],
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
        Notice: store.get('Notice'),
        Dict: store.get('Dict'),
    }
}

export default connect(mapStoreToProps)(Notice);
