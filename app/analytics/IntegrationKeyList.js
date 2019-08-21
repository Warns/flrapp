/* 
    burada insider, corebi gibi thisrdpartlere gönderilecek data desenleri ayarlanıyor. Örneğin

    insider: {
        category_visited: {
            event: 'category_visited',
            _keys: {
                title: 'category_name',
                catId: 'category_id',
                utpId: 'utp_id'
            }
        }
    }

    
    *** insider: bizim için entegrasyon tipi bu tipe göre insider koduna gönderilecek
    
    *** category_visited: Event listesinde tanımlanan gönderilecek değer. Analytics.send({ event: Analytics.events.category_visited, data: data }); burada gönderilen event: Analytics.events.category_visited kısmına denk gelir. Key liste tanımını bulamazsa tetiklenmez.

    *** event: 'category_visited': Bu kısım thirdparty bizden beklediği event ismi insider category_visited beklerken corebi category_visited_corebi olarak bekleyebilir.

    *** _keys: Bu kısım key value şeklide 2 kısımdan oluşuyor. Burada 
    _keys: {
        emostaki alan adı: 'insiderın beklediği alan adı'
    }

    *** tanımlanacak tipler
    - insider
    - corebi
    - firebase
*/

module.exports = {

    insider: {
        category_visited: {
            event: 'category_visited',
            _keys: {
                title: 'category_name',
                catId: 'category_id',
                utpId: 'utp_id'
            },
            customType: 'tagEventWithParameters'
        }
    },

    corebi: {
        category_visited: {
            event: 'category_visited',
            _keys: {
                title: 'corebi_category_name',
                catId: 'corebi_category_id',
                utpId: 'corebi_utp_id'
            }
        }
    }
};