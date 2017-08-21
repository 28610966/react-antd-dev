import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {connect} from 'react-redux';
import echarts from 'echarts';

require('echarts-liquidfill');

const LiquidfillComponent = React.createClass({
    propTypes: {
    },
    getOption: function() {
        var option = {
            series: [{
                type: 'liquidFill',
                data: [0.9]
            }]
        };
        return option;
    },
    render: function() {
        return (
            <ReactEcharts
                option={this.getOption()}
                style={{height: '500px', width: '100%'}}
                className='react_for_echarts' />
        );
    }
});


//redux store 属性 对接组件的 props 属性。
function mapStoreToProps(store) {
    return {
    }
}

export default connect(mapStoreToProps)(LiquidfillComponent);
