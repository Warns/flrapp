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

    /* 
        INSIDER
    */

    insider: {

        category_visited: {
            event: 'category_visited',
            _keys: {
                title: 'category_name',
                catId: 'category_id',
                utpId: 'utp_id'
            },
            customType: 'tagEventWithParameters'
        },

        add_to_cart: {
            event: 'add_to_cart',
            _keys: {
                'productName': 'product_name',
                'productCode': 'product_id',
                'catId': 'category_id',
                'salePrice': 'product_price'
            },
            customType: 'tagEventWithParameters'
        },

        removed_from_cart: {
            event: 'removed_from_cart',
            _keys: {
                'productName': 'product_name',
                'productCode': 'product_id',
                'catId': 'category_id',
                'salePrice': 'product_price'
            },
            customType: 'tagEventWithParameters'
        },

        add_to_fav: {
            event: 'add_to_fav',
            _keys: {
                'productName': 'product_name',
                'productCode': 'product_id',
                'catId': 'category_id',
                'salePrice': 'product_price'
            },
            customType: 'tagEventWithParameters'
        },

        remove_to_fav: {
            event: 'remove_to_fav',
            _keys: {
                'productName': 'product_name',
                'productCode': 'product_id',
                'catId': 'category_id',
                'salePrice': 'product_price'
            },
            customType: 'tagEventWithParameters'
        },

        remove_to_fav: {
            event: 'remove_to_fav',
            _keys: {
                'productName': 'product_name',
                'productCode': 'product_id',
                'catId': 'category_id',
                'salePrice': 'product_price'
            },
            customType: 'tagEventWithParameters'
        },

        product_visited: {
            event: 'product_visited',
            _keys: {
                'productName': 'product_name',
                'productCode': 'product_id',
                'catId': 'category_id',
                'salePrice': 'product_price'
            },
            customType: 'tagEventWithParameters'
        },

        coupon_used: {
            event: 'coupon_used',
            _keys: {
                'couponCode': 'coupon_code'
            },
            customType: 'tagEventWithParameters'
        },

        remove_coupon: {
            event: 'remove_coupon',
            _keys: {
                'couponCode': 'coupon_code'
            },
            customType: 'tagEventWithParameters'
        },

        searched: {
            event: 'searched',
            _keys: {
                'keyword': 'keyword'
            },
            customType: 'tagEventWithParameters'
        },

        logout: {
            event: 'logout',
            customType: 'setCustomFunc'
        },

        login: {
            event: 'login',
            _keys: {
                'birthDay': 'birthDay',
                'email': 'email',
                'firstName': 'firstName',
                'lastName': 'lastName',
                'gender': 'gender',
                'mobilePhone': 'mobilePhone',
                'userId': 'userId'
            },
            customType: 'setCustomFunc'
        },

        register: {
            event: 'register',
            _keys: {
                'birthDay': 'birthDay',
                'email': 'email',
                'firstName': 'firstName',
                'lastName': 'lastName',
                'gender': 'gender',
                'mobilePhone': 'mobilePhone',
                'userId': 'userId'
            },
            customType: 'setCustomFunc'
        },

    },

    /* 
        COREBI
    */

    corebi: {

        category_visited: {
            event: 'category_visited',
            _keys: {
                title: 'category_name',
                catId: 'category_id',
                utpId: 'utp_id'
            }
        },

        add_to_cart: {
            event: 'add_to_cart',
            _keys: {
                'productName': 'product_name',
                'productCode': 'product_id',
                'catId': 'category_id',
                'salePrice': 'product_price'
            }
        },

        removed_from_cart: {
            event: 'removed_from_cart',
            _keys: {
                'productName': 'product_name',
                'productCode': 'product_id',
                'catId': 'category_id',
                'salePrice': 'product_price'
            }
        },

        add_to_fav: {
            event: 'add_to_fav',
            _keys: {
                'productName': 'product_name',
                'productCode': 'product_id',
                'catId': 'category_id',
                'salePrice': 'product_price'
            }
        },

        remove_to_fav: {
            event: 'remove_to_fav',
            _keys: {
                'productName': 'product_name',
                'productCode': 'product_id',
                'catId': 'category_id',
                'salePrice': 'product_price'
            }
        },

        product_visited: {
            event: 'product_visited',
            _keys: {
                'productName': 'product_name',
                'productCode': 'product_id',
                'catId': 'category_id',
                'salePrice': 'product_price'
            }
        },

        coupon_used: {
            event: 'coupon_used',
            _keys: {
                'couponCode': 'coupon_code'
            }
        },

        remove_coupon: {
            event: 'remove_coupon',
            _keys: {
                'couponCode': 'coupon_code'
            }
        },

        searched: {
            event: 'searched',
            _keys: {
                'keyword': 'keyword'
            }
        },

        logout: {
            event: 'logout'
        },

        login: {
            event: 'login',
            _keys: {
                'birthDay': 'birthDay',
                'email': 'email',
                'firstName': 'firstName',
                'lastName': 'lastName',
                'gender': 'gender',
                'mobilePhone': 'mobilePhone',
                'userId': 'userId'
            }
        },

        register: {
            event: 'register',
            _keys: {
                'birthDay': 'birthDay',
                'email': 'email',
                'firstName': 'firstName',
                'lastName': 'lastName',
                'gender': 'gender',
                'mobilePhone': 'mobilePhone',
                'userId': 'userId'
            }
        },

    }

};