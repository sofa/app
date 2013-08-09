var app = angular.module('app', ['sdk.directives']);

app.controller('MainCtrl', ['elasticModel', 'elasticViewConfig', '$scope', function(elasticModel, elasticViewConfig, $scope) {
    $scope.elasticViews = [];

    layerCount = 0;

    $scope.addLayer = function(){
        layerCount++;
        var name = layerCount;

        var viewCount = $scope.elasticViews.length,
            previousView;

        if (viewCount > 0){
            previousView = $scope.elasticViews[viewCount - 1];
        }

        var model = elasticModel({
            name: '' + name,
            cls: 'shape-' + name,
            tpl: 'shape.tpl.html',
            dragInfo: {
                snapPoint: layerCount === 1 ? 0 : null,
                posX: !previousView ? 0 : previousView.dragInfo.posX + previousView.dragInfo.width - elasticViewConfig.SNAP_OFFSET_PX,
                snapPoints: [
                {
                    snapArea: {
                        from: 0,
                        to: 100
                    },
                    bound: 'left',
                    snapTo: elasticViewConfig.SNAP_OFFSET_PX
                },
                {
                    snapArea: '*',
                    bound: 'right',
                    snapTo: elasticViewConfig.SNAP_OFFSET_PX
                }
                // {
                //     snapArea: {
                //         from: 0,
                //         to: 100
                //     },
                //     bound: 'right',
                //     snapTo: 5
                // }
                ]
            }
        });

        $scope.elasticViews.push(model);
    };

    $scope.addLayer();
}]);
