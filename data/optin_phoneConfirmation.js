module.exports = {

  sendAjx: false,
  allErrMessage: false,
  buttonText:'ONAY KODU GÖNDER',
  
  fields: [
    {
      items: [
        {
          id: 'mobilePhone',
          title: 'Onay Kodu',
          type: 'text',
          placeholder: '',
          value: '',
          mask: '99999',
          validation: [{ key: 'isEmpty' }],
          keyboardType: 'numeric',
        }
      ]
    }
  ]
};