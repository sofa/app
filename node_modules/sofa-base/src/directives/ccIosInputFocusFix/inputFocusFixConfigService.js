angular
    .module('sdk.directives.ccIosInputFocusFix')
    .factory('inputFocusFixConfigService', [function(){
        'use strict';

        var self = {};

        self.enabled = false;

        return self;
}]);