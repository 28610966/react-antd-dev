/**
 * Created by binwang on 17/8/10.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as CodeEditorAction from '../../../actions/code/CodeEditor';
import {ReactUtil, I18nUtil, RegExUtil}  from '../../../util';
import {Map, is} from 'immutable';
import _ from 'lodash';
import MonacoEditor from 'react-monaco-editor';
import Welcome from '../../frame/welcome';
import {Button, message,Spin} from 'antd';


class CodeEditor extends Component {

    static defaultProps = {};

    static propTypes = {
        path: React.PropTypes.String
    };

    //构造函数，在创建组件的时候调用一次。
    constructor(props, context) {
        super(props);
        this.state = {
            CodeEditor: Map()
        }
    }

    //在组件挂载之前调用一次。如果在这个函数里面调用setState，本次的render函数可以看到更新后的state，并且只渲染一次。
    componentWillMount() {
        const {path} = this.props;
        ReactUtil(this).action("CodeEditor.get",{path});
    }

    //在组件挂载之后调用一次。这个时候，子主键也都挂载好了，可以在这里使用refs。
    componentDidMount() {

    }

    //props是父组件传递给子组件的。父组件发生render的时候子组件就会调用componentWillReceiveProps（不管props有没有更新，也不管父子组件之间有没有数据交换）。
    componentWillReceiveProps(nextProps) {
        if (nextProps.CodeEditor !==  this.props.CodeEditor) {
            ReactUtil(this).setState({CodeEditor: Map(_.get(nextProps, 'CodeEditor.get.data'))});
        }
        if (!!nextProps.path && nextProps.path !== this.props.path) {
            const {path} = nextProps;
            ReactUtil(this).action("CodeEditor.get",{path});
        }
        ['save'].forEach((op) => {
            let dataId = `CodeEditor.${op}.data`;
            let errorId = `CodeEditor.${op}.error`;
            if (!_.isEqual(_.get(nextProps, dataId), _.get(this.props, dataId)) && _.get(nextProps, dataId, false)) {
                message.success(I18nUtil.get(`${op}.success`, '', {name:'代码'}));
                const {path} = nextProps;
                ReactUtil(this).action("CodeEditor.get",{path});
            } else if (_.get(nextProps, errorId, false) && !_.isEqual(_.get(nextProps, errorId), _.get(this.props, errorId))) {
                message.error(_.get(nextProps, errorId));
            }
        });
    }

    //组件挂载之后，每次调用setState后都会调用shouldComponentUpdate判断是否需要重新渲染组件。默认返回true，需要重新render。在比较复杂的应用里，有一些数据的改变并不影响界面展示，可以在这里做判断，优化渲染效率。
    shouldComponentUpdate(nextProps, nextState) {
        if (!is(nextState.CodeEditor, this.state.CodeEditor)){
            return true;
        }
        return false;
    }

    onChange(newValue, e) {
        this.setState({CodeEditor: this.state.CodeEditor.set("fileContent", newValue)});
    }

    editorDidMount(editor, monaco) {
        editor.focus();
    }

    save() {
        const fileContent = this.state.CodeEditor.get("fileContent");
        const {path} = this.props;

        ReactUtil(this).action("CodeEditor.save",{path: path, fileContent: fileContent});
    }

    //主体渲染入口，不要在render里面修改state。
    render() {
        const {CodeEditor} = this.state;
        let fileContent = CodeEditor.get('fileContent');
        if (!fileContent) fileContent = '';
        return (
            <Spin spinning={!CodeEditor.has("fileContent")}>
                {this.renderMain(fileContent)}
            </Spin>
        )
    }

    renderMain(fileContent) {
        const options = {
            selectOnLineNumbers: true
        };

        let height = document.body.clientHeight - 150;
        return (
            <div style={{height: '100%'}}>
                <div style={{margin: "10px 0px"}}><Button onClick={this.save.bind(this)} type="primary"
                                                          icon="save"></Button>
                </div>
                <div style={{border: "1px solid #e9e9e9", height: height}}>
                    <MonacoEditor
                        key={this.props.path}
                        width="100%"
                        height="100%"
                        language="javascript"
                        value={fileContent}
                        options={options}
                        onChange={this.onChange.bind(this)}
                        editorDidMount={this.editorDidMount.bind(this)}
                    /></div>
            </div>);
    }

    //组件被卸载的时候调用。一般在componentDidMount里面注册的事件需要在这里删除。
    componentWillUnmount() {

    }
}
//redux store 属性 对接组件的 props 属性。
function mapStoreToProps(store) {
    return {
        CodeEditor: store.get("CodeEditor")
    }
}

export default connect(mapStoreToProps)(CodeEditor);