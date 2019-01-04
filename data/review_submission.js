module.exports = {

  sendAjx: false,
  allErrMessage: false,
  buttonText: 'YORUM EKLE',

  fields: [
    {
      items: [

        {
          id: 'points',
          title: 'Puan seçiniz',
          type: 'stars',
          validation: [{ key: 'isStar' }],
        },
        {
          id: 'title',
          title: 'Yorum başlığı',
          type: 'text',
          placeholder: '',
          value: '',
          validation: [{ key: 'isEmpty' }],
        },
        {
          id: 'comment',
          title: 'Yorum içeriği',
          type: 'text',
          multiline: true,
          placeholder: '',
          value: '',
          validation: [{ key: 'isEmpty' }, { key: 'isMin', value: 50 }],
          css: {
            wrapperStyle: {
              height: 200,
              alignItems: 'flex-start',
              paddingTop: 10,
              paddingBottom: 10,
            }
          }
        },

        {
          id: 'recommends',
          title: 'Bu ürünü önerir misin?',
          desc: 'Bu ürünü başkasına önerir misin?',
          type: 'chekbox',
          value: false,
          css: {
            wrapperStyle: {
              backgroundColor: 'transparent',
            }
          }
        },
        {
          id: 'agreement',
          title: 'Üyelik ve Gizlilik Sözleşmesi',
          desc: '<u>Üyelik ve Gizlilik Sözleşmesi</u> ve Kişisel Verilerin Korunması Maddesini kabul ediyorum.',
          type: 'chekbox',
          value: false,
          //switchStyle: false,
          validation: [{ key: 'isChecked' },],
          modal: {
            "title": "KULLANICI SÖZLEŞMESİ",
            "type": "webViewer",
            "uri": {
              "key": "user",
              "subKey": "getAgreement"
            },
            "keys": {
              "arr": "agreementHtml"
            }
          },
          css: {
            wrapperStyle: {
              backgroundColor: 'transparent',
            }
          }
        },
      ]
    }
  ]
};