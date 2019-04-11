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
          validation: [{ key: 'isEmpty' }, { key: 'isCreditCard' }],
          keyboardType: 'numeric',
          css: {
            errorMsgStyle: {
              opacity: 0
            }
          }
        }
      ]
    },
    {
      wrapperStyle: {
        flexDirection: 'row',
        flex: 1
      },
      items: [
        {
          showTitle: true,
          id: 'year',
          title: 'Bitiş tarihi',
          type: 'text',
          placeholder: '00/00',
          mask: '99/99',
          validation: [{ key: 'isEmpty' }, { key: 'isCustomDate' }],
          keyboardType: 'numeric',
          css: {
            errorMsgStyle: {
              opacity: 0
            }
          }
        },
        {
          showTitle: true,
          id: 'cvcCode',
          title: 'CVC',
          type: 'text',
          mask: '9999',
          validation: [{ key: 'isEmpty' }, { key: 'isCvcCode', value: 'creditCardNo' }],
          keyboardType: 'numeric',
          css: {
            errorMsgStyle: {
              opacity: 0
            },
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
          validation: [{ key: 'isEmpty' }, /*{ key: 'isTwo', value: { first: 3, last: 2 } }*/],
          css: {
            errorMsgStyle: {
              opacity: 0
            }
          }
        }
      ]
    }
  ]
};