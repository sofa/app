angular.module('sdk.directives.ccScrollFix', []);

angular.module('sdk.directives.ccScrollFix')
    .directive('ccScrollFix', function() {

        'use strict';
        //This code is inspired by https://github.com/joelambert/ScrollFix
        //but was turned into a angular directive

        //It partly works around scrolling issues on iOS where the elastic
        //scrolling comes into our way when using overflow:scroll sub elements

        return {
            restrict: 'A',
            link: function(scope, $element, attrs){

                var startY, 
                    startTopScroll,
                    element = $element[0];

                $element.bind('touchstart', function(event){
                    startY = event.touches[0].pageY;
                    startTopScroll = element.scrollTop;

                    if(startTopScroll <= 0)
                        element.scrollTop = 1;

                    if(startTopScroll + element.offsetHeight >= element.scrollHeight)
                        element.scrollTop = element.scrollHeight - element.offsetHeight - 1;
                });
            }
        };
    });