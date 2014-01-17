angular.module('sdk.services.requestAnimationFrame', []);

angular
    .module('sdk.services.requestAnimationFrame')
    .factory('requestAnimationFrame', ['$window', '$rootScope', function($window, $rootScope){
        return function(callback, invokeApply){

            //only if it's explicitly false it should not invoke apply.
            //If it's called without the parameter it should be true by default.
            invokeApply = invokeApply === false ? false : true;

            $window.requestAnimationFrame(function(){
                callback();

                if(invokeApply){
                    $rootScope.$apply();
                }
            });
        };
}]);