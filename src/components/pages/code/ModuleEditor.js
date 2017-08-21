/**
 * Created by binwang on 17/8/4.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as Antd from 'antd';
import {Button} from 'antd';
import {render} from 'react-dom';
import  _ from 'lodash';
import MonacoEditor from 'react-monaco-editor';
import * as ModuleEditorAction from '../../../actions/code/ModuleEditor';
import {ReactUtil, I18nUtil, RegExUtil}  from '../../../util';
import {Map, is} from 'immutable';


class ModuleEditor extends Component {

    static defaultProps = {
        SelectModuleEditor: React.PropTypes.string.required
    }

    constructor(props) {
        super(props);
        this.state = {
            SelectModuleEditor: Map(),
        }
    }

    componentWillMount() {
        this.setState({
            SelectModuleEditor: Map(this.props.SelectModuleEditor)
        })
    }

    editorDidMount(editor, monaco) {
        console.log('editorDidMount', editor);
        editor.focus();
    }

    onChange(newValue, e) {
        this.setState({SelectModuleEditor: this.state.SelectModuleEditor.set("code", newValue)});
    }

    save() {
        ReactUtil(this).action("ModuleEditor.update",(_.get(this.state, 'SelectModuleEditor').toObject()));
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!is(nextState.SelectModuleEditor, this.state.SelectModuleEditor)) {
            return true;
        }
        return false;
    }

    componentWillReceiveProps(nextProps) {

        if(_.get(nextProps,"SelectModuleEditor") !== _.get(this.props,"SelectModuleEditor")){
            this.setState({
                SelectModuleEditor: Map(nextProps.SelectModuleEditor)
            })
        }
    }

    render() {
        const options = {
            selectOnLineNumbers: true
        };
        let code = this.state.SelectModuleEditor.get('code');
        if (!code) code = '';
        let height = document.body.clientHeight - 220;
        return (
            <div style={{height: '100%'}}>
                <div style={{margin: "10px 0px"}}><Button onClick={this.save.bind(this)} type="primary"
                                                     icon="save"></Button></div>
                <div style={{border: "1px solid #e9e9e9", height: height}}>
                    <MonacoEditor
                        width="100%"
                        height="100%"
                        language="javascript"
                        value={code}
                        options={options}
                        onChange={this.onChange.bind(this)}
                        editorDidMount={this.editorDidMount.bind(this)}
                    /></div>
            </div>
        );
    }
}
//redux store 属性 对接组件的 props 属性。
function mapStoreToProps(store) {
    return {
        ModuleEditor: store.get("ModuleEditor")
    }
}

export default connect(mapStoreToProps)(ModuleEditor);