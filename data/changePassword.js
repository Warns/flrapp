const Utils = require('root/app/helper/Global.js');

module.exports = {
    uri: Utils.getURL({ key: 'user', subKey: 'changePassword' }),

    successMessage: 'Şifreniz değiştirildi. Teşekkür ederiz.',

    resetForm: true, // form gönderimi başarılı olarak gerçeklemişse formdaki değerlerin resetlenmesi

    buttonText: 'KAYDET',

    fields: [
        {
            items: [
                {
                    id: 'oldPassword',
                    title: 'Eski Şifre',
                    type: 'text',
                    secureTextEntry: true,
                    placeholder: '',
                    value: '',
                    validation: [{ key: 'isEmpty' }, { key: 'isMin', value: 6 }, { key: 'isPassword' },],
                }
            ]
        },
        {
            items: [
                {
                    id: 'newPassword1',
                    title: 'Yeni Şifre',
                    type: 'text',
                    secureTextEntry: true,
                    placeholder: '',
                    value: '',
                    validation: [{ key: 'isEmpty' }, { key: 'isMin', value: 6 }, { key: 'isPassword' },],
                }
            ]
        },
        {
            items: [
                {
                    id: 'newPassword2',
                    title: 'Yeni Şifre Tekrar',
                    type: 'text',
                    secureTextEntry: true,
                    placeholder: '',
                    value: '',
                    validation: [{ key: 'isEmpty' }, { key: 'isMin', value: 6 }, { key: 'isEqual', value: 'newPassword1' },],
                }
            ]
        },

    ]

};