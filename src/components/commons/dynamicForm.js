/**
 * Created by binwang on 17/7/31.
 */
import React from 'react';
import * as Antd from 'antd';
import _ from 'lodash';
import moment from 'moment';
import {LayoutUtil as FormLayout ,I18nUtil} from '../../util';
import CopyToClipboard from 'react-copy-to-clipboard';

export default  class DynamicForm extends React.Component {

    static propTypes = {
        fields: React.PropTypes.array,
        search: React.PropTypes.fun,
        getFieldDecorator: React.PropTypes.fun,
        data: React.PropTypes.object,
        span: React.PropTypes.number,
        view: React.PropTypes.boolean,
        submit: React.PropTypes.fun,
    }

    submit(e){
        e.preventDefault();
        this.props.submit();
    }

    render() {
        const {fields, loading, view = false} = this.props;
        return (
            <Antd.Spin spinning={loading}>
                <Antd.Form onSubmit={this.submit.bind(this)}>
                    <Antd.Row type="flex">
                        {fields.map(f => (!view ? this.createForm(f) : this.createText(f)))}
                    </Antd.Row>
                    <Antd.Button style={{display:'none'}} htmlType="submit">提交</Antd.Button>
                </Antd.Form>
            </Antd.Spin>
        );
    }

    createText(f) {
        const {data} = this.props;
        let value;
        if (f.type === 'select' || f.type === 'radio'){
            value = _.get(_.find(f.option, {value: _.get(data, f.id, null)}), 'label');
        } else if (f.type === 'checkbox') {
            value =  _.chain(f.option).filter(s => _.indexOf(_.get(data, f.id, []),s.value) > -1).map(t => t.label).join(",").value();
        } else if (f.type === 'datepicker') {
            const r = _.get(data, f.id, null);
            value = !!r ? moment(r).format(f.format || I18nUtil.get("format.date")) : '';
        }else {
            value = _.get(data, f.id, null);
        }
        if (value === null || value === '') {
            return this.createFormItem(f, value);
        } else {
            return this.createFormItem(f, <CopyToClipboard text={value} onCopy={() => {
                this.setState({copied: true});
                Antd.message.success(I18nUtil.get("alert.copy.clipboard",{name:f.label}));
            }}>
                <Antd.Tooltip placement="topLeft" title={`单击复制${f.label}`}>
                <div>{value}</div>
                </Antd.Tooltip>
            </CopyToClipboard>);
        }
    }

    createForm(f) {
        const {getFieldDecorator, data} = this.props;
        const {style, size = 'large', readOnly = false, addonBefore, addonAfter, onChange} = f;
        const type = f.type.toLowerCase();
        if (!!f.render && _.isFunction(f.render)) {
            return f.render();
        } else if (!type || type === 'input' || type === 'password' || type === 'hidden' || type === 'textarea') {
            return this.createFormItem(f, (
                getFieldDecorator(f.id, {
                    initialValue: _.get(data, f.id, f.defaultValue || null),
                    rules: f.rules
                })(
                    <Antd.Input {...f}/>
                )
            ));
        } else if (type === 'autocomplete') {
            return this.createFormItem(f, (
                getFieldDecorator(f.id, {
                    initialValue: _.get(data, f.id, f.defaultValue || null),
                    rules: f.rules
                })(
                    <Antd.AutoComplete {...f} />
                )
            ));
        } else if (type === 'number') {
            return this.createFormItem(f, (
                getFieldDecorator(f.id, {
                    initialValue: _.get(data, f.id, f.defaultValue || null),
                    rules: f.rules
                })(
                    <Antd.InputNumber {...f}/>
                )
            ));
        } else if (type === 'select') {
            return this.createFormItem(f, (
                getFieldDecorator(f.id, {
                    initialValue: _.get(data, f.id, f.defaultValue || null),
                    rules: f.rules,
                })(
                    <Antd.Select {...f}>
                        {_.map(f.option, (v) => <Option disabled={f.disabled || false} key={v.value}
                                                        value={v.value}>{v.label}</Option>)}
                    </Antd.Select>
                )
            ));
        } else if (type === 'radio') {
            return this.createFormItem(f, (
                getFieldDecorator(f.id, {
                    initialValue: _.get(data, f.id, f.defaultValue || null),
                    rules: f.rules,
                })(
                    <Antd.Radio.Group>
                        {_.map(f.option, (v) => <Antd.Radio key={v.value} value={v.value}>{v.label}</Antd.Radio>)}
                    </Antd.Radio.Group>
                )
            ));
        } else if (type === 'checkbox') {
            return this.createFormItem(f, (
                getFieldDecorator(f.id, {
                    initialValue: _.get(data, f.id, f.defaultValue || null),
                    rules: f.rules,
                })(
                    <Antd.Checkbox.Group>
                        {_.map(f.option, (v) => <Antd.Checkbox key={v.value} value={v.value}>{v.label}</Antd.Checkbox>)}
                    </Antd.Checkbox.Group>
                )
            ));
        } else if (type === 'datepicker') {
            return this.createFormItem(f, (
                getFieldDecorator(f.id, {
                    initialValue: _.get(data, f.id, f.defaultValue || null) === null ? null : moment(_.get(data, f.id, null)),
                    rules: f.rules,
                })(
                    <Antd.DatePicker {...f} style={{width: '224px'}}/>
                )
            ))
        } else if (type === 'cascader') {
            return this.createFormItem(f, (
                getFieldDecorator(f.id, {
                    initialValue: _.get(data, f.id, f.defaultValue || null) === null ? null : moment(_.get(data, f.id, null)),
                    rules: f.rules,
                })(
                    <Antd.Cascader {...f}  options={f.options}/>
                )
            ))
        }
    }

    createFormItem(f, chilren) {
        const span = f.span || this.props.span;
        const layout = span === 12 ? FormLayout.large : FormLayout.normal;
        let style = f.style;
        if (f.type === 'hidden') {
            style = _.assign(f.style, {display: 'none'});
        }
        return (
            <Antd.Col key={`col_${f.id}`} span={span } style={style}>
                <Antd.Form.Item
                    label={f.label}
                    {...layout}
                    hasFeedback
                    style={f.style}>
                    {chilren}
                </Antd.Form.Item>
            </Antd.Col>
        )
    }
}