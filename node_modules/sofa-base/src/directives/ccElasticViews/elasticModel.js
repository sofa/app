angular
    .module('sdk.directives.ccElasticViews')
    .factory('elasticModel', function(){

        var DragInfo = function(){

            var self = {};

            self.posX = 0;
            self.posY = 0;
            self.lastX = null;
            self.lastY = 0;
            self.abandoned = '';
            self.abandonedDelta = 0;
            self.movement = 'none';
            self.posXOnMovementChange = 0;
            self.domNode = null;

            self.setMovement = function(type, posX){
                if (self.movement !== type){
                    //we don't rely on that information anymore. Let's keep it until
                    //we gain more confidence for our approach
                    self.posXOnMovementChange = posX;
                }

                if(type === 'none'){
                    self.posXOnMovementChange = 0;
                }

                self.movement = type;
            };

            return self;
        };

        return function(obj){
            obj  = obj || {};
            obj.dragInfo = obj.dragInfo ? angular.extend(new DragInfo(), obj.dragInfo) : new DragInfo();
            return obj;
        };
    });