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
    dropdown: {
        chooseInstallment: 'Taksit Seçiniz',
        choose: 'Seçiniz',
        countryChoose: 'Ülke Seçiniz',
        cityChoose: 'İl Seçiniz',
        districtChoose: 'İlçe Seçiniz'
    },
    address: {
        remove: 'Sil',
        edit: 'Düzenle',
        viewer: 'Görüntüle',
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
        isStar: 'puan seç',
        isCreditCard: 'geçersiz kart',
        isCvcCode: 'geçersiz cvc',
        isCustomDate: 'geçersiz format'
    },
    feeds: {
        instagramDetail: 'Instagram\'a git',
        instagram: 'Keşfet',
        video: 'Video\'yu izle',
        promo: 'Alışverişe Başla',
        product: 'Satın al',
        blog: 'İletiyi incele',
        collection: 'Koleksiyonu keşfet',
        campaing: 'Kampanya Detaylarını İncele'
    },
    extra: {
        title: 'Flormar Extra nedir?',
        desc: 'Flormar mobil uygulama, website, ve mağazalarından yapacağın her alışverişinde sana Extra TL’ler kazandıracak, özel günlerinde sürprizler yapacak bir bağlılık programıdır.'
    },
    intro: [
        {
            thumb: "https://www.flormar.com.tr/UPLOAD/APP/assets/slider-1.png",
            curve: "type2",
            title: "HOŞ GELDİN!",
            text:
                "Yenilenen Flormar Mobil uygulaması ile sana özel içerik ve kampanyalarla mobil alışveriş deneyiminin keyfini çıkar.",
            video: false
        },
        {
            thumb: "https://www.flormar.com.tr/UPLOAD/APP/assets/slider-2.png",
            curve: "type1",
            title: "FLORMAR EXTRA",
            text:
                "Flormar Extra üyesi olmak için mobil uygulamaya giriş yap, her siparişte %5 Extra TL* kazan.\n\n*1 Extra TL = 1 TL"
        },
        {
            thumb: "https://www.flormar.com.tr//UPLOAD/APP/assets/slider-3.png",
            curve: "type2",
            title: "HEMEN ÜYE OL",
            text:
                "Online’a özel ilk siparişinde tüm ürünlerde net 25% indirim kazan!\nKupon kodu: WELCOME25 \n\n*Kargo 1 TL "
        }
    ],
    getErrorMsg: function ({ key = '', title = '', value = '' }) {
        const _t = this;
        return _t['errorMessage'][key].replace(/{{title}}/g, title).replace(/{{value}}/g, value);
    }
};