cc.Config = {
    loggingEnabled: true,
    storeCode: '76272',
    storeName: 'Magento Demo',
    originalUrl:'http://demo.couchcommerce.com/magento/',
    noRedirectSuffix:'/CC/noRedirect',
    searchUrl: 'https://de7so.api.searchify.com/v1/indexes/production/search',
    apiUrl: 'http://cc1.couchcommerce.com/apiv7/products/',
    checkoutUrl:'http://magentodemo.couchcommerce.com/checkout/v4/',
    apiHttpMethod: 'jsonp',
    categoryJson: 'data/magentodemo/categories.json',
    //apiUrl: 'data/dasgibtesnureinmal/products.json',
    //apiHttpMethod: 'get',
    apiEndpoint: 'http://api.couchcommerce.com/',
    imageResizer: 'http://cdn1.couchcommerce.com/',
    imageResizerEnabled: true,
    mediaFolder:'https://cc1.couchcommerce.com/media/magentodemo/img/',
    mediaImgExtension:'png',
    mediaPlaceholder:'http://cdn.couchcommerce.com/media/platzhalter.png',
    resourceUrl:'../data/pages/',
    shippingCost:5,
    shippingTax:19,
    shippingFreeFrom: null,
    currency:'EUR',
    currencySign:'€',
    showGeneralAgreement:1,
    showAgeAgreement:0,
    showAppExitLink:true,
    linkGeneralAgreement:'saturn',
    linkRecallAgreement:'neptune',
    linkAgeAgreement:'age',
    linkShippingCosts:'shipping',
    locale:'de-de',
    countries:[{"value":"DE","label":"Deutschland"},{"value":"AT","label":"\u00d6sterreich"},{"value":"AE","label":"Arabische Emirate"},{"value":"AU","label":"Australien"},{"value":"BE","label":"Belgien"},{"value":"DK","label":"D\u00e4nemark"},{"value":"FI","label":"Finnland"},{"value":"IT","label":"Italien"},{"value":"NL","label":"Niederlande"},{"value":"CH","label":"Schweiz"},{"value":"ES","label":"Spanien"}],
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
    ],
    trustedShopsEnabled: true,
    trustedShopsId: 'X35A8844FD4E62A875C2C9E1C05C39CD4',
    showPayPalButton: true,
    showCheckoutButton: true,
    meta: {
        robots: 'noodp, noydir'
    }
};
