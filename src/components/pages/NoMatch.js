import React from 'react';

export  default  class NoMatch extends React.Component {
    render() {
        return (
            <div className='page-error'>
                <div className="code">
                    <p><span>4</span><span>0</span><span>4</span></p>
                </div>
                <div className="text">
                    <p>
                        <span>你</span><span>访</span><span>问</span><span>的</span><span>页</span><span>面</span><span>不</span><span>存</span><span>在</span>
                    </p>
                </div>
            </div>
        )
    }
}