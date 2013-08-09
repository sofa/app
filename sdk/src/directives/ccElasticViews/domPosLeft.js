angular
    .module('sdk.directives.ccElasticViews.domPos.left', []);

angular
    .module('sdk.directives.ccElasticViews.domPos.left')
    .factory('domPos', function(){

        var self = {};

        self.getLeft = function(element){
            //we can't use getBoundingClientRect() here since this returns the left
            //distance relative to the screen, not to the parent. That in turn means,
            //that it won't work if the directive is used somewhere centered on the screen.
            return (element.offsetLeft || 0);
        };

        self.setLeft = function(element, px){
            element.style.left = px + 'px';
        };

        return self;
    });

angular
    .module('sdk.directives.ccElasticViews.domPos.transform', []);

angular
    .module('sdk.directives.ccElasticViews.domPos.transform')
    .factory('domPos', function(){

        var self = {},
            TRANSLATE3D_REGEX = /translate3d\((-?\d+(?:px)?),\s*(-?\d+(?:px)?),\s*(-?\d+(?:px)?)\)/;

        self.getLeft = function(element){
            var elementStyle    = element.style,
                matrix          = elementStyle.transform          ||
                                  elementStyle.webkitTransform    ||
                                  elementStyle.mozTransform       ||
                                  elementStyle.msTransform        ||
                                  elementStyle.oTransform,

                results         = matrix.match(TRANSLATE3D_REGEX);

            return !results ? 0 : parseFloat(results[1]);
        };

        self.setLeft = function(element, px){
            var transform = 'translate3d(' + px + 'px,0,0)';
            element.style.transform = transform;
            element.style.oTransform = transform;
            element.style.msTransform = transform;
            element.style.mozTransform = transform;
            element.style.webkitTransform = transform;
        };

        return self;
    });