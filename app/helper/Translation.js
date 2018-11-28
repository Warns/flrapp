module.exports = {
    cart: {
        addTo: 'SEPETE AT'
    },
    confirm: {
        cancel: 'İptal',
        ok: 'Tamam',
        removeMessage: 'Silmek istediğinize emin misiniz?',
        exitButton: 'Çıkış yapmak istediğinize emin misiniz?'
    },
    dropdown:{
        choose: 'Seçiniz',
        countryChoose: 'Ülke Seçiniz',
        cityChoose: 'İl Seçiniz',
        districtChoose: 'İlçe Seçiniz'
    },
    address: {
        remove: 'Sil',
        edit: 'Düzenle',
        select: 'SEÇ',
        selected: 'SEÇİLDİ',
        selectShipAddress: 'TESLİMAT ADRESİ',
        selectedShipAddress: 'TESLİMAT ADRESİ',
        selectBillAddress: 'FATURA ADRESİ',
        selectedBillAddress: 'FATURA ADRESİ',
        errorShipAddress: 'Teslimat ve fatura adresi seçmelisiniz.',
        errorBillAddress: 'Fatura adresi seçmelisiniz.',
        errorCargo: 'Kargo seçmelisiniz'
    },
    store: {
        headerTitle: 'YAKIN MAĞAZALAR'
    },
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
        buttonCargoFollow: 'Kargo Takibi',
        totalPriceWithoutProm: 'Kargo hariç toplam',
        paymentType: 'Ödeme Türü',
        bankName: 'Banka Bilgisi',
        cargoName: 'Kargo Firması',
        vatExcludingTotal: 'KDV hariç toplam',
        vat: 'Toplam KDV'
    },
    errorMessage: {
        /*
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
        */

       isEmpty: 'zorunlu alan',
       isMin: 'min. karekter sayısı {{value}}',
       isMax: 'maks. karekter sayısı {{value}}',
       isSelection: 'seçim yap',
       isChecked: 'seçim yap',
       isMail: 'geçersiz format',
       isDate: 'geçersiz format',
       isPhone: 'eksik numara',
       isPassword: 'zorunlu alan',
       isTwo: 'en az iki kelime',
       isEqual: '{{value}} ile eşit değil',
    },
    feeds: {
        instagram: 'Keşfet',
        video: 'Video\'yu izle',
        promo: 'Alışverişe Başla',
        product: 'Satın al',
        blog: 'İletiyi incele',
        collection: 'Koleksiyonu keşfet',
        campaing: 'Detaylar'
    },
    getErrorMsg: function ({ key = '', title = '', value = '' }) {
        const _t = this;
        return _t['errorMessage'][key].replace(/{{title}}/g, title).replace(/{{value}}/g, value);
    }
};