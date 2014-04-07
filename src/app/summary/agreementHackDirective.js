'use strict';

angular.module('CouchCommerceApp').directive('agreement', function ($rootScope, $compile, dialog, pagesService, configService) {

    var showPage = function (pageId) {
        pagesService
            .getPage(pageId)
            .then(function (page) {
                dialog
                    .messageBox(
                        page.title,
                        page.content,
                        [{result: 'ok', label: $rootScope.ln.btnOk}]
                    );
            });
    };

    return {
        restrict: 'A',
        scope: {
            agreement: '=',
        },
        link: function (scope, $element) {
            //ATTENTION: That's pretty the most shittiest code across the
            //entire code base. But the language files make it not very
            //easy to deal with and we don't want a breaking change on the
            //backend side.

            var oldLabel = $element.find('label');

            //we need to create an entire new label. Otherwise the binding
            //will just remove our hard inserted value. We need to directly
            //reach out to the checkbox id. Super ugly yep.
            oldLabel.after('<label for="cc-check-box-' + scope.id + '" class="cc-checkbox__label">' + scope.agreement + '</label>');

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
