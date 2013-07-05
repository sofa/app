angular
    .module('CouchCommerceApp')
    .factory('splitViewDataService',['$rootScope', function ($rootScope) {

            'use strict';

            var $self = {};

            $self.leftCategory = null;
            $self.rightCategory = null;
            $self.products = null;
            $self.product = null;

            var leftBoxIs = null;

            $self.setLeftBoxAsCategories = function(){
                leftBoxIs = 'categories';
            };

            $self.setLeftBoxAsProducts = function(){
                leftBoxIs = 'products';
            };

            $self.leftBoxIsCategories = function(){
                return leftBoxIs === 'categories';
            };

            $self.leftBoxIsProducts = function(){
                return !$self.leftBoxIsCategories();
            };

            return $self;
        }
    ]);
