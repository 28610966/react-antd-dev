/**
 * Created by binwang on 2017/4/5.
 */
import React from 'react';
import {connect} from 'react-redux';
import pureRender from "pure-render-immutable-decorator";
import {Form, Input, Button, Icon, Checkbox, Spin, message} from 'antd';
import {Layout, Row, Col} from 'antd';
import _ from 'lodash';
import {ReactUtil} from '@/util';
const {Header, Footer, Sider, Content} = Layout;

const FormItem = Form.Item;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}


@pureRender
class Login extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = {
            login: {
                visible: false
            },
            WrappedForm: null
        }
    }

    componentWillMount() {
        const WrappedForm = Form.create()(LoginForm);
        this.setState({WrappedForm});
        ReactUtil(this).action('App.get',{id:1})
    }

    componentWillReceiveProps(nextProps) {
        let error = _.get(nextProps, "Login.get.error", false);
        error && message.error(error, 4);
    }

    render() {
        const {WrappedForm} = this.state;
        const {get} = this.props.Login;
        return (
            <div className="login-container">
                <Spin spinning={!!get && !!get.loading}>
                    <Layout>
                        <Header>{_.get(this.props,'App.get.data.appName')}</Header>
                        <Content>
                            <WrappedForm ref="form" handleSubmit={this.handleSubmit.bind(this)}></WrappedForm>
                        </Content>
                        <Footer/>
                    </Layout>
                </Spin>
            </div>
        )
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.refs.form.validateFields((err, values) => {
            if (!err) {
                ReactUtil(this).action("Login.login",values);
            }
        });
    }
}

class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    resetDo() {
        this.props.form.resetFields();
    }

    render() {
        const form = this.props.form;
        const {getFieldDecorator} = form;

        return ( <Form onSubmit={this.props.handleSubmit} className="login-form">
            <FormItem>
                {getFieldDecorator('username', {
                    rules: [{
                        required: true, message: 'Please input username',
                    }],
                })(
                    <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="Username"/>
                )}
            </FormItem>
            <FormItem>
                {getFieldDecorator('password', {
                    rules: [{
                        required: true, message: 'Please input password',
                    }],
                })(
                    <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>} type="password"
                           placeholder="Password"/>
                )}
            </FormItem>
            <Row type='flex'>
                <Col span="12">
                    用户名: admin 密码: 000000
                </Col>
                <Col span="12" style={{textAlign:'right'}}>
                    <Button type='primary' htmlType="submit" style={{marginRight:'5px'}}>Login</Button>
                    <Button type='default' onClick={this.resetDo.bind(this)}>rest</Button>
                </Col>
            </Row>

        </Form>)
    }
}

function mapStateToProps(state) {
    return {
        Login: state.get('Login'),
        App: state.get('App')
    };
}

export default connect(mapStateToProps)(Login);
