module.exports = {

  sendAjx: false,
  allErrMessage: false,
  buttonText: 'ONAY KODUNU DOĞRULA',

  fields: [
    {
      items: [
        {
          id: 'mobilePhone',
          title: 'Onay Kodu',
          type: 'text',
          placeholder: '',
          value: '',
          mask: '999999',
          validation: [{ key: 'isEmpty' }],
          keyboardType: 'numeric',
        }
      ]
    }
  ]
};