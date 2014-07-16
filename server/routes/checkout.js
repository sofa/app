'use strict';

var products = require('../data').products;

module.exports = function (req, res, next, query) {

    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/javascript',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    });

    var result = '(';
    var data = null;

    if (req.body.task === 'CHECKOUT') {
        data = ({
            'token': 'CC_b7976f463db8a3ea492ea6dd9c61c31d'
        });
    } else {
        data = ({
            'errorMsg': '',
            'paymentMethods': [{
                'method': 'paypal_express',
                'title': 'PayPal',
                'trusted_shops': 'PAYPAL',
                'description': '',
                'surcharge': '0'
            }, {
                'method': 'prepayment',
                'code': 'prepayment',
                'title': 'Vorkasse',
                'trusted_shops': 'PREPAYMENT',
                'description': 'Sie zahlen einfach vorab und erhalten die Ware bequem und g\u00fcnstig bei Zahlungseingang nach Hause geliefert.',
                'surcharge': 0,
                'surcharge_percentage': null,
                'countries': 'DE,BE,DK,FR,GB,NL'
            }, {
                'method': 'invoice',
                'code': 'invoice',
                'title': 'Rechnung',
                'trusted_shops': 'INVOICE',
                'description': 'Sie zahlen einfach und bequem auf Rechnung. Shopware bietet z.B. auch die M\u00f6glichkeit, Rechnung automatisiert erst ab der 2. Bestellung f\u00fcr Kunden zur Verf\u00fcgung zu stellen, um Zahlungsausf\u00e4lle zu vermeiden.',
                'surcharge': 0,
                'surcharge_percentage': 0,
                'countries': 'DE'
            }, {
                'method': 'couchcommerce_BPY',
                'type': 'datatrans',
                'code': 'BPY',
                'trusted_shops': 'INVOICE',
                'title': 'Rechnung BillPay',
                'image_link': 'https:\/\/pilot.datatrans.biz\/upp\/images\/logos\/BPY.png',
                'description': '',
                'redirect': 'couch_pay.php',
                'surcharge': '0',
                'extra_fields': ['birthdate', 'phone'],
                'extraFields': [{
                    'name': 'birthdate',
                    'label': 'Geburtsdatum',
                    'type': 'date',
                    'required': true
                }, {
                    'name': 'phone',
                    'label': 'Telefonnummer',
                    'type': 'phone',
                    'required': true
                }]
            }, {
                'method': 'couchcommerce_BSF',
                'type': 'datatrans',
                'code': 'BSF',
                'trusted_shops': 'INVOICE',
                'title': 'Rechnung BillSafe',
                'image_link': 'https:\/\/pilot.datatrans.biz\/upp\/images\/logos\/BSF.png',
                'description': '',
                'redirect': 'couch_pay.php',
                'surcharge': '0',
                'extra_fields': ['birthdate', 'phone'],
                'extraFields': [{
                    'name': 'birthdate',
                    'label': 'Geburtsdatum',
                    'type': 'date',
                    'required': true
                }, {
                    'name': 'phone',
                    'label': 'Telefonnummer',
                    'type': 'phone',
                    'required': true
                }]
            }],
            'quoteid': 4170,
            'shippingMethods': [{
                'method': '9',
                'title': 'Standard Versand',
                'description': '',
                'price': 4.95,
                'price_net': 4.16,
                'use_shipping_tax': false,
                'tax': 0.79
            }, {
                'method': '14',
                'title': 'Express Versand',
                'description': '',
                'price': 9.95,
                'price_net': 8.36,
                'use_shipping_tax': false,
                'tax': 1.59
            }],
            'defaultPaymentMethod': 'null'
        });
    }

    result += JSON.stringify(data);
    result += ')';

    res.end(result);

};
