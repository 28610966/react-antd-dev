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

import DynamicForm from '@/components/commons/dynamicForm';

import {ReactUtil, I18nUtil, RegExUtil}  from '@/util';

export  default  class FormComponent extends Component {
    static propTypes = {
        submit: React.PropTypes.fun,
        form: React.PropTypes.object.required,
    }

    constructor() {
        super();
    }

    createFields(){
       throw  new Error('必须重写 createFields');
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {submit} = this.props;
        const dict = _.get(this.props, 'dict');
        const data = _.get(this.props, 'data.data', null);
        const loading = _.get(this.props, 'data.loading', false);
        const view = _.get(this.props, 'view', false);
        const fields = this.createFields();

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

