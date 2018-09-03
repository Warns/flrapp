const Utils = require('root/app/helper/Global.js');

module.exports = {

    theme: 'LIGHT',

    uri: Utils.getURL({ key: 'user', subKey: 'login' }),

    successMessage: '',

    fields: [
        {
            items: [
                {
                    id: 'email',
                    title: 'Kullanıcı Adı',
                    type: 'text',
                    value: 'info@proj-e.com',
                    validation: [{ key: 'isEmpty' }, { key: 'isMail', }],
                    keyboardType: 'email-address',
                },
            ]
        },
        {
            items: [
                {
                    id: 'password',
                    title: 'Şifre',
                    type: 'text',
                    secureTextEntry: true,
                    value: '111111',
                    validation: [{ key: 'isEmpty' }, { key: 'isMin', value: 6 }, { key: 'isPassword' },],
                }
            ]
        },

    ]

};