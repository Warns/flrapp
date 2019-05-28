const Utils = require('root/app/helper/Global.js');
const Translation = require('root/app/helper/Translation.js');

module.exports = {

  /* uri: istek yapılacak url */
  uri: Utils.getURL({ key: 'user', subKey: 'createUser' }),

  /* allErrMessage: true durumunda tüm hata mesajları sayfanın en üstünde, false durumunda ilgili elementin altında gösterilir */
  allErrMessage: false,

  /* işlem başarıyla gerçekleşmişse ve özel bir mesaj göstermek isteniliyorsa mesaj bu kısma yazılır */
  successMessage: '',

  buttonText: 'TAMAMLA',

  fields: [
    {
      items: [
        {
          id: 'isMailSubscribe',
          title: 'E-Posta',
          desc: 'E-Posta ile bilgilendirme istiyorum',
          type: 'chekbox',
          value: false,
          //validation: [{ key: 'isChecked' },],
        },
      ]
    },
    {
      items: [
        {
          id: 'isSmsSubscribe',
          title: 'SMS iptal',
          desc: 'SMS ve telefon ile bildirim almak istiyorum.',
          type: 'chekbox',
          value: false,
          //validation: [{ key: 'isChecked' },],
        },

      ]
    },
    {
      items: [
        {
          id: 'smsInfo',
          title: '',
          desc: 'SMS iptali için 3347 RET FLR yazarak mesaj gönderebilirsin.SMS ve e-posta almak istemiyorsan 0850 333 0 319 nolu çağrı merkezimizden bize ulaşabilirsin.',
          type: 'info',
          //validation: [{ key: 'isChecked' },],
        },

      ]
    },

  ]
};