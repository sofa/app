angular
    .module('CouchCommerceApp')
    .controller('NewMessageBoxController', ['$scope', '$modalInstance', 'model', function($scope, $modalInstance, model){
        $scope.title = model.title;
        $scope.message = model.message;
        $scope.buttons = model.buttons;
        $scope.close = function(res){
            $modalInstance.close(res);
        };
    }]);

angular
    .module('CouchCommerceApp')
    .factory('dialog', ['$modal', function($modal){

        var self = {};

        self.messageBox = function(title, message, buttons, modalOptions){
            var options = {
                templateUrl: 'modules/common/dialog/dialog.tpl.html', 
                controller: 'NewMessageBoxController', 
                resolve:{
                    model: function() {
                        return {
                            title: title,
                            message: message,
                            buttons: buttons
                        };
                    }
                }
            };

            if (modalOptions)
                angular.extend(options, modalOptions);

            return $modal.open(options);
        };


        var loadingModal;
        self.loading = function(title, message, buttons, modalOptions){
            var options = {
                templateUrl: 'modules/common/dialog/loadingdialog.tpl.html', 
                controller: 'NewMessageBoxController',
                dialogClass: '',
                keyboard: false,
                backdropClick: false,
                resolve:{
                    model: function() {
                        return {
                        };
                    }
                }
            };

            if (modalOptions)
                angular.extend(options, modalOptions);

            loadingModal = $modal.open(options);

            return loadingModal;
        };

        self.closeLoading = function(){
            if(loadingModal){
                loadingModal.close();
            }
        };

        //we just mirror the API here so that we don't have to inject
        //multiple services in controllers which need access to both
        //the sugar methods and the raw thing. We could also monkey patch
        //the $modal service but it feels cleaner to build the sugar in another
        //service.
        self.open = $modal.open;


        return self;

    }]);