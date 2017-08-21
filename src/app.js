import React, {Component} from 'react';
import './themes/style.less';
import _ from 'lodash';
import  {Frame} from './components/index';
import {connect} from 'react-redux';
import {AppAction} from './actions';
import {ReactUtil} from '@/util';

class App extends Component {
    componentWillMount() {
        ReactUtil(this).action('App.get',{id:1})
    }

    render() {
        const {appName = "", logo = ""} = _.get(this.props, 'App.get.data',{});
        const pros = {title: appName, logo: logo};
        return (
            <Frame {...pros}>
                {this.props.children}
            </Frame>
        );
    }
}

//redux store 属性 对接组件的 props 属性。
function mapStoreToProps(store) {
    return {
        App: store.get('App'),
    }
}

export default connect(mapStoreToProps)(App);