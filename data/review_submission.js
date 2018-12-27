module.exports = {

  sendAjx: false,
  allErrMessage: false,
  buttonText: 'YORUM EKLE',

  fields: [
    {
      items: [
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
          validation: [{ key: 'isEmpty' }],
          css: {
            wrapperStyle: {
              height: 200,
              alignItems: 'flex-start',
            }
          }
        },
        {
          id: 'points',
          title: 'Puan seçiniz',
          type: 'stars',
          validation: [{ key: 'isStar' }],
        }
      ]
    }
  ]
};