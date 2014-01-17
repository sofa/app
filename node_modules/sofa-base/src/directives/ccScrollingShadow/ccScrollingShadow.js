angular.module('sdk.directives.ccScrollingShadow', []);

angular.module('sdk.directives.ccScrollingShadow')
    .directive('ccScrollingShadow', function() {

        'use strict';

        return {
            restrict: 'A',
            link: function(scope, $element, attr){

                var $topShadow          = angular.element('<div class="cc-scrolling-shadow-top"></div>'),
                    $bottomShadow       = angular.element('<div class="cc-scrolling-shadow-bottom"></div>'),
                    $parent             = $element.parent();

                $parent
                    .append($topShadow)
                    .append($bottomShadow);

                var topShadowHeight     = $topShadow[0].clientHeight,
                    bottomShadowHeight  = $bottomShadow[0].clientHeight;


                //IE uses scrollTop instead of scrollY
                var getScrollTop = function(element){
                    return ('scrollTop' in element) ? element.scrollTop : element.scrollY;
                };

                var updateShadows = function(){

                    var element                     = $element[0],
                        scrollTop                   = getScrollTop(element),
                        clientHeight                = element.clientHeight,
                        scrollHeight                = element.scrollHeight,
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

                    $topShadow.css('top', rollingShadowOffsetTop + 'px');
                    $bottomShadow.css('bottom', rollingShadowOffsetBottom + 'px');
                };

                setTimeout(updateShadows, 1);

                $element.bind('scroll', updateShadows);
            }
        };
    });
