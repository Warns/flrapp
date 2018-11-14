const Utils = require('root/app/helper/Global.js');
const Translation = require('root/app/helper/Translation.js');

module.exports = {

    /*  form default data config */
    defValue: {
        uri: Utils.getURL({ key: 'user', subKey: 'getUser' }),
    },

    /* uri: istek yapılacak url */
    uri: Utils.getURL({ key: 'user', subKey: 'setUser' }), 

    /* allErrMessage: true durumunda tüm hata mesajları sayfanın en üstünde, false durumunda ilgili elementin altında gösterilir */
    allErrMessage: false, 

    /* işlem başarıyla gerçekleşmişse ve özel bir mesaj göstermek isteniliyorsa mesaj bu kısma yazılır */
    successMessage: 'Bilgileriniz başarıyla güncellenmiştir', 

    fields: [
        {
            items: [
                {
                    id: 'firstName',
                    title: 'Ad',
                    type: 'text',
                    placeholder: '',
                    value: '',
                    validation: [{ key: 'isEmpty' }, { key: 'isMin', value: 3 },],
                    regex: 'typ1',
                },
                {
                    id: 'lastName',
                    title: 'Soyad',
                    type: 'text',
                    placeholder: '',
                    value: '',
                    validation: [{ key: 'isEmpty' }, { key: 'isMin', value: 2 }],
                    regex: 'typ1'
                },
            ]
        },
        {
            items: [
                {
                    id: 'email',
                    title: 'E-mail',
                    type: 'text',
                    placeholder: '',
                    value: '',
                    validation: [{ key: 'isEmpty' }, { key: 'isMail', }],
                    keyboardType: 'email-address',
                    disabled: true,
                    css: {
                        wrapperStyle: { 
                            backgroundColor: '#C1C1C1'
                        }
                    }
                },
                {
                    id: 'mobilePhone',
                    title: 'Cep Telefonu',
                    type: 'text',
                    placeholder: '',
                    value: '',
                    mask: '0(999) 9999999',
                    customFormat: (k) => {
                        return Utils.customPhoneFormat( k );
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
                    id: 'birthDay',
                    title: 'Doğum Tarihi',
                    type: 'dataTimePicker',
                    placeholder: '',
                    value: '',
                    customFormat: (k) => {
                        return Utils.customDateFormat( k );
                    },
                    maxDate: -14,
                    validation: [{ key: 'isEmpty' }, { key: 'isDate' },],
                },
            ]
        },
        {
            items: [
                {
                    id: 'gender',
                    title: 'Cinsiyet',
                    type: 'select',
                    values: [{ key: Translation['dropdown']['choose'] || 'Seçiniz', value: -1 }, { key: 'Erkek', value: 'E' }, { key: 'Kadın', value: 'K' }],
                    value: -1,
                    multiple: false,
                    validation: [{ key: 'isSelection' }],
                },
            ]
        },
        {
            items: [
                {
                    id: 'isMailSubscribe',
                    title: 'E-Posta',
                    desc: 'E-Posta ile bilgilendirme istiyorum',
                    type: 'chekbox',
                    value: true,
                    //validation: [{ key: 'isChecked' },],
                },
            ]
        },
        {
            items: [
                {
                    id: 'isSmsSubscribe',
                    title: 'SMS iptal',
                    desc: 'SMS iptali için 3347 RET FLR yazarak mesaj gönderebilirsin.SMS ve e-posta almak istemiyorsan 0850 333 0 319 nolu çağrı merkezimizden bize ulaşabilirsin.',
                    type: 'chekbox',
                    value: true,
                    //validation: [{ key: 'isChecked' },],
                },

            ]
        },

    ]

};