angular.module('sdk.decorators.$rootScope', []);

    angular
        .module('sdk.decorators.$rootScope')
        .config(['$provide', function($provide){
            $provide.decorator('$rootScope', ['$delegate', function($delegate){


                //we monkey patch the $rootScope to provide a $saveOn method that
                //just works like the $on method but takes an additional parameter
                //where a scope can be provided to listen for $destroy event in order
                //to than automatically unregister the listener.
                //That comes in handy when the $rootScope is treated as EventBus
                //and is used for all inter app communication.
                
                //Read this for more info:
                //http://stackoverflow.com/questions/11252780/whats-the-correct-way-to-communicate-between-controllers-in-angularjs/19498009#19498009
                $delegate.constructor.prototype.$onRootScope = function(name, listener){
                    var unsubscribe = $delegate.$on(name, listener);
                    this.$on('$destroy', unsubscribe);
                };

                return $delegate;
            }]);
        }]);


