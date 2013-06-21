angular.module('sdk.directives.ccScrollingShadow', []);

angular.module('sdk.directives.ccScrollingShadow')
    .directive('ccScrollingShadow', function() {

        'use strict';

        return {
            restrict: 'A',
            link: function(scope, $element, attr){

                $element = $($element[0]);

                var $topShadow          = $('<div class="cc-scrolling-shadow-top"></div>'),
                    $bottomShadow       = $('<div class="cc-scrolling-shadow-bottom"></div>'),
                    $parent             = $element.parent();

                $parent
                    .append($topShadow)
                    .append($bottomShadow);

                var topShadowHeight     = $topShadow.height(),
                    bottomShadowHeight  = $bottomShadow.height();

                var updateShadows = function(){

                    var scrollTop                   = $element.scrollTop(),
                        clientHeight                = $element[0].clientHeight,
                        scrollHeight                = $element[0].scrollHeight,
                        bottomTopVal                = (scrollTop - bottomShadowHeight) + clientHeight,
                        scrollBottom                = scrollHeight - scrollTop - clientHeight,
                        rollingShadowOffsetTop      = 0,
                        rollingShadowOffsetBottom   = 0;

                    if (scrollTop < topShadowHeight){
                        rollingShadowOffsetTop      = (topShadowHeight - scrollTop) * -1;
                    }

                    if (scrollBottom < bottomShadowHeight){
                        rollingShadowOffsetBottom = (bottomShadowHeight - scrollBottom) * -1;
                    }

                    $topShadow.css('top', rollingShadowOffsetTop);
                    $bottomShadow.css('bottom', rollingShadowOffsetBottom);
                };

                setTimeout(updateShadows, 1);

                $element.bind('scroll', updateShadows);
            }
        };
    });
