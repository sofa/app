angular
    .module('CouchCommerceApp')
    .run(['$dialog', function($dialog){
        $dialog.messageBox = function(title, message, buttons){
            return $dialog.dialog({
                templateUrl: 'modules/common/dialog/monkeypatch.tpl.html',
                controller: 'MessageBoxController',
                resolve: {
                    model: function() {
                        return {
                          title: title,
                          message: message,
                          buttons: buttons
                        };
                    }
                }
            });
        };

        $dialog.closeLoading = function(result){
            if($dialog.loadingModal){
                $dialog.loadingModal.close(result);
            }
        };

        $dialog.loading = function(){
            var loadingModal = $dialog.loadingModal = $dialog.dialog({
                templateUrl: 'modules/common/dialog/loadingdialog.tpl.html',
                controller: 'MessageBoxController',
                //we need to set the modal class on a lower level
                dialogClass: '',
                keyboard: false,
                backdropClick: false,
                resolve: {
                    model: function() {
                        return {};
                    }
                }
            });

            return loadingModal;
        };


    }]);