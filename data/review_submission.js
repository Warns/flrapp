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
        }
      ]
    }
  ]
};