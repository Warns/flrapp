'use strict';
var React = require('react-native');
module.exports = {
    orders: {
        orderNo: 'Sipariş Numarası',
        orderDate: 'Sipariş Tarihi',
        currency: 'Para Birimi',
        status: 'Siparişin Durumu',
        cargoKey: 'Kargo Takip No',
        shipAddressText: 'Teslimat Adresi',
        billAddressText: 'Fatura Adresi',
        totalPrice: 'Toplam',
        shippingTotal: 'Kargo',
        cargoKey: 'Kargo Takip No',
        buttonCargoFollow: 'Kargo Takibi',
        totalPriceWithoutProm: 'Kargo hariç toplam',

        paymentTour: 'Ödeme Türü',
        bankInformation: 'Banka Bilgisi',
        cargoCompany: 'Kargo Firması',
    },
    errorMessage: {
        isEmpty: 'Lütfen {{title}} alanını doldurunuz.',
        isMin: '{{title}} alanı minimum {{value}} karekter olmalıdır.',
        isMax: '{{title}} alanı maximum {{value}} karekter olmalıdır.',
        isSelection: 'Lütfen {{title}} alanınından seçim yapınız.',
        isChecked: 'Lütfen {{title}} alanınından seçim yapınız.',
        isMail: 'Lütfen {{title}} alanınının formatını doğru giriniz.',
        isDate: 'Lütfen {{title}} alanınının formatını doğru giriniz.',
        isPhone: 'Lütfen {{title}} alanınının formatını doğru giriniz.',
        isPassword: 'Lütfen {{title}} alanınının formatını doğru giriniz.',
        isTwo: '{{title}} bölümü en az iki kelime halinde doldurulmalıdır.',
        isEqual: '{{title}} alanı ile {{value}} eşit olmalıdır.',
    },
    getErrorMsg: function ({ key = '', title = '', value = '' }) {
        const _t = this;
        return _t['errorMessage'][key].replace(/{{title}}/g, title).replace(/{{value}}/g, value);
    }
};