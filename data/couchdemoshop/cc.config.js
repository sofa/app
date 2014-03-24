cc.Config = {
    loggingEnabled: true,
    useShopUrls: false,
    storeCode: '53787',
    storeName: 'CouchDemoShop',
    originalUrl:'http://couchcommerce.shopwaredemo.de/',
    noRedirectSuffix:'/CC/noRedirect',
    searchUrl: 'https://de7so.api.searchify.com/v1/indexes/production/search',
    apiUrl: 'http://cc1.couchcommerce.com/apiv7/products/',
    checkoutUrl:'http://couchdemoshop.couchcommerce.com/checkout/v4/',
    apiHttpMethod: 'jsonp',
    categoryJson: '/data/couchdemoshop/categories.json',
    //apiUrl: 'data/dasgibtesnureinmal/products.json',
    //apiHttpMethod: 'get',
    apiEndpoint: 'http://api.couchcommerce.com/',
    imageResizer: 'http://cdn1.couchcommerce.com/',
    imageResizerEnabled: true,
    mediaFolder:'http://cc1.couchcommerce.com/media/couchdemoshop/img/',
    mediaImgExtension:'png',
    mediaPlaceholder:'http://cdn.couchcommerce.com/media/platzhalter.png',
    resourceUrl:'/data/pages/',
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
                title:'AGB',
                id:'neptune'
            },
            {
                title:'Datenschutz',
                id:'saturn'
            },
            {
                title:'Rückgabeinformationen',
                id:'something'
            }
    ],
    injects: [
        {
            url: '/',
            template: 'some-teaser',
            target: 'aboveContent' //aboveContent, aboveFooter, beneathFooter
        }
    ],
    extraBillingFields: [], // 'merchantnote', 'pickuptimeatstore', 'streetextra'
    showSearch: true,
    enablePromotionCodes: true,
    trustedShopsEnabled: true,
    trustedShopsId: 'X35A8844FD4E62A875C2C9E1C05C39CD4',
    showPayPalButton: true,
    showCheckoutButton: true,
    googleAnalytics:'UA-42659602-1',
    googleAnalyticsSetDomain:'couchdemoshop.couchcommerce.com',
    googleConversionId:1072140179,
    googleConversionLabel:'r8ogCLjfZBCTn57_Aw',
    bingSiteId: '',
    bingDomainId: '',
    bingActionId: '',
    meta: {
        robots: 'noodp, noydir',
        description: 'This is the CouchDemoShop yay!'
    }
};
