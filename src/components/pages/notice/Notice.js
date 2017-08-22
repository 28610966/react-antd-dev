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
import CrudComponent from '@/components/commons/CrudComponent';
import FormComponent from '@/components/commons/FormComponent';

import {ReactUtil, I18nUtil, RegExUtil}  from '@/util';


class Notice extends CrudComponent {

    //构造函数，在创建组件的时候调用一次。
    constructor(props) {
        super(props);
        this.entity = 'Notice';
        this.entityName = I18nUtil.get(this.entity, '通知');
        this.FormCompopent = NoticeForm;
    }

    willMount(){
        ReactUtil(this).action('Dict.list');
    }

    createColumns() {
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
                    vv = _.chain(this.state.Dict.get("Dicts")).filter(s => v === s.value || _.indexOf(v, s.value) > -1).map(t => t.label).join(",").value();
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
        ]
        return columns;
    }

    createSearchTool() {
        return {
            expand: false,
            prefix: '',
            forms: [
                {
                    id: 'title', label: '标题', type: 'input',
                },
                {
                    id: 'notice_time', label: '通知时间', type: 'datepicker',
                    span: 8,
                },
                {
                    id: 'notice_area', label: '通知范围', type: 'checkbox',
                    option: this.state.Dict.get("Dicts"),
                },
                {
                    id: 'content', label: '内容', type: 'textarea',
                    span: 24,
                    rows: 4,
                },
            ],
        }
    }
}

class NoticeForm extends FormComponent {
    createFields(){
        const dict = _.get(this.props, 'dict');
        return [
            {
                id: 'id',
                label: '主键',
                type: 'hidden',
                rules: [],
            },
            {
                id: 'title',
                label: '标题',
                type: 'input',
                rules: [
                    {
                        required: true, message: I18nUtil.get('please.input', {name: '标题'}),
                    },
                ],
            },
            {
                id: 'notice_time',
                label: '通知时间',
                type: 'datepicker',
                rules: [
                    {
                        required: true, message: I18nUtil.get('please.input', {name: '通知时间'}),
                    },
                ],
            },
            {
                id: 'notice_area',
                label: '通知范围',
                type: 'checkbox',
                span: 24,
                option: dict.get("Dicts"), //字典
                rules: [],
            },
            {
                id: 'content',
                label: '内容',
                type: 'textarea',
                rows: 4,
                span: 24,
                rules: [
                    {
                        required: true, message: I18nUtil.get('please.input', {name: '内容'}),
                    },
                ],
            },
        ]
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
