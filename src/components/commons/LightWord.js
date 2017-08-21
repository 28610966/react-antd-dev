/**
 * Created by binwang on 17/8/18.
 */
import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

export default class LightWord extends Component {

    static defaultProps = {
        lightword: PropTypes.string,
        message: PropTypes.string,
    };

    static propTypes = {
        lightword: ""
    };

    //构造函数，在创建组件的时候调用一次。
    constructor(props) {
        super(props);
        this.state = {}
    }

    //主体渲染入口，不要在render里面修改state。
    render() {
debugger
        const {message, lightword = ""} = this.props;

        if (_.isString(message) && _.isString(lightword) && _.trim(lightword) !== '') {
            let split = message.split(lightword);
            const result = split.map((w, index) => {
                if(index === split.length -1){
                    return <span>{w}</span>
                }else
                    return <psan>
                        {w}
                        <span style={{backgroud:"yellow"}}>{lightword}</span>
                        </psan>
            });
            return <div>{result}</div>
        } else {
            return <div>{message}</div>;
        }
    }

}
