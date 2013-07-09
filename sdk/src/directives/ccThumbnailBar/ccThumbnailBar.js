angular.module('sdk.directives.ccThumbnailBar', ['src/directives/ccThumbnailBar/ccthumbnailbar.tpl.html']);

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

                $scope.$watch('images', function(newValue, oldValue) {
                    // reset the image index when images ref changes
                    if (angular.isArray(newValue)) {
                        $scope.setSelectedImageIndex(0);
                    }
                });
            }],
            templateUrl: 'src/directives/ccThumbnailBar/ccthumbnailbar.tpl.html'
        };
    });
