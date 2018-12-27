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
    }
  ]
};