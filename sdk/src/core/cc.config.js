cc.Config = {
    storeId: 88399,
    apiUrl: 'http://cc1.couchcommerce.com/apiv6/products/',
    apiHttpMethod: 'jsonp',
    categoryJson: 'data/dasgibtesnureinmal/categories.json',
    //apiUrl: 'data/dasgibtesnureinmal/products.json',
    //apiHttpMethod: 'get',
    mediaFolder:'http://cc1.couchcommerce.com/media/dasgibtesnureinmal/img/',
    mediaImgExtension:'png',
    mediaPlaceholder:'http://cdn.couchcommerce.com/media/platzhalter.png',
    resourceUrl:'http://localhost:8888/couchcommerce/couchcommerce-frontend/app/data/pages/',
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
            },
            {
                title:'Something',
                id:'something'
            }
    ]
};