const Utils = require('root/app/helper/Global.js');

module.exports = {

    /* uri: istek yapılacak url */
    uri: Utils.getURL({ key: 'address', subKey: 'createAddress' }),

    /* allErrMessage: true durumunda tüm hata mesajları sayfanın en üstünde, false durumunda ilgili elementin altında gösterilir */
    allErrMessage: false,

    /* işlem başarıyla gerçekleşmişse ve özel bir mesaj göstermek isteniliyorsa mesaj bu kısma yazılır */
    successMessage: '',

    buttonText: 'Kaydet',

    /* post için oluşturulan nesneye sabit bir alan eklenecekse bu kısma */
    addFields: [
        {
            id: 'corprateFl',
            value: false
        },
    ],

    fields: [
        {
            items: [
                {
                    id: 'fullName',
                    title: 'Kayıt İsmi',
                    type: 'text',
                    value: '',
                    validation: [{ key: 'isEmpty' }, { key: 'isMin', value: 2 },],
                    regex: 'typ1',
                },
                {
                    id: 'addressName',
                    title: 'Ad Soyad',
                    type: 'text',
                    value: '',
                    validation: [{ key: 'isEmpty' }, { key: 'isTwo', value: { first: 3, last: 2 } }],
                    regex: 'typ1'
                },
            ]
        },
        {
            items: [
                {
                    id: 'country',
                    title: 'Ülke/Şehir',
                    type: 'countryPicker',
                    value: {
                        country: 1,
                        city: -1,
                        district: -1,
                    },
                    errorState: {
                        countryId: { error: false, errorMsg: null },
                        cityId: { error: false, errorMsg: null },
                        districtId: { error: false, errorMsg: null }
                    }
                },
            ]
        },
        {
            items: [
                {
                    id: 'zipCode',
                    title: 'Posta Kodu',
                    type: 'text',
                    value: '',
                    mask: '99999',
                    validation: [{ key: 'isEmpty' }],
                    keyboardType: 'numeric',
                },
                {
                    id: 'mobilePhone',
                    title: 'Cep Telefonu',
                    type: 'text',
                    placeholder: '',
                    value: '',
                    mask: '0599 9999999',
                    customFormat: (k) => {
                        return Utils.customPhoneFormat(k);
                    },
                    validation: [{ key: 'isEmpty' }, { key: 'isPhone' },],
                    keyboardType: 'numeric',
                    regex: 'typ5',
                },
            ]
        },
        {
            items: [
                {
                    id: 'address',
                    title: 'Adres',
                    type: 'text',
                    value: '',
                    multiline: true,
                    validation: [{ key: 'isEmpty' },{ key: 'isMin', value: 10 }],
                },
            ]
        },
    ]
};