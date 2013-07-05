angular
    .module('CouchCommerceApp')
    .factory('splitViewSlideDirectionService',['$rootScope', function ($rootScope) {

            'use strict';

            var direction = 'btt',
                indexMap = {},
                lastStateChangeWasLevelChange = false,
                CATEGORY_STATE_NAME = 'cat.filled.list',
                CATEGORY_RESOLVE_STATE = '@cat.filled',
                $self = {};

            $rootScope.$on('$stateChangeSuccess', function(evt, toState, toParams, toLocals, fromState, fromParams, fromLocals){
                if (toState.name === CATEGORY_STATE_NAME && fromState.name === CATEGORY_STATE_NAME){
                    var fromCategory = fromLocals[CATEGORY_RESOLVE_STATE].category,
                        toCategory = toLocals[CATEGORY_RESOLVE_STATE].category;

                    //the only way to figure out if we move beween levels when moving between categories
                    //is to take a look at the parent of the categories.
                    lastStateChangeWasLevelChange = toCategory.parent !== fromCategory.parent;
                }
                else {
                    lastStateChangeWasLevelChange = toState.name !== fromState.name;
                }
            });

            var getConfig = function(key){
                if (!indexMap[key]){
                    indexMap[key] = {
                        index: 0,
                        direction: 'btt'
                    };
                }

                return indexMap[key];
            };

            $self.setCurrentIndex = function(key, index){

                var config = getConfig(key);

                if (index > config.index){
                    config.direction = 'btt';
                }
                else{
                    config.direction = 'ttb';
                }
                config.index = index;
            };

            $self.getSlideAnimationConfig = function(key){

                var config = getConfig(key);

                if (lastStateChangeWasLevelChange){
                    return {
                        enter: 'fade-in'
                    }
                };

                return {
                    enter: 'slide-in-' + config.direction,
                    //leave: 'slide-out-' + direction
                };
            };

            return $self;
        }
    ]);
