'use strict';
/* global document */

angular.module('CouchCommerceApp.plugins').run(['dialog', '$timeout', 'storageService', function (dialog, $timeout, storageService) {

    if (!storageService.get('has-shown-welcome-modal')) {
        storageService.set('has-shown-welcome-modal', true);
        dialog.messageBox(null, null, [
            {
                result: 'ok',
                label: cc.Lang.btnOk
            }
        ]).opened
        .then(function () {
            $timeout(function () {
                var modal = document.getElementsByClassName('modal');
                angular.element(modal).children()[0].remove();
                angular.element(angular.element(modal).children()[0])
                .html('<iframe class="cc-modal-iframe" src="http://sofa.couchcommerce.com/"></iframe>');
            }, 0);
        });
    }
}]);
