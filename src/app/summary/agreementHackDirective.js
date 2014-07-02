'use strict';

angular.module('CouchCommerceApp')
       .directive('agreement', function ($rootScope, $compile, dialog, pagesServiceExtension, configService, contextViewService) {

    var showPage = function (pageId) {

        pagesServiceExtension.currentPageId = pageId;

        contextViewService.openView('pages/cc-context-pages.tpl.html', 'PagesController');
    };

    return {
        restrict: 'A',
        require: 'ccCheckBox',
        link: function (scope, $element, attrs, controller) {
            //ATTENTION: That's pretty the most shittiest code across the
            //entire code base. But the language files make it not very
            //easy to deal with and we don't want a breaking change on the
            //backend side.

            var oldLabel = $element.find('label');

            var agreementText = scope.$eval(attrs.agreement);

            //we need to create an entire new label. Otherwise the binding
            //will just remove our hard inserted value. We need to directly
            //reach out to the checkbox id. Super ugly yep.
            oldLabel.after('<label for="cc-check-box-' + controller.getId() + '" class="cc-checkbox__label">' + agreementText + '</label>');

            oldLabel.remove();

            var element = $element[0];

            angular.element(element.querySelector('#agblink')).bind('click', function () {
                scope.$apply(function () {
                    var pageId = configService.get('linkGeneralAgreement');
                    showPage(pageId);
                });
            });

            angular.element(element.querySelector('#widerruflink')).bind('click', function () {
                scope.$apply(function () {
                    var pageId = configService.get('linkRecallAgreement');
                    showPage(pageId);
                });
            });
        }
    };
});
