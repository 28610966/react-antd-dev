import React from 'react';
import {connect} from 'react-redux';
import {Menu, Dropdown, Icon, Layout, Breadcrumb, Row, Col, Badge, Tooltip, BackTop} from 'antd';
import {Link} from 'react-router';
import screenfull from 'screenfull';
import pureRender from "pure-render-immutable-decorator";
import ReactUtil from '../../util/ReactUtil';
import LeftMenu from './LeftMenu';
import Login from '../pages/Login';
import _ from 'lodash';
import store from 'store';
import {I18nUtil} from '../../util';
import Welcome from './welcome';
import DevelopAssistentIcon from '../pages/code/DevelopAssistentIcon';


const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const {Header, Sider, Content} = Layout;

@pureRender
class Frame extends React.Component {

    constructor() {
        super();
        this.state = {
            collapsed: false,
            role: {
                name: '平台管理员',
                id: 1
            },
            roles: [
                {id: 1, name: '平台管理员'},
                {id: 2, name: '租户管理员'},
                {id: 3, name: '租户配置员'},
                {id: 4, name: '租户审计员'},
                {id: 5, name: '租户运维'},
            ]
        };
    }

    screenFull = () => {
        if (screenfull.enabled) {
            screenfull.toggle();
            // this.setState({isFullscreen: screenfull.isFullscreen()});
        }
    };

    changeLang(lang) {
        store.set('lang', lang);
        window.location.reload();
    }

    componentDidMount() {

        ReactUtil(this).action('Login.getLoginCache');
    }

    //props是父组件传递给子组件的。父组件发生render的时候子组件就会调用componentWillReceiveProps（不管props有没有更新，也不管父子组件之间有没有数据交换）。
    componentWillReceiveProps(nextProps) {
    }


    logout() {
        ReactUtil(this).action("Login.logout");
    }

    renderLogin() {
        return (<Login></Login>);
    }

    renderWelcome() {
        return (<Welcome></Welcome>);
    }

    changeRole(id, name) {
        this.setState({role: {id: id, name: name}});
    }

    renderMain() {
        const {children, title, logo, user} = this.props;
        const {roles} = this.state;
        const {isFullscreen} = this.state;
        let contentStyle = {
            overflowY: 'auto',
            margin: '0px',
            marginTop: '1px',
            padding: '8px',
            background: '#fff',
            height: '100%'
        };
        if(_.get(this.props,"children.props.route.iframe",false)){
            contentStyle = {
                ...contentStyle,
                padding: '0px',
            }
        }
        return (<Layout >
            <Layout>
                <Sider
                    trigger={null}
                    style={{height: '100%'}}
                    collapsible
                    collapsed={this.state.collapsed}>
                    <div style={{textAlign: "center", height: '40px', lineHeight: "40px"}}>
                        <Link to='/'>
                            {/*<img style={{width: '20px', display: 'inline-block'}} src={logo}/>*/}
                            <span className="logo"><Icon type={logo || "laptop"}
                                                         style={{marginRight: '5px'}}/>{title}</span>
                        </Link>
                    </div>
                    <LeftMenu {...this.props} role={this.state.role} collapsed={this.state.collapsed}></LeftMenu>
                </Sider>
                <Layout>
                    <Header style={{background: '#fff', padding: 0}}>
                        <Row>
                            <Col style={{display: 'flex'}} span={12}>
                                <Icon
                                    className="trigger"
                                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                    onClick={this.toggle.bind(this)}
                                />
                                {this.renderBreadcrumb(children)}
                            </Col>
                            <Col span={12} className="top-right-menu">
                                <Menu
                                    mode="horizontal"
                                    style={{lineHeight: '38px', float: 'right'}}>
                                    <SubMenu title={this.state.role.name}>
                                        {
                                            _.map(roles, (m) => <Menu.Item key={`menu-role-${m.id}`}><a
                                                onClick={this.changeRole.bind(this, m.id, m.name)}>{m.name}</a>
                                            </Menu.Item>)
                                        }
                                    </SubMenu>
                                    <Menu.Item key="full" onClick={this.screenFull}>
                                        <Icon type={ isFullscreen ? "shrink" : "arrows-alt"} onClick={this.screenFull}/>
                                    </Menu.Item>
                                    <Menu.Item key="setting">
                                        <Link to="/messagecenter">
                                            <Badge count={99}>
                                                <Icon size="large" type="bell"/>
                                            </Badge>
                                        </Link>
                                    </Menu.Item>
                                    <SubMenu title={_.get(user, 'get.data.username', '')}>
                                        <MenuItemGroup title="语言">
                                            <Menu.Item key="lang-menu-1">
                                                <a onClick={this.changeLang.bind(this, 'zh')}>
                                                    {I18nUtil.get('zh')}
                                                    <Icon type="check"
                                                          style={{
                                                              marginLeft: '0px',
                                                              marginTop: '15px',
                                                              float: 'right',
                                                              display: store.get('lang') === 'zh' ? 'block' : 'none'
                                                          }}/>
                                                </a>
                                            </Menu.Item>
                                            <Menu.Item key="lang-menu-2">
                                                <a onClick={this.changeLang.bind(this, 'en')}>
                                                    {I18nUtil.get('en')}
                                                    <Icon type="check"
                                                          style={{
                                                              marginLeft: '0px',
                                                              marginTop: '15px',
                                                              float: 'right',
                                                              display: store.get('lang') === 'en' ? 'block' : 'none'
                                                          }}/>
                                                </a>
                                            </Menu.Item>
                                        </MenuItemGroup>
                                        <MenuItemGroup title="用户中心">
                                            <Menu.Item key="user-menu-1">
                                                <Link to="/updateinfo"><a href="#">更新记录</a></Link>
                                            </Menu.Item>
                                            <Menu.Item key="user-menu-3">
                                                <a onClick={this.logout.bind(this)}>{I18nUtil.get('logout')}</a>
                                            </Menu.Item>
                                        </MenuItemGroup>
                                    </SubMenu>
                                </Menu>
                            </Col>
                        </Row>
                    </Header>
                    <Content style={contentStyle}>
                        {children}
                        {this.renderDevelopAssistent()}
                    </Content>
                </Layout>
            </Layout>
        </Layout>);
    }

    renderDevelopAssistent() {
        if (ReactUtil().isDevelopment())
            return (<DevelopAssistentIcon></DevelopAssistentIcon>);
    }

    render() {
        const {user} = this.props;
        if (_.isUndefined(user)) { //未创建user时 显示 加载页面
            return this.renderWelcome();
        } else if (_.get(this.props, 'user.get.data.id', null) === null) { //创建后 user 为空 时 显示 login 页面
            return this.renderLogin();
        } else {
            return this.renderMain();
        }
    }

    renderBreadcrumb(children) {
        if (!!children) {
            let {routes = []} = children.props;
            return (<Breadcrumb separator={'>'} style={{marginLeft: '10px'}}>
                {_.chain(routes).filter(r => !!r.breadcrumbName).map(r => {
                    return <Breadcrumb.Item key={`Breadcrubmb:${r.path}`}>
                        <Link to={r.path}>
                            {/*{<Icon type={r.icon}/>}*/}
                            {r.breadcrumbName}
                        </Link></Breadcrumb.Item>
                }).value()}
            </Breadcrumb>);
        }
    }

    toggle() {
        ReactUtil(this).setState({
            collapsed: !this.state.collapsed,
        })
    }
}

function mapStateToProps(state) {
    return {
        user: state.get('Login')
    }
}

export default connect(mapStateToProps)(Frame);
