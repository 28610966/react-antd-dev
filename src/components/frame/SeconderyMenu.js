/**
 * Created by binwang on 18/1/9.
 */
import React from 'react';
import {Tabs} from "antd";
const TabPane = Tabs.TabPane;

class SeconderyMenu extends React.Component {

    static defaultProps = {
        tabPosition: 'left',
        data:[]
    }

    static propTypes = {
        data: React.PropTypes.instanceOf(Array),
        tabPosition: React.PropTypes.instanceOf(String),
    }

    getDefaultKey() {
        const {data = []} = this.props;
        if (data.length > 0) {
            const defaultTab = data.filter(d => {
                return d.default;
            });
            if (defaultTab.length > 0) {
                return defaultTab.key;
            } else {
                return data[0].key;
            }
        } else {
            return null;
        }
    }

    render() {
        const {data = [], tabPosition = 'left'} = this.props;
        const style = {
            height: '100%'
        }
        const defaultActiveKey = this.getDefaultKey();
        return <Tabs style={style} defaultActiveKey={defaultActiveKey} tabPosition={tabPosition} animated={true}>
            {
                data.map(item => {
                    return <TabPane tab={item.tab} key={item.key}>{item.component}</TabPane>
                })
            }
        </Tabs>
    }
}
export  default  SeconderyMenu;