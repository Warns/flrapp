module.exports = {

  sendAjx: false,
  allErrMessage: false,
  buttonText: 'ONAY KODU GÖNDER',

  fields: [
    {
      items: [
        {
          id: 'mobilePhone',
          title: 'Cep Telefonu',
          type: 'text',
          placeholder: '',
          value: '05309752566',
          mask: '0999 999 99 99',
          validation: [{ key: 'isEmpty' }, { key: 'isCustomPhone' },],
          keyboardType: 'numeric',
        }
      ]
    },
    {
      /* 
        yeni üye yaratılıyorsa sms flag 1 veya giriş yapılıyorsa sms flag 1 olarak güncellenmeli
      */
      items: [
        {
          id: 'isSmsSubscribe',
          //title: 'SMS ve telefon ile bildirim almak istiyorum.',
          desc: 'SMS ve telefon ile bildirim almak istiyorum. -SMS iptal için 3347 “RET FLR” yazarak mesaj gönderebilirsin veya iletişim tercihlerini değiştirmek için 0850 333 0 319 nolu çağrı merkezimizden bize ulaşabilirsin.',
          type: 'chekbox',
          value: false,
        }
      ]
    },
  ]
};