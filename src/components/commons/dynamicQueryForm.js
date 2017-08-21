/**
 * Created by binwang on 17/7/31.
 */
import React from 'react';
import * as Antd from 'antd';
import _ from 'lodash';
import {I18nUtil} from '../../util';
import {Map, is} from 'immutable';

export default  class DynamicQueryForm extends React.Component {

    static propTypes = {
        forms: React.PropTypes.array,
        search: React.PropTypes.fun
    }

    reset() {
        this.refs.form.resetFields();
    }

    getCondition() {
        let map = null;
        this.refs.form.validateFieldsAndScroll((err, values) => {
            map = Map(values);
        });
        return map;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!_.isEqual(nextProps.forms, this.props.forms)) {
            return true;
        }
        if (nextState !== this.state)
            return true;
        return false;
    }

    render() {
        const WrappedForm = Antd.Form.create()(InnerForms);
        return (<WrappedForm ref="form" {...this.props} onReset={this.reset.bind(this)}></WrappedForm>);
    }

}

class InnerForms extends React.Component {
    static propTypes = {
        forms: React.PropTypes.array,
        onReset: React.PropTypes.fun
    }

    constructor() {
        super();
        this.state = {
            condition: Map(),
            expansion: false,
        }
    }

    toggleExpansion() {
        this.setState({expansion: !this.state.expansion});
    }

    renderButtons() {
        const {forms, loading, search} = this.props;
        return (<Antd.Col span="4">
            <Antd.Form.Item>
                <Antd.Button.Group size="small">
                    <Antd.Button size="small" type='primary' loading={loading} htmlType="submit">{I18nUtil.get('button.text.query', '查询')}</Antd.Button>
                    <Antd.Button size="small"
                                 onClick={this.props.onReset}>{I18nUtil.get('button.text.reset', '重置')}</Antd.Button>
                    {
                        forms.length >= 4 ? (
                            <a onClick={this.toggleExpansion.bind(this)}
                               style={{marginLeft: '10px'}}>{this.state.expansion ? I18nUtil.get('button.text.fold') : I18nUtil.get('button.text.unfold')}
                                <Antd.Icon
                                    type={this.state.expansion ? 'up' : 'down'}></Antd.Icon></a>
                        ) : null
                    }
                </Antd.Button.Group>
            </Antd.Form.Item>
        </Antd.Col>);
    }
    search(e){
        e.preventDefault();
        this.props.search();
    }


    render() {
        const {forms} = this.props;
        const {expansion} = this.state;
        let forms1 = [];
        let forms2 = [];
        if(forms.length >= 4){
            forms1 = _.slice(forms,0,3);
            forms2 = _.slice(forms,3,forms.length);
        }else{
            forms1 = forms;
        }
        return (
            <Antd.Form onSubmit={this.search.bind(this)} ref="form" layout="inline" style={{lineHeight: '40px'}}>
                <Antd.Row type="flex">
                    {_.map(forms1, (f, i) => this.createForm(f, i))}
                    {this.renderButtons()}
                    { expansion ? _.map(forms2, (f, i) => this.createForm(f, i)) : null}
                </Antd.Row>
            </Antd.Form>
        );
    }

    getCondition() {
        return this.state.condition;
    }

    setValue(id, value) {
        if (_.isNull(value)) {
            this.setState({condition: this.state.condition.remove(id)});
        } else
            this.setState({condition: this.state.condition.set(id, value)});
    }

    changeInput(e) {
        let {id, value} = e.target;
        this.setValue(id, value);
    }

    changeSelect(id, e) {
        this.setValue(id, e);
    }

    changeDate(id, e) {
        this.setValue(id, e);
    }

    createForm(f, i) {

        const {getFieldDecorator} = this.props.form;
        const {prefix = ''} = this.props;
        const {size = 'small'} = f;

        let _id = `${prefix}${f.id}`;
        let _id_begin = `${prefix}${f.id}_begin`;
        let _id_end = `${prefix}${f.id}_end`;
        let _id_range = `${prefix}${f.id}_range`;

        if (!f.type || f.type === 'input') {
            return this.createFormItem(f, i, getFieldDecorator(_id, {
                initialValue: f.defaultValue,
            })(<Antd.Input size={size} onChange={this.changeInput.bind(this)} id={_id}/>));
        } else if (f.type === 'select' || f.type === 'checkbox' || f.type === 'radio') {
            return this.createFormItem(f, i, getFieldDecorator(_id, {
                initialValue: f.defaultValue,
            })(
                <Antd.Select size={size} mode={f.mode || ''} style={f.style || {width: '120px'}} id={_id}
                             onChange={this.changeSelect.bind(this, _id)}>
                    {
                        _.map(f.option, (v) => <Antd.Select.Option disabled={f.disabled || false} key={v.value}
                                                                   value={v.value}>{v.label}</Antd.Select.Option>)
                    }
                </Antd.Select>));
        } else if (f.type === 'datepicker') {
            return this.createFormItem(f, i, <div>
                {getFieldDecorator(_id_begin, {
                    initialValue: _.get(f, 'defaultValue.begin', null),
                })(<Antd.DatePicker style={{width:'100px'}} size={size} id={_id_begin} onChange={this.changeDate.bind(this, _id_begin)}/>)}
                -
                {getFieldDecorator(_id_end, {
                    initialValue: _.get(f, 'defaultValue.end', null),
                })(<Antd.DatePicker style={{width:'100px'}} size={size} id={_id_end} onChange={this.changeDate.bind(this, _id_end)}/>)}
            </div>)
        } else if (f.type === 'rangepicker') {
            return this.createFormItem(f, i, getFieldDecorator(_id_range, null)(<Antd.DatePicker.RangePicker
                size={size}
                id={_id_range}
                onChange={this.changeDate.bind(this, _id_range)}/>));
        }
    }

    createFormItem(f, i, chilren) {
        const {span, label} = f;

        return (
            <Antd.Col span={span || 6}
                      key={`q_c_${label}`}>
                <Antd.Form.Item key={`q_f_${label}`} label={label}>
                    {chilren}
                </Antd.Form.Item>
            </Antd.Col>
        )
    }
}