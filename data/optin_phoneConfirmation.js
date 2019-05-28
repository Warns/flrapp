module.exports = {

  sendAjx: false,
  allErrMessage: false,
  buttonText: 'GÖNDER',

  fields: [
    {
      items: [
        {
          id: 'mobilePhoneConfirmation',
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