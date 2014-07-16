'use strict';

// var products = require('../data').products;

module.exports = function (req, res, next, query) {

    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/javascript',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    });

    var result = '(';

    var data = ({
        'items': [{
            'id': '13',
            'name': 'Pai Mu Tan Tee weiss',
            'price': '2.50',
            'productId': 'SW10013',
            'tax_percent': '19',
            'imageURL': 'http:\/\/couchcommerce.shopwaredemo.de\/media\/image\/thumbnail\/Tee-weiss-Pai-Mu-Tan_720x600.jpg',
            'imageAlt1': 'http:\/\/couchcommerce.shopwaredemo.de\/media\/image\/thumbnail\/Tee-weiss-Pai-Mu-Tan-Dose_720x600.jpg',
            'variants': '',
            'parentImageURL': null,
            'qty': 1,
            'taxAmount': 0.39915966386555,
            'tax': '2.50',
            'subtotal': '2.50',
            'details': ''
        }],
        'totals': {
            'subtotal': '2.50',
            'shipping': '4.95',
            'vat': '1.19',
            'grandtotal': '7.45'
        },
        'billing': {
            'salutation': 'Frau',
            'firstname': 'sdfsdf',
            'lastname': 'sdfsdf',
            'company': '',
            'email': 'sdfdsfsdf@sdfsdfsdf.com',
            'street1': 'dsfsdf',
            'street': 'dsfsdf',
            'streetnumber': '123',
            'streetextra': '',
            'city': 'sdffdsdf',
            'zip': 'sdfsdf',
            'state': '',
            'country': 'DE',
            'countryname': 'Deutschland',
            'phone': '1231231231231',
            'birthdate': ''
        },
        'shipping': {
            'salutation': 'Frau',
            'firstname': 'sdfsdf',
            'lastname': 'sdfsdf',
            'company': '',
            'email': 'sdfdsfsdf@sdfsdfsdf.com',
            'street1': 'dsfsdf',
            'street': 'dsfsdf',
            'streetnumber': '123',
            'streetextra': '',
            'city': 'sdffdsdf',
            'zip': 'sdfsdf',
            'state': '',
            'country': 'DE',
            'countryname': 'Deutschland',
            'phone': '1231231231231',
            'birthdate': '',
            'id': '9'
        },
        'paymentMethod': 'Vorkasse',
        'shippingMethod': 'Standard Versand',
        'trusted_shops': 'PREPAYMENT'
    });

    result += JSON.stringify(data);
    result += ')';

    res.end(result);

};
