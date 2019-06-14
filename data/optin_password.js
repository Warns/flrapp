module.exports = {

  sendAjx: false,
  allErrMessage: false,
  buttonText: 'GİRİŞ YAP',

  fields: [
    {
      items: [
        {
          id: 'password',
          title: 'Şifre',
          type: 'text',
          secureTextEntry: true,
          value: '',
          validation: [{ key: 'isEmpty' }, { key: 'isMin', value: 3 }, { key: 'isPassword' },],
        }
      ]
    }
  ]
};