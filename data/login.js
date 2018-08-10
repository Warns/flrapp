const Utils = require('root/app/helper/Global.js');

module.exports = {
    uri: Utils.getURL({ key: 'user', subKey: 'login' }),

    successMessage: '',

    fields: [
        {
            items: [
                {
                    id: 'email',
                    title: 'E-mail',
                    type: 'text',
                    placeholder: '',
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
                    placeholder: '',
                    value: '111111',
                    validation: [{ key: 'isEmpty' }, { key: 'isMin', value: 6 }, { key: 'isPassword' },],
                }
            ]
        },

    ]

};