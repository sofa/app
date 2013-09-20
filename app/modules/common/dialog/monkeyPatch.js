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
    }]);