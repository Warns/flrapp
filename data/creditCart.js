module.exports = {

  sendAjx: false,

  allErrMessage: false,

  fields: [
    {
      items: [
        {
          id: 'creditCardNo',
          title: 'Kart Bilgileri',
          type: 'creditCart',
          validation: [{ key: 'isEmpty' }],
          keyboardType: 'numeric',
        }
      ]
    },
    {
      items: [
        {
          id: 'year',
          title: 'Bitiş tarihi',
          type: 'dataTimePicker',
          maxDate: 14,
          validation: [{ key: 'isEmpty' }, { key: 'isDate' },],
        },
        {
          id: 'cvcCode',
          title: 'CVC',
          type: 'text',
          mask: '9999',
          validation: [{ key: 'isEmpty' }],
          keyboardType: 'numeric',
        }
      ]
    },
    {
      items: [
        {
          id: 'fullName',
          title: 'Kart Üzerindeki İsim',
          type: 'text',
          validation: [{ key: 'isEmpty' }],
        }
      ]
    }
  ]
};