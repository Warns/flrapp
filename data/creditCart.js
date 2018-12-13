module.exports = {

  sendAjx: false,

  allErrMessage: false,

  showButton: false,

  fields: [
    {
      items: [
        {
          showTitle: true,
          id: 'creditCardNo',
          title: 'Kart Bilgileri',
          type: 'creditCart',
          validation: [{ key: 'isEmpty' }],
          keyboardType: 'numeric',
        }
      ]
    },
    {
      wrapperStyle: {
        flexDirection: 'row',
        flex: 1
      },
      items: [
        /*{
          id: 'year',
          title: 'Bitiş tarihi',
          type: 'dataTimePicker',
          //dateFormat: 'MM.YY',
          maxDate: 14,
          validation: [{ key: 'isEmpty' }, { key: 'isDate' },],
          css: {
            containerStyle: {
              marginRight: 5,
              flex: 1.2
            }
          },
        },*/
        {
          showTitle: true,
          id: 'year',
          title: 'Bitiş tarihi',
          type: 'text',
          placeholder: '00/00',
          mask: '99/99',
          validation: [{ key: 'isEmpty' }],
        },
        {
          showTitle: true,
          id: 'cvcCode',
          title: 'CVC',
          type: 'text',
          mask: '9999',
          validation: [{ key: 'isEmpty' }],
          keyboardType: 'numeric',
          css: {
            containerStyle: {
              marginLeft: 5,
              flex: .8
            }
          },
        }
      ]
    },
    {
      items: [
        {
          showTitle: true,
          id: 'fullName',
          title: 'Kart Üzerindeki İsim',
          type: 'text',
          validation: [{ key: 'isEmpty' }],
        }
      ]
    }
  ]
};