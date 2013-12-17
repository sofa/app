angular.module('sdk.decorators.$rootScope', []);

    angular
        .module('sdk.decorators.$rootScope')
        .config(['$provide', function($provide){
            $provide.decorator('$rootScope', ['$delegate', function($delegate){


                // we monkey patch the $rootScope to provide a $onRootScope method that
                // just works like the $on method but subscribes to events directly emitted
                // on the $rootScope.
                // While one can directly bind to events emitted on the $rootScope even without
                // such a `$onRootScope` method, this method makes sure that events are automatically
                // unbound when the local scope gets destroyed.
                // This comes in handy when the $rootScope is treated as EventBus
                // and is used for all inter app communication.
                
                // Read this for more info:
                // http://stackoverflow.com/questions/11252780/whats-the-correct-way-to-communicate-between-controllers-in-angularjs/19498009#19498009

                Object.defineProperty($delegate.constructor.prototype, '$onRootScope', {
                    value: function(name, listener){
                        var unsubscribe = $delegate.$on(name, listener);
                        this.$on('$destroy', unsubscribe);
                    },
                    enumerable: false
                });


                return $delegate;
            }]);
        }]);


