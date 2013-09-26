
angular
    .module('CouchCommerceApp')
    .directive('ccImageZoom', function() {

        'use strict';

        var EXPANDED_CLS            = 'cc-product-view-image--expanded',
            EXPANDED_VISIBLE_CLS    = 'cc-product-view-image--expanded--visible',
            ANIMATON_DURATION_MS    = 500;

        return {
            restrict: 'A',
            link: function(scope, $element, attrs){

                var body = document.body;
                var $appContent = angular.element(document.querySelector('body > div'));

                var createClone = function($el){
                    var $clone = $el.clone();
                    $clone.addClass(EXPANDED_CLS);
                    body.appendChild($clone[0]);
                    //we need to set the whole underlying thing to display:none
                    //otherwise on some platforms (Android 2 I'm looking at you)
                    //the content behind the fullscreen image will still be visible
                    //and even scrollable which gives a bad experience.
                    $appContent.css('display', 'none');
                    $clone.addClass(EXPANDED_CLS);
                    $clone[0].offsetWidth;
                    $clone.addClass(EXPANDED_VISIBLE_CLS);
                    $clone.bind('click', function(){
                        $appContent.css('display', '');
                        $clone.removeClass(EXPANDED_VISIBLE_CLS);
                        //yeah, super lame. This whole code is just temporally to have at least
                        //something until we implement it properly
                        setTimeout(function(){
                            $clone.remove();
                        },ANIMATON_DURATION_MS);
                    });
                };

                $element.bind('click', function(){
                    createClone($element);
                });
            }
        };
    });