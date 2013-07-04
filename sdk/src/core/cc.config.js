cc.Config = {
    storeId: 38883,
    apiUrl: 'http://cc1.couchcommerce.com/apiv6/products/',
    apiHttpMethod: 'jsonp',
    categoryJson: '../data/sir-chesterfield/categories.json',
    //apiUrl: 'data/dasgibtesnureinmal/products.json',
    //apiHttpMethod: 'get',
    mediaFolder:'http://cc1.couchcommerce.com/media/sirchesterfield/img/',
    mediaImgExtension:'png',
    mediaPlaceholder:'http://cdn.couchcommerce.com/media/platzhalter.png',
    shippingCost:5,
    shippingTax:19,
    shippingFreeFrom: null,
    currencySign:'EUR',
    shippingText:'zzgl. 5€ Versandkosten',
    aboutPages:[
            {
                title:'Neptune',
                id:'neptune'
            },
            {
                title:'Saturn',
                id:'saturn'
            }
    ]
};