import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {Menu, Icon, Spin} from 'antd';
import {MenuAction} from '@/actions';
import ReactUtil from '@/util/ReactUtil';
import menus from '@/menus';
const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;

class LeftMenu extends React.Component {
    propTypes = {
        menu: React.PropTypes.instanceOf(Object),
        role: React.PropTypes.instanceOf(Object),
    }

    componentWillMount() {
        ReactUtil(this).action('Menu.list',{current:1,pageSize:1000});
    }

    shouldComponentUpdate(nextProps){
        if(_.get(nextProps,'Menu.list.data',null) === null)
            return false;
        return true;
    }

    render() {

        //静态菜单
        const list = menus;
        const loading = false;
        const roleId = _.get(this.props,'role.id');
        //服务端获取菜单
        // const list = _.get(this.props,'Menu.list.data.list');
        // const loading = _.get(this.props,'Menu.list.loading');
        // const roleId = _.get(this.props,'role.id');
        const defaultOpenKeys = _.map(list,(m,i)=>"leftMenuKey:"+i);
        if (list) {
            return (
                <Spin spinning={loading}>
                    <Menu mode="inline" defaultOpenKeys={defaultOpenKeys} theme="dark">
                        {
                            list.map((m, i) => {
                                if (!m.children) {
                                    return (
                                        <MenuItem>
                                            <Link to={m.path} onlyActiveOnIndex={true}>
                                                <Icon spin={false} type={m.icon || ''}/><span>{m.title}</span>
                                            </Link>
                                        </MenuItem>
                                    );
                                } else if(m.role.indexOf(roleId+"") > -1){
                                    return (
                                        <SubMenu key={`leftMenuKey:${i}`}
                                                 title={<span><Icon spin={false} type={m.icon || ''}/><span>{m.title}</span></span>}>
                                            {m.children.map(m2 => {
                                                return (
                                                    <MenuItem key={`leftMenuSubMenu:${m2.path}`}>
                                                        <Link to={m2.path} onlyActiveOnIndex={true}>
                                                            {m2.title}
                                                        </Link>
                                                    </MenuItem>
                                                )
                                            })}
                                        </SubMenu>
                                    )
                                }
                            })}
                    </Menu>
                </Spin>
            );
        } else {
            return <div></div>
        }
    }
}


function mapStateToProps(state) {
    return {
        Menu: state.get('Menu'),
    }
}

export default connect(mapStateToProps)(LeftMenu);
