angular.module('sdk.directives.ccTemplateCode', []);

angular.module('sdk.directives.ccTemplateCode')
    .directive('ccTemplateCode', function() {

        'use strict';

        return {
            restrict: 'A',
            controller: function(){},
            compile: function($element){
                $element.removeAttr('cc-template-code');
                //ATTENTION: We need to trim() here. Otherwise AngularJS raises an exception
                //later when we want to use the templateCode in a $compile function. 
                //Be aware that we assume a modern browser 
                //that already ships with a trim function.
                //It's easy to secure that with a polyfill.
                var templateCode = $element.parent().html().trim();
                return function(scope, iElement, iAttrs, controller){
                    controller.templateCode = templateCode;
                };
            }
        };
    });