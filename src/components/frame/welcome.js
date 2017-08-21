/**
 * Created by binwang on 17/7/11.
 */
import  React from 'react';

class Welcome
    extends React.Component {
    render() {
        return (<div className="cssload-loader">
            <div className="cssload-inner cssload-one"></div>
            <div className="cssload-inner cssload-two"></div>
            <div className="cssload-inner cssload-three"></div>
        </div>)
    }
}
export  default  Welcome;