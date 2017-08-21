/**
 * Created by binwang on 17/8/7.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as Antd from 'antd';
import moment from  'moment';
import _ from 'lodash';
import {Map} from 'immutable';

import DynamicQueryForm from '../../commons/dynamicQueryForm';
import DynamicForm from '../../commons/dynamicForm';

import {MenuAction} from '../../../actions';

import {ReactUtil, I18nUtil, RegExUtil}  from '../../../util';



import MonacoEditor from 'react-monaco-editor';

import {List, is} from 'immutable';

const {Table, Card, Row, Input, Col, Button, Modal, Form, Icon, Spin, Alert, Menu, Dropdown, Tree, Popover} = Antd;
const entityName = {name: I18nUtil.get('Menu')};
const TreeNode = Tree.TreeNode;


// const x = 3;
// const y = 2;
// const z = 1;

//
// const generateData = (_level, _preKey, _tns) => {
//     const preKey = _preKey || '0';
//     const tns = _tns;
//
//     const children = [];
//     for (let i = 0; i < x; i++) {
//         const key = `${preKey}-${i}`;
//         tns.push({title: key, key});
//         if (i < y) {
//             children.push(key);
//         }
//     }
//     if (_level < 0) {
//         return tns;
//     }
//     const level = _level - 1;
//     children.forEach((key, index) => {
//         tns[index].children = [];
//         return generateData(level, key, tns[index].children);
//     });
// };
// generateData(z);

class MenuManager extends Component {

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
                pageSize: 1000
            }),
            Menu: null,
            MenuList: List()
        }
    }

    //在组件挂载之前调用一次。如果在这个函数里面调用setState，本次的render函数可以看到更新后的state，并且只渲染一次。
    componentWillMount() {
    }

    loadGrid() {
        ReactUtil(this).action("Menu.list",this.state.query.toObject());
        this.setState({selectedRows: null, message: null});
    }

    //在组件挂载之后调用一次。这个时候，子主键也都挂载好了，可以在这里使用refs。
    componentDidMount() {
        this.loadGrid();
    }

    //props是父组件传递给子组件的。父组件发生render的时候子组件就会调用componentWillReceiveProps（不管props有没有更新，也不管父子组件之间有没有数据交换）。
    componentWillReceiveProps(nextProps) {
        let reactUtil = ReactUtil(this);

        if (_.get(nextProps, 'Menu.get.data.id') !== null && !_.isEqual(_.get(nextProps, 'Menu.get.data.id'), _.get(this.props, 'Menu.get.data.id'))) {
            reactUtil.setState({Menu: _.get(nextProps, 'Menu.get')});
        }

        if (_.get(nextProps, 'Menu.list.data') !== null && !_.isEqual(_.get(nextProps, 'Menu.list.data'), _.get(this.props, 'Menu.list.data'))) {
            reactUtil.setState({MenuList: List(_.get(nextProps, 'Menu.list.data.list'))});
        }

        ['save', 'update'].forEach((op) => {
            let dataId = `Menu.${op}.data`;
            let errorId = `Menu.${op}.error`;
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
        if (_.get(nextProps, 'Menu.list.data', null) === null) {
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
            Object.assign(e, {Menu: null});
        } else {
            Object.assign(e, {view: false});
        }
        ReactUtil(this).setState(e);
    }

    handleOk() {
        this.refs.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({Menu: {data: values}});
                if (_.get(values, 'id', null) === null) {
                    ReactUtil(this).action("Menu.save",(values));
                } else {
                    ReactUtil(this).action("Menu.update",(values));
                }
            }
        });
    }

    dictDecorator(dict) {
        return _.map(dict, (v, k) => {
            return {'text': v, 'value': k}
        });
    }

    updateOne(e) {
        ReactUtil(this).action("Menu.get",e);
        this.setState({view: false}, this.openNewModal.bind(this, true));
    }

    updateAll() {
        const list = _.get(this.state, 'MenuList', List()).toArray();
    }

    view(e) {
        ReactUtil(this).action("Menu.get",e);
        this.setState({view: true}, this.openNewModal.bind(this, true));
    }

    deleteOne(e) {
        ReactUtil(this).action("Menu.delete",e);
    }

    deleteMore() {
        if (_.isNull(this.state.selectedRows) || _.isEmpty(this.state.selectedRows)) {
            Antd.message.error(I18nUtil.get('no.data.selected'));
        } else {
            Modal.confirm({
                title: I18nUtil.get('are.you.sure'),
                onOk: () => {
                    var ids = this.state.selectedRows.map(m => m.id).join(',');
                    ReactUtil(this).action("Menu.delete",{id: ids});
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
        return _.get(this.props, 'Menu.get.loading', false)
            || _.get(this.props, 'Menu.save.loading', false)
            || _.get(this.props, 'Menu.update.loading', false);
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
        const WrappedForm = Form.create()(MenuForm);
        const data = _.get(this.state, 'Menu', null);
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
                             data={data} view={view}></WrappedForm>
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
                        <Button type="primary"
                                onClick={this.updateAll.bind(this)}
                                icon='save'>all</Button>
                        {/*<Dropdown overlay={menu}>*/}
                        {/*<Button>*/}
                        {/*{I18nUtil.get('button.text.batch.operation')} <Icon type="down"/>*/}
                        {/*</Button>*/}
                        {/*</Dropdown>*/}
                    </Col>
                </Row>
            </div>
        );
    }

    onDragEnter = (info) => {
        console.log(info);
        // expandedKeys 需要受控时设置
        // this.setState({
        //   expandedKeys: info.expandedKeys,
        // });
    }
    onDrop = (info) => {
        console.log(info);
        const dropKey = info.node.props.eventKey;
        const dragKey = info.dragNode.props.eventKey;
        const dropPos = info.node.props.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
        // const dragNodesKeys = info.dragNodesKeys;
        const loop = (data, key, callback) => {
            data.forEach((item, index, arr) => {
                if (item.id + '_' + item.title === key) {
                    return callback(item, index, arr);
                }
                if (item.children) {
                    return loop(item.children, key, callback);
                }
            });
        };
        const data = _.get(this.state, 'MenuList', List()).toArray();
        let dragObj;
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });
        if (info.dropToGap) {
            let ar;
            let i;
            loop(data, dropKey, (item, index, arr) => {
                ar = arr;
                i = index;
            });
            if (dropPosition === -1) {
                ar.splice(i, 0, dragObj);
            } else {
                ar.splice(i - 1, 0, dragObj);
            }
        } else {
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                // where to insert 示例添加到尾部，可以是随意位置
                item.children.push(dragObj);
            });
        }
        this.setState({
            MenuList: List(data),
        });
    }

    renderTable() {
        //const msg = _.get(this.state, 'message', null);
        const pageSize = this.state.query.get('pageSize');
        const list = _.get(this.state, 'MenuList', List()).toArray();
        const total = _.get(this.props, 'Menu.list.data.total', 0);
        const loading = _.get(this.props, 'Menu.list.loading', false);
        const options = {
            selectOnLineNumbers: true
        };

        const loop = list => list.map((item) => {
            if (item.children && item.children.length) {
                return <TreeNode onDbl key={item.id + '_' + item.title}
                                 title={item.title}>{loop(item.children)}</TreeNode>;
            }
            return <TreeNode key={item.id + '_' + item.title} title={item.title}/>;
        });

        return (
            <div>
                {this.renderTools()}
                {/*<Alert style={{marginBottom: '10px', display: _.isNull(msg) ? 'none' : 'block'}} message={msg}*/}
                {/*type="info" showIcon/>*/}
                <Spin spinning={loading}>
                    <Row>
                        <Col span="6">
                            <Tree
                                className="draggable-tree"
                                draggable
                                onDragEnter={this.onDragEnter}
                                onDrop={this.onDrop}
                            >
                                {loop(list)}
                            </Tree>
                        </Col>
                        <Col span="18">
                            <div style={{border: "1px solid #e9e9e9", height: "600px"}}>
                                <MonacoEditor
                                    width="100%"
                                    height="100%"
                                    language="json"
                                    value={JSON.stringify(list)}
                                    options={options}
                                /></div>
                        </Col>

                    </Row>
                    {/*<Table*/}
                    {/*pagination={{*/}
                    {/*pageSize: pageSize,*/}
                    {/*showSizeChanger: true,*/}
                    {/*showQuickJumper: true,*/}
                    {/*total: total*/}
                    {/*}}*/}
                    {/*bordered={true}*/}
                    {/*rowSelection={this.rowSelection}*/}
                    {/*columns={columns}*/}
                    {/*size="small"*/}
                    {/*dataSource={list}*/}
                    {/*onChange={this.handleTableChange}*/}
                    {/*></Table>*/}
                    {/*<Tree*/}
                    {/*showLine*/}
                    {/*defaultExpandedKeys={['0-0']}*/}
                    {/*// onSelect={this.onSelect}*/}
                    {/*>*/}
                    {/*<TreeNode title={*/}
                    {/*<Popover placement="right"*/}
                    {/*content={<div>*/}
                    {/*<p><a onClick={this.addChild.bind(this)}><Icon type="plus"></Icon></a></p>*/}
                    {/*</div>}*/}
                    {/*trigger="hover">*/}
                    {/*<div>菜单树</div>*/}
                    {/*</Popover>*/}
                    {/*} key="0-0">*/}
                    {/*{list.map(m1 => {*/}
                    {/*return <TreeNode title={*/}
                    {/*<Popover placement="right"*/}
                    {/*content={<div>*/}
                    {/*<p><a onClick={this.addChild.bind(this, m1.id)}><Icon*/}
                    {/*type="edit"></Icon></a></p>*/}
                    {/*<p><a onClick={this.addChild.bind(this, m1.id)}><Icon*/}
                    {/*type="delete"></Icon></a></p>*/}
                    {/*<p><a onClick={this.addChild.bind(this, m1.id)}><Icon*/}
                    {/*type="plus"></Icon></a></p>*/}
                    {/*</div>}*/}
                    {/*trigger="hover">*/}
                    {/*<div>{*/}
                    {/*m1.title ? m1.title : <div>*/}
                    {/*<Input placeholder="名称" style={{width:'100px'}} size="small"/>*/}
                    {/*<Input placeholder="路径" style={{width:'100px'}} size="small"/>*/}
                    {/*<Input  placeholder="Icon" style={{width:'100px'}} size="small"/>*/}
                    {/*<Button size="small" type="primary" icon="save"/>*/}
                    {/*</div>*/}
                    {/*}</div>*/}
                    {/*</Popover>*/}
                    {/*} key={m1.id}>*/}
                    {/*{*/}
                    {/*m1.children.map(m2 => {*/}
                    {/*return <TreeNode title={*/}
                    {/*m2.title ? m2.title : <div>*/}
                    {/*<Input placeholder="名称" style={{width:'100px'}} size="small"/>*/}
                    {/*<Input placeholder="路径" style={{width:'100px'}} size="small"/>*/}
                    {/*<Input  placeholder="Icon" style={{width:'100px'}} size="small"/>*/}
                    {/*<Button size="small" type="primary" icon="save"/>*/}
                    {/*</div>*/}
                    {/*} key={m2.id}/>*/}
                    {/*})*/}
                    {/*}*/}
                    {/*</TreeNode>*/}
                    {/*})}*/}
                    {/*</TreeNode>*/}
                    {/*</Tree>*/}
                </Spin>
            </div>);
    }

    addChild(id) {
        const list = this.state.MenuList.toArray();
        _.forEach(list, l => {
            if (l.id === id) {
                l.children.push({})
            }
        })
        this.setState({MenuList: List(list)});
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

class MenuForm extends Component {
    static propTypes = {
        form: React.PropTypes.object.required,
    }

    constructor() {
        super();
    }

    render() {
        const {getFieldDecorator} = this.props.form;
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
                id: 'title',
                label: '菜单名',
                type: 'input',
                rules: [{
                    required: true, message: I18nUtil.get('please.input', {name: '菜单名'}),
                }]
            },
            {
                id: 'code',
                label: '编码',
                type: 'input',
                rules: [{
                    required: true, message: I18nUtil.get('please.input', {name: '编码'}),
                }]
            },
            {
                id: 'path',
                label: '路径',
                type: 'input',
                rules: [{
                    required: true, message: I18nUtil.get('please.input', {name: '路径'}),
                }]
            },
        ]
        const props = {
            fields: fields,
            getFieldDecorator: getFieldDecorator,
            loading: loading,
            view: view,
            data: data,
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
        Menu: store.get('Menu'),
    }
}

export default connect(mapStoreToProps)(MenuManager);