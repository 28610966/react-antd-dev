/**
 * Created by binwang on 17/8/16.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Spin, Tabs} from 'antd';
import _ from 'lodash';
import {RegExUtil, ReactUtil} from '../../util';
import {ExternalPageAction} from '../../actions';
const TabPane = Tabs.TabPane;
class IFrame extends Component {

    static defaultProps = {
    };

    static propTypes = {
    };

    //构造函数，在创建组件的时候调用一次。
    constructor(props, context) {
        super(props);
        this.state = {
            loading: true,
        }
    }

    //在组件挂载之前调用一次。如果在这个函数里面调用setState，本次的render函数可以看到更新后的state，并且只渲染一次。
    componentWillMount() {
        ReactUtil(this).action("ExternalPage.list",{sortField:'order'});
        setTimeout(() => {
            this.setState({loading: false})
        }, 1500)
    }

    //主体渲染入口，不要在render里面修改state。
    render() {

        let style = {
            height: document.body.clientHeight - 40,
            marginBottom: "-5px",
            backgroundColor: "transparent",
        }
        let {loading} = this.state;
        let ExternalPages = _.get(this.props,"ExternalPage.list.data",[]);
        const height100 = {
            height: '100%'
        }
        return (
            <Tabs style={height100} tabPosition="left" defaultActiveKey={'iframe_tab_0'}>
                {
                    _.map(ExternalPages, (url,index) => {
                        let offsetLeft = -24 + (url.offsetLeft || 0);
                        let offsetTop = 0 + (url.offsetTop || 0);
                        style = {...style, width: `calc(100% - ${offsetLeft}px)`, marginLeft: `${offsetLeft}px`, marginTop: `${offsetTop}px`,}
                        return <TabPane style={height100} key={`iframe_tab_${index}`}  tab={url.name}>
                            <Spin spinning={loading}>
                            <iframe allowTransparency="true" frameBorder="no" width="100%" height="100%" border="0"
                                    marginWidth="0"
                                    marginHeight="0" scrolling="auto"
                                    src={url.url} style={style}></iframe>
                            </Spin>
                        </TabPane>
                    })
                }
            </Tabs>);
    }

    //组件被卸载的时候调用。一般在componentDidMount里面注册的事件需要在这里删除。
    componentWillUnmount() {

    }
}
//redux store 属性 对接组件的 props 属性。
function mapStoreToProps(store) {
    return {
        ExternalPage : store.get("ExternalPage")
    }
}

export default connect(mapStoreToProps)(IFrame);