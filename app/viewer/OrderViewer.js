import React, { Component } from 'react';
import {
    View,
    Text,
} from 'react-native';
const Translation = require('root/app/helper/Translation.js');

const data = {
    "status": 200,
    "message": null,
    "innerMessage": null,
    "data": {
        "order": {
            "orderId": 23419,
            "orderNo": "SIP0065746440",
            "orderDate": "02012017 17:48:00",
            "status": "İptal",
            "shippingTotal": 4.99,
            "numberOfRows": 2,
            "discountPrice": 5.93,
            "promDiscountPrice": 0,
            "totalPrice": 24.79,
            "totalPriceWithoutProm": 19.8,
            "currency": "TL",
            "cargo": [
                {
                    "invoiceId": 0,
                    "cargoKey": "string",
                    "cargoTrackUrl": "string"
                }
            ],
            "shipAddressText": "YTÜ Davutpaşa Kampüsü, Teknopark C1 Blok 205\r\nEsenler / İstanbul ESENLER / İstanbul Türkiye 34000",
            "billAddressText": "YTÜ Davutpaşa Kampüsü, Teknopark C1 Blok 205\r\nEsenler / İstanbul ESENLER / İstanbul Türkiye 34000",
            "shipAddressId": 391114,
            "billAddressId": 391114,
            "products": [
                {
                    "orderItemId": 68591,
                    "productId": 571724,
                    "productCode": "0313058-002",
                    "productName": "MATCH BUTTER LIP TINT",
                    "brandId": 3064,
                    "brandName": "Flormar",
                    "productShortDesc": "Dudaklarında doğal ve canlı görünüm! ",
                    "productOption1": "",
                    "productOption2": "",
                    "quantity": 1,
                    "unitCode": "Adet",
                    "mediumImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313058-002_medium.jpg",
                    "smallImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313058-002_small.jpg",
                    "firstPrice": 16.9,
                    "firstPriceTotal": 16.9,
                    "salePrice": 9.9,
                    "salePriceWithoutProm": 9.9,
                    "salePriceWithoutPromTotal": 9.9,
                    "discountPrice": 5.93,
                    "promDiscountPrice": 0,
                    "brutTotal": 14.32,
                    "netTotal": 9.9,
                    "taxPrice": 1.51,
                    "isGiftPackage": false
                },
                {
                    "orderItemId": 68590,
                    "productId": 569865,
                    "productCode": "0313046-002",
                    "productName": "LIP BALM",
                    "brandId": 3064,
                    "brandName": "Flormar",
                    "productShortDesc": "Nemlendirirken dudaklara renk veren lip balm.",
                    "productOption1": "",
                    "productOption2": "",
                    "quantity": 1,
                    "unitCode": "Adet",
                    "mediumImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313046-002_medium.jpg",
                    "smallImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313046-002_small.jpg",
                    "firstPrice": 9.9,
                    "firstPriceTotal": 9.9,
                    "salePrice": 9.9,
                    "salePriceWithoutProm": 9.9,
                    "salePriceWithoutPromTotal": 9.9,
                    "discountPrice": 0,
                    "promDiscountPrice": 0,
                    "brutTotal": 8.39,
                    "netTotal": 9.9,
                    "taxPrice": 1.51,
                    "isGiftPackage": false
                }
            ]
        }
    }
};

class OrderViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: data.data.order
        }
    }

    _getTemplate = ({ keys = [], data = {}, style = {} }) => {
        const arr = [];
        keys.map((key, index) => {
            const title = Translation['orders'][key],
                value = data[key],
                view = (
                    <View key={index} style={[{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'space-between' }, {...style}]}>
                        <Text style={{ flex: 1, fontFamily: 'RegularTyp2', fontSize: 13, color: '#9b9b9b' }}>{title}</Text>
                        <Text style={{ flex: 2, fontFamily: 'Regular', fontSize: 16, }}>{value}</Text>
                    </View>
                );
            arr.push(view);
        });
        return arr;
    }

    render() {
        const _self = this,
            data = _self.state.data;

        return (
            <View>
                {_self._getTemplate({ keys: ['orderNo', 'orderDate', 'status', 'currency'], data: data })}
                {_self._getTemplate({ keys: ['shipAddressText', 'billAddressText'], data: data, style: { alignItems: 'flex-start' } })}
            </View>
        );
    }
}

export { OrderViewer };

/*
['orderNo', 'orderDate', 'status', 'currency'] 
['cargoKey'] 
['shipAddressText', 'billAddressText']
*/