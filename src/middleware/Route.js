/**
 * Created by binwang on 17/7/13.
 *  使用不可变集合封装Redux store.
 */
import Immutable from 'immutable';
import {
    LOCATION_CHANGE
} from 'react-router-redux';

const initialState = Immutable.fromJS({
    locationBeforeTransitions: null
});
export default (state = initialState, action) => {
    if (action.type === LOCATION_CHANGE) {
        return state.set('locationBeforeTransitions', action.payload);
    }
    return state;
};