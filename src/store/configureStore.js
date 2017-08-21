/**
 * Created by binwang on 2017/4/5.
 */
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import _ from 'lodash';
import {createLogger} from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import {Map} from 'immutable';
import {buildRoot} from '../middleware/saga.ware';
import Route from '../middleware/Route';
import {combineReducers} from "redux-immutable"
import actions from '../actions';
import createReducer from '@/util/createReducer';

const sagaMiddleware = createSagaMiddleware();
let middlewares = [thunk, sagaMiddleware];

if (process.env.NODE_ENV === `development`) {
    let loggerOptions = {
        level: 'info',
        duration: false,
        timestamp: true,
        logger: console,
        logErrors: true,
        stateTransformer: (state) => {
            if (Map.isMap(state))
                return state.toObject();
            else
                return state;
        },
        diff: true
    };
    const loggerMiddleware = createLogger(loggerOptions);
    middlewares.push(loggerMiddleware);
}

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

let ex_reducers = {};
_.forEach(actions, action => _.assign(ex_reducers, {[action.name]: createReducer(action)}));
_.assign(ex_reducers, {['Route']: Route});

const _reducers = combineReducers(ex_reducers);

export default function configureStore(initialState = Map()) {
    const store = createStoreWithMiddleware(_reducers, initialState);
    let sagaboot = buildRoot(actions);
    sagaMiddleware.run(sagaboot);
    if (module.hot) {
        module.hot.accept('../actions', () => {
            const nextReducer = _reducers;
            store.replaceReducer(nextReducer);
        })
    }

    return store
}