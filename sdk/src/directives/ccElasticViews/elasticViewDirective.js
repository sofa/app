angular
    .module('sdk.directives.ccElasticViews')
    .directive('ccElasticViewsNotifier', function(){

        return {
            restrict: 'A',
            require: '?^ccElasticViews',
            link: function($scope, $element, attrs, controller) {
                if(!controller){
                    return;
                }
                controller.onViewCreated($scope.$index, $element[0]);
            }
        };
    });

angular
    .module('sdk.directives.ccElasticViews')
    .directive('ccElasticViews', ['elasticViewConfig', 'dragInfoService', 'domPos', 'viewCollectionFactory', 'elasticViewControllerFactory', function(elasticViewConfig, dragInfoService, domPos, viewCollectionFactory, elasticViewControllerFactory){

        return {
            restrict: 'E',
            templateUrl: 'src/directives/ccElasticViews/elasticViews.tpl.html',
            replace: true,
            scope: {
                views: '='
            },
            controller: ['$scope', 'domPos', function($scope, domPos){
                this.onViewCreated = function(index, domNode){
                    //reconsider if we want to use the viewCollection here?
                    $scope.views[index].dragInfo.domNode = domNode;
                    $scope.views[index].dragInfo.width = domNode.offsetWidth;
                    domPos.setLeft(domNode, $scope.views[index].dragInfo.posX);
                };
            }],
            link: function($scope, $element, attrs){

                if (!attrs.id){
                    throw new Error("An id is mandatory for the elastic-views directive. Read about the reasoning behind in the documentation.");
                }

                $scope.$on("$destroy",function(){
                    //we need to be aware here that we only remove the controller from the factory.
                    //However, we can't control if instances still exist elsewhere (hint, on a regular controller!)
                    //We need to look into how to best leverage the event system to get notified elsewhere to perform cleanups
                    elasticViewControllerFactory.remove(attrs.id);
                });

                var viewCollection = viewCollectionFactory($scope.views);
                //we delegate all work to an elasticViewController retrieved by a factory
                //this way we can also get a handle on such a controller from within a regular controller
                //this is an essential point as it might be important to perform drags programatically.
                //This is exactly the reason why we need to have an id for the elastic-views directive.
                //Otherwise it wouldn't be possible to get a handle on the controller later
                var controller = elasticViewControllerFactory.create(attrs.id, $element, viewCollection);
            }
        };
    }]);