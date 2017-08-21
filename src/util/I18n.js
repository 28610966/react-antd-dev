/**
 * Created by binwang on 17/7/18.
 */
import IntlMessageFormat from 'intl-messageformat';
import zh from '../locales/zh-CN';
import en from '../locales/en-US';
import store from 'store';
import _ from 'lodash';
const MESSAGES = {en, zh};
const LOCALE = store.get('lang') || 'zh';

const I18n = () => {
    return {
        get: (key, p1, p2) => {
            let msg = MESSAGES[LOCALE][key];
            if (msg == null) {
                if (p1 != null && _.isString(p1)) {
                    return p1;
                }
                return key;
            }
            let options;
            if (_.isObject(p1)) {
                options = p1;
            } else if (_.isObject(p2)) {
                options = p2;
            } else
                return msg;

            if (options) {
                msg = new IntlMessageFormat(msg, LOCALE);
                return msg.format(options);
            }
            return msg;

        }
    }
}
const I18nUtil = I18n();
export default I18nUtil;