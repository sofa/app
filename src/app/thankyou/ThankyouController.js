'use strict';

angular.module('CouchCommerceApp')
.controller('ThankyouController', function ($scope, navigationService, trustedShopsService, summaryResponse, trackingService, basketService, titleService) {
    titleService.setTitleWithSuffix($scope.ln.thankYouTitle);
    // It is possible that an error occurs between the summary and thankyou page (e.g. couchpay)
    // There the basket is only cleared when the thankyou page is loaded (as this page will always be shown, regardless of the transaction type)
    basketService.clear();

    trackingService.trackTransaction(summaryResponse.token);
    trackingService.trackEvent({
        category: 'pageView',
        label: '/thankyou'
    });

    var vm = $scope.vm = {};

    $scope.navigationService = navigationService;
    $scope.trustedShopsService = trustedShopsService;

    vm.summary = summaryResponse.summary;
    /* jslint camelcase: false */
    vm.trustedShopsPaymentIdentifier = summaryResponse.response.trusted_shops;

});
