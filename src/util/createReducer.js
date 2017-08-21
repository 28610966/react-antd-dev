/**
 * Created by binwang on 2017/4/6.
 */
import  _ from 'lodash';
export default (handler) => {
    return (state, action) => {

        const {payload = null, loading = true, result = null, error = null, type} = action;
        if(type.indexOf(handler.name) == -1)
            return {...state};

        let h = _.filter(handler.action, h1 => {
            const action = h1.action;
            return type === action || type === (action + '_SUCCESS') || type === (action + '_FAIL');
        });
        if (h.length === 1) {
            let realKey = h[0].key || h[0].action;
            if(!!realKey && realKey.indexOf('.') > 0)
                realKey = realKey.split(".")[1];
            if (h[0].handler && h[0].handler instanceof Function) {
                if (!!realKey) {
                    return {...state, [realKey]: h[0].handler(state, action)};
                } else {
                    return {...state, ...h[0].handler(state, action)};
                }
            } else {

                if (type.indexOf('_SUCCESS') > -1 || type.indexOf('_FAIL') > -1) {
                    return {...state, [realKey]: {error: error, loading: loading, data: result}};
                } else {
                    return {...state, [realKey]: {error: error, loading: loading, params: result}};
                }
            }
        } else {
            return {...state};
        }
    }

}