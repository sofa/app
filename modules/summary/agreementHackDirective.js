

angular
    .module('CouchCommerceApp')
    .directive('agreement', ['$rootScope', '$compile', 'dialog', 'pagesService', 'configService', function($rootScope, $compile, dialog, pagesService, configService) {

        'use strict';

        var showPage = function(pageId){
            pagesService
                .getPage(pageId)
                .then(function(page){
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
                agreement: '='
            },
            link: function(scope, $element, attrs){
                //ATTENTION: That's pretty the most shittiest code across the
                //entire code base. But the language files make it not very
                //easy to deal with and we don't want a breaking change on the
                //backend side.

                var oldLabel = $element.find('span');

                //we need to remove the entire label since. Otherwise the bindign
                //will just remove our hard inserted value.
                oldLabel.after('<span>' + scope.agreement + '<test>');

                oldLabel.remove();

                var element = $element[0];

                angular
                    .element(element.querySelector('#agblink'))
                    .bind('click', function(){

                        var pageId = configService.get('linkGeneralAgreement');
                        showPage(pageId);
                        scope.$apply();
                    });

                angular
                    .element(element.querySelector('#widerruflink'))
                    .bind('click', function(){
                        var pageId = configService.get('linkRecallAgreement');
                        showPage(pageId);
                        scope.$apply();
                    });
            }
        };
    }]);