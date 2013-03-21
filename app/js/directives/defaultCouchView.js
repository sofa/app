'use strict';

//this our application specific default view that uses the cc-fixed-toolbars-view
//behind the scenes but already sets the header and footer for our app
//If some views need different header/footer they can just directly use
//the cc-fixed-toolbars-view and set the footer and header attributes accordingly
angular.module("CouchCommerceApp")
    .directive('defaultCouchView', function() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            templateUrl: 'views/app-directive-templates/defaultcouchview.html'
        };
    });

