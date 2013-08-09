angular
    .module('sdk.directives.ccElasticViews')
    .factory('dragInfoService', function(){
        //not sure if we really end up with this abstraction.
        //However, as an interim step it's better to put the code here
        //as putting everything into the directive

        var self = {};

        self.createViewPortDragInfo = function(){
            return  {
                        posX:       0,
                        snapPoints: [{
                                        snapArea: '*',
                                        bound: 'left',
                                        snapTo: 0
                                    }]
                    };
        };

        self.getXOfARelativeToB = function(aDragInfo, bDragInfo){
            return aDragInfo.posX - bDragInfo.posX;
        };

        //This method gives information about whether:
        //  - the xRelative is within the area specified by the snapPoint
        //  - the xRelative is exactly at the point where the snapPoint defines to snap to
        //  - the snap should be done

        //in an earlier version this method just reported a boolean back whether it should
        //snap or not. However, if we have an exact match, it should *NOT* snap, still
        //it's benefitial to consider the snapPoint as being fulfiled because otherwise
        //other (wildcard) snappoints will catch it.
        var shouldSnapToSnapPoint = function(aDragInfo, bDragInfo, snapPoint){

            var xRelative = self.getXOfARelativeToB(aDragInfo, bDragInfo),
                xRightRelative = bDragInfo.width - xRelative,
                info = {};

            //WARNING: Lot's of duplicated code ahead. CLEAN THE MESS UP!
            if (snapPoint.bound === 'left'){
                info.exactMatch = xRelative === snapPoint.snapTo;
                info.inSnapRange = snapPoint.snapArea === '*' || (xRelative >= snapPoint.snapArea.from) && (xRelative <= snapPoint.snapArea.to);
                info.shouldSnap = info.inSnapRange && !info.exactMatch;

                if (info.shouldSnap){
                    snapPoint.snapDelta = snapPoint.snapTo - xRelative;
                }
            }
            else if (snapPoint.bound === 'right'){
                info.exactMatch = xRightRelative === snapPoint.snapTo;
                info.inSnapRange = snapPoint.snapArea === '*' || (xRightRelative >= snapPoint.snapArea.from) && (xRightRelative <= snapPoint.snapArea.to);
                info.shouldSnap = info.inSnapRange && !info.exactMatch;

                if(info.shouldSnap){
                    snapPoint.snapDelta = xRightRelative - snapPoint.snapTo;
                }
            }

            return info;
        };

        self.shouldASnapToB = function(aDragInfo, bDragInfo){
            var snapInfo =  {
                                snap: false,
                                snapPoint: null
                            };

            if (!angular.isArray(bDragInfo.snapPoints)){
                return snapInfo;
            }

            var matchedSnapPoint;
            for (var i = 0; i < bDragInfo.snapPoints.length; i++) {
                var snapPoint = bDragInfo.snapPoints[i];

                var shouldSnap = shouldSnapToSnapPoint(aDragInfo, bDragInfo, snapPoint);

                if(shouldSnap.shouldSnap){
                    matchedSnapPoint = snapPoint;
                    break;
                }
                else if(shouldSnap.exactMatch){
                    //that's the point where we want to break the cascade but still nothing should be
                    //snaped since we are already at the *exact* position where the snap would end.
                    break;
                }
            }

            if (matchedSnapPoint){
                snapInfo.snap = true;
                snapInfo.snapPoint = matchedSnapPoint;
            }

            return snapInfo;
        };

        return self;
    });