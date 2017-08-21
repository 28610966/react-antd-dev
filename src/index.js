import React from 'react';
import ReactDOM from 'react-dom';
import routes from'./routes';
import {Router} from 'react-router';
import {browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import {Provider} from 'react-redux'
import configureStore from './store/configureStore'
const store = configureStore();

const history = syncHistoryWithStore(browserHistory, store, {
    selectLocationState (state) {
        const route = state.get('Route').toObject();
        return route;
    }
});

ReactDOM.render(
    <Provider store={store}>
        <Router children={routes} history={ history }>
        </Router>
    </Provider>
    ,
    document.getElementById('root')
);
