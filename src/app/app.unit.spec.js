'use strict';

describe('CouchCommerceApp', function () {

    var $rootScope;

    beforeEach(module('CouchCommerceApp'));

    beforeEach(inject(function (_$rootScope_) {
        $rootScope = _$rootScope_;
    }));

    it('should run the tests', function () {
        expect(true).toBe(true);
    });

    it('should have i18n data defined on $rootScope', function () {
        expect($rootScope.ln).toBeDefined();
    });

    it('should have config defined on $rootScope', function () {
        expect($rootScope.cfg).toBeDefined();
    });

    it('should have sideDirectionService defined on $rootScope', function () {
        expect($rootScope.slideDirectionService).toBeDefined();
    });

    it('should have template service defined on $rootScope', function () {
        expect($rootScope.tpl).toBeDefined();
    });

    it('should have tablet size flag defined on $rootScope', function () {
        expect($rootScope.isTabletSize).toBeDefined();
    });
});
