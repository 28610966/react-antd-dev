/**
 * Created by binwang on 2017/4/5.
 */

import store from 'store';

export default
    [{
        action: 'login',
        key: 'get',
        method: 'get',
        url: (payload) => `/api/login`,
        handler: (state, action) => {
            const {loading = true, result = null, error = null} = action;
            if (result !== null)
                store.set('login', result);
            return {
                loading: loading,
                error: error,
                data: result
            }
        }
    }, {
        action: 'getLoginCache',
        key: "get",
        handler: (state, action) => {
            let login = store.get('login');
            if (login !== null)
                return {
                    loading: false,
                    data: login ? login : null
                }
            else
                return {}
        }
    }, {
        action: 'logout',
        key: 'get',
        method: 'get',
        handler: (state, action) => {
            store.set('login', null);
            return {
                loading: false,
                data: null
            }
        }
    }];

