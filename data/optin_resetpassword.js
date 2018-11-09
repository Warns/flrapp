module.exports = {

    sendAjx: false,
    allErrMessage: false,
    buttonText:'ŞİFREMİ GÖNDER',
    
    fields: [
      {
        items: [
          {
            id: 'email',
            title: 'E-mail adresi',
            type: 'text',
            placeholder: '',
            value: '',
            validation: [{ key: 'isEmpty' }, { key: 'isMail' },],
            keyboardType: 'email-address',
          }
        ]
      }
    ]
  };