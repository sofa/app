/* global document */

angular.module('CouchCommerceApp')
.factory('contextViewService', function ($rootScope, $q, $http, $templateCache, $compile, $controller) {

    'use strict';

    var WRAPPER_ELEMENT_CLASS               = 'cc-page-wrapper',
        ANIMATION_SLIDE_IN_SETUP_CLASS      = 'slide-in-btt',
        ANIMATION_SLIDE_IN_ACTIVE_CLASS     = 'slide-in-btt-active',
        ANIMATION_SLIDE_OUT_SETUP_CLASS     = 'slide-out-ttb',
        ANIMATION_SLIDE_OUT_ACTIVE_CLASS    = 'slide-out-ttb-active',
        ANIMATION_RUN_TIME_MS               = 400,
        VIEW_MODIFIER_CLASS                 = 'cc-context-view',
        CONTEXT_VIEW_ACTIVE_CLASS           = 'cc-context-view--active',
        CONTEXT_VIEW_TRANSCLUSION_ELEMENT   = 'cc-context-view__content',
        CONTEXT_VIEW_TPL                    = 'common/contextviews/cc-context-view.tpl.html';

    var self = {},
        $wrapperElement;

    var current = null;

    self.openView = function (viewTpl, controller) {
        current = {
            viewTpl: viewTpl,
            controller: controller
        };

        current.$contextViewScope = $rootScope.$new();
        var $pageScope = current.$contextViewScope.$new();

        current.$contextViewScope.close = function () {
            self.closeView(viewTpl, controller);
        };

        $q.all([
            $http.get(viewTpl, { cache: $templateCache }),
            $http.get(CONTEXT_VIEW_TPL, { cache: $templateCache })
        ])
        .then(function (result) {
                
                var tplContent = result[0].data,
                    contextViewTpl    = result[1].data;

                if (controller) {
                    $controller(controller, { $scope: $pageScope });
                }

                current.$viewElement = $compile(tplContent.trim())($pageScope);
                current.$contextViewElement = $compile(contextViewTpl.trim())(current.$contextViewScope);

                var transclusionElement = angular.element(current.$contextViewElement[0].querySelector('.' + CONTEXT_VIEW_TRANSCLUSION_ELEMENT));
                transclusionElement.append(current.$viewElement);

                current.$contextViewElement
                    .addClass(ANIMATION_SLIDE_IN_SETUP_CLASS)
                    .addClass(VIEW_MODIFIER_CLASS);

                getWrapperElement().append(current.$contextViewElement);

                // we would love to use the $animator service here. Unfortunately
                // with our ancient AngularJS version, they still used a setTimeout approach
                // to trigger a reflow which works quite unreliable. So, we manually handle it for now
                // we should really investigate into upgrading soon.

                current.$viewElement[0].offsetWidth; /* jshint ignore:line */

                current.$contextViewElement.addClass(ANIMATION_SLIDE_IN_ACTIVE_CLASS);

                setTimeout(function () {
                    getWrapperElement().addClass(CONTEXT_VIEW_ACTIVE_CLASS);

                    current.$contextViewElement
                        .removeClass(ANIMATION_SLIDE_IN_SETUP_CLASS)
                        .removeClass(ANIMATION_SLIDE_IN_ACTIVE_CLASS);

                }, ANIMATION_RUN_TIME_MS);
            });
    };

    self.closeView = function (viewTpl, controller) {
        if (current && current.viewTpl === viewTpl && current.controller === controller) {
            
            current.$contextViewElement
                .addClass(ANIMATION_SLIDE_OUT_SETUP_CLASS);

            getWrapperElement().removeClass(CONTEXT_VIEW_ACTIVE_CLASS);

            current.$contextViewElement[0].offsetWidth; /* jshint ignore:line */

            current.$contextViewElement.addClass(ANIMATION_SLIDE_OUT_ACTIVE_CLASS);

            setTimeout(function () {
                current.$contextViewScope.$destroy();
                current.$contextViewElement.remove();
                current = null;
            }, ANIMATION_RUN_TIME_MS);
        }
    };

    self.toggleView = function (viewTpl, controller) {
        if (current && (current.viewTpl !== viewTpl || current.controller !== controller)) {
            self.closeCurrent();
        }
        else if (current) {
            self.closeView(viewTpl, controller);
        }
        else {
            self.openView(viewTpl, controller);
        }
    };

    self.closeCurrent = function () {
        self.closeView(current.viewTpl, current.controller);
    };

    var getWrapperElement = function () {

        if (!$wrapperElement) {
            $wrapperElement = angular.element(document.querySelector('.' + WRAPPER_ELEMENT_CLASS));
        }

        return $wrapperElement;
    };

    return self;
});
