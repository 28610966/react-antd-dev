/**
 * Created by binwang on 17/7/11.
 */
import _ from 'lodash';

export default function ReactUtil(component) {
    return {
        diff: (nextProps, key) => {
            return _.get(nextProps, key) !== null && !_.isEqual(_.get(nextProps, key), _.get(component.props, key))
        },
        dispatch: (action) => {
            component.props.dispatch.call(this, action);
            return this;
        },
        setState: (state) => {
            component.setState(state);
            return this;
        },
        isDevelopment: () => {
            return process.env.NODE_ENV === 'development';
        },
        action: (action, state) => {
            component.props.dispatch({
                type: action,
                payload: state
            })
        }
    }
}