angular.module('sdk.directives.ccThumbnailBar', []);

angular.module('sdk.directives.ccThumbnailBar')
    .directive('ccThumbnailBar', function() {

        'use strict';

        return {
            restrict: 'EA',
            replace: true,
            scope: {
                images: '=',
                onChange: '&'
            },
            controller: ['$scope', function($scope){
                $scope.setSelectedImageIndex = function(index){

                    $scope.selectedImageIndex = index;

                    var image = {
                        index: index,
                        url: $scope.images[index].url
                    };

                    $scope.onChange({ image: image });
                };

                if($scope.images.length > 0 && !$scope.selectedImageIndex){
                    $scope.selectedImageIndex = 0;
                }

                $scope.setSelectedImageIndex($scope.selectedImageIndex);
            }],
            templateUrl: '../sdk/src/directives/ccThumbnailBar/ccthumbnailbar.tpl.html'
        };
    });
