import {
    cardType,
    validateCardNumber,
    validateCardCVC
} from 'root/app/helper/CreditCard';

const Utils = require('root/app/helper/Global.js');
const Translation = require('root/app/helper/Translation.js');
module.exports = {
    isEmpty: ({ value = '', title = '' }) => {
        return Utils.detect(Utils.cleanText(value)) ? { state: true } : { state: false, msg: Translation.getErrorMsg({ key: 'isEmpty', title: title }) };
    },
    isMin: ({ value = '', title = '', rule = 2 }) => {
        const n = Utils.cleanText(value);
        return n.length < rule ? { state: false, msg: Translation.getErrorMsg({ key: 'isMin', title: title, value: rule }) } : { state: true };
    },
    isMax: ({ value = '', title = '', rule = 100 }) => {
        const n = Utils.cleanText(value);
        return n.length > rule ? { state: false, msg: Translation.getErrorMsg({ key: 'isMax', title: title, value: rule }) } : { state: true };
    },
    isSelection: ({ value = -1, title = '' }) => {
        return value == -1 ? { state: false, msg: Translation.getErrorMsg({ key: 'isSelection', title: title }) } : { state: true }
    },
    isChecked: ({ value = false, title = '' }) => {
        return value == false ? { state: false, msg: Translation.getErrorMsg({ key: 'isChecked', title: title }) } : { state: true }
    },
    isMail: ({ value = '', title = '' }) => {
        const rgx = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i;

        return rgx.test(value) ? { state: true } : { state: false, msg: Translation.getErrorMsg({ key: 'isMail', title: title }) }
    },
    isDate: ({ value = '', title = '' }) => {
        const rgx = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g;

        //return rgx.test(value) ? { state: true } : { state: false, msg: Translation.getErrorMsg({ key: 'isDate', title: title }) }
        return { state: true };
    },
    isPhone: ({ value, title = '' }) => {
        value = value || '';
        const rgx = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/g;
        value = value.replace(/\./g, '').replace(/\)/g, '').replace(/\(/g, '').replace(/\s+/g, '');
        return (rgx.test(value) && Utils.cleanText(value).length == 10) ? { state: true } : { state: false, msg: Translation.getErrorMsg({ key: 'isPhone', title: title }) }
    },
    isCustomPhone: ({ value, title = '' }) => {
        value = value || '';
        const rgx = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/g;
        value = value.replace(/\./g, '').replace(/\)/g, '').replace(/\(/g, '').replace(/\s+/g, '');
        return (rgx.test(value) && Utils.cleanText(value).length == 11) ? { state: true } : { state: false, msg: Translation.getErrorMsg({ key: 'isPhone', title: title }) }
    },
    isPassword: ({ value = '', title = '' }) => {
        return { state: true };
    },
    isTwo: ({ value = '', title = '', rule = {} }) => {
        const { first = 3, last = 2 } = rule;
        let k = Utils.trimText(value);
        k = k.split(' ');
        return k.length > 1 ? { state: true } : { state: false, msg: Translation.getErrorMsg({ key: 'isTwo', title: title }) };
    },
    isEqual: ({ value = '', title = '', rule = {}, allData = {} }) => {
        let b = false, title2 = '';
        Object.entries(allData).forEach(([ky, tm]) => {
            if (tm['key'] == rule) {
                if (tm['value'] == value)
                    b = true;
                else
                    title2 = tm['title'];
                return false;
            }
        });
        return b ? { state: true } : { state: false, msg: Translation.getErrorMsg({ key: 'isEqual', title: title, value: title2 }) };
    },
    isStar: ({ value = -1, title = '' }) => {
        return value >= 0 ? { state: true } : { state: false, msg: Translation.getErrorMsg({ key: 'isStar', title: title }) };
    },
    isCreditCard: ({ value = '', title = '', rule = {} }) => {
        return validateCardNumber(value) ? { state: true } : { state: false, msg: Translation.getErrorMsg({ key: 'isCreditCard' }) };
    },
    isCvcCode: ({ value = '', title = '', rule = {}, allData = {} }) => {
        let creditCardNo = '';
        Object.entries(allData).forEach(([ky, tm]) => {
            if (tm['key'] == rule)
                creditCardNo = tm['value'];
        });

        const _cardType = cardType(creditCardNo),
            cvcValid = validateCardCVC(value, _cardType);

        return cvcValid ? { state: true } : { state: false, msg: Translation.getErrorMsg({ key: 'isCvcCode' }) };
    },
    isCustomDate: ({ value = '', title = '', rule = {} }) => {
        /* 
            kredi kartı tarih için
            value: 00/00
        */
        let d = new Date(),
            nowYear = d.getFullYear(),
            date = (value || '0/0').split('/'),
            month = parseInt( date[0] || 0 ),
            year = parseInt( '20' + ( date[1] || 0 ) ),
            b = true;

        if (month <= 0 || month > 12)
            b = false;

        if (year < nowYear || year > nowYear + 14)
            b = false;

        return b ? { state: true } : { state: false, msg: Translation.getErrorMsg({ key: 'isCustomDate' }) }
    }
};