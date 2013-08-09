angular
    .module('sdk.directives.ccElasticViews')
    .factory('elasticViewControllerFactory', ['elasticViewConfig', 'dragInfoService', 'domPos', function(elasticViewConfig, dragInfoService, domPos){

        var ElasticViewController = function($element, viewCollection){

            var SNAP_OFFSET_PX = elasticViewConfig.SNAP_OFFSET_PX,
                snapBackInProgress = false,
                //Each view snaps according to the snapPoints of it's bottom sibling.
                //However, the root view does not have a bottom sibling. If we want it to snap,
                //then the snap would happen accordingly to the snapPoints of the viewPort.
                //Hence we fake a dragInfo for the viewPort.
                viewPortDragInfo = dragInfoService.createViewPortDragInfo();

            var dragPanel = function(event){
                var target = event.target;
                var $target = angular.element(target);
                if (!$target.hasClass(elasticViewConfig.VIEW_CLS)){
                    return;
                }
                snapBackInProgress = false;
                dragWithSiblings(event);
            };

            var stopDrag = function(){

                var snapBack = null;
                var snapBackQueue = [];

                viewCollection.views.forEach(function(view, index, collection){
                    view.dragInfo.lastX = view.dragInfo.posX;
                    view.dragInfo.lastY = view.dragInfo.posY;

                    //we don't want to cause snapBacks to cause further snapBack checks                        
                    if (!snapBackInProgress){
                        if (index > 0 || elasticViewConfig.SNAP_ROOT_VIEW_TO_VIEWPORT){
                            var bottomViewDragInfo = index > 0 ? collection[index -1].dragInfo : viewPortDragInfo;
                                snapInfo = dragInfoService.shouldASnapToB(view.dragInfo, bottomViewDragInfo);

                            if(snapInfo.snap){
                                snapBackQueue.push({
                                    view: view,
                                    snapDelta: snapInfo.snapPoint.snapDelta
                                });
                            }
                        }
                    }
                });

                /* There are two approaches (that I know of) for cascading snapbacks:
                 *
                 * 1. always just perform one snap back and let a snap back trigger other snap backs
                 * until the system stabilizes and no further snap backs are triggered
                 *
                 * 2. Hold snapbacks in a queue and perform all of them sequentially directly from this
                 * method call. This means that snapbacks are not allowed to trigger further snapbacks.
                 * Otherwise we would have snapback-ception
                 *
                 * We are currently going for the second approach since the first one lead to invinite loops
                 * that I couldn't manage to track down yet.
                 */

                if (!snapBackInProgress){
                    snapBackInProgress = true;

                    for (var i = snapBackQueue.length - 1; i >= 0; i--) {
                        var snap = snapBackQueue[i];
                        performManualDrag(snap.view.name, snap.snapDelta);
                    }

                }
            };

            var shouldPullBottomSibling = function(bottomSibling, element){
                //ATTENTION: We use getBoundingClientRect() here for performance.
                //Be aware that this returns the left coord relative to the screen (!) not to the
                //parent. This only works here because all we are interested in is the difference between
                //the elements. But we can't use this value to manipulate the position
                var xLeftElement = element.getBoundingClientRect().left;
                var xRightBottomSibling = getXofRightBoundary(bottomSibling);

                var diff = xLeftElement - xRightBottomSibling;

                return diff > (SNAP_OFFSET_PX * -1);
            };

            var shouldPushBottomSibling = function(bottomSibling, element){
                var xLeftElement = element.getBoundingClientRect().left;
                var xLeftBottomSibling = bottomSibling.getBoundingClientRect().left;

                var diff = xLeftElement - xLeftBottomSibling;

                return diff < SNAP_OFFSET_PX;
            };

            var setLastXIfEmpty = function(view, element){
                if (view.dragInfo.lastX === null){
                    view.dragInfo.lastX = domPos.getLeft(element);
                }
            };

            var getXofRightBoundary = function(element){
                return element.getBoundingClientRect().left + element.offsetWidth;
            };

            var dragWithSiblings = function(event){

                if (event.gesture.interimDirection !== 'left' && event.gesture.interimDirection !== 'right'){
                    return;
                }

                var currentView = viewCollection.getViewFromStack(event.target.id);
                var dragInfo = currentView.dragInfo;

                setLastXIfEmpty(currentView, event.target);

                dragInfo.posX = event.gesture.deltaX + dragInfo.lastX;
                domPos.setLeft(event.target, dragInfo.posX);

                //move all bottom siblings
                moveSiblings(event.gesture.deltaX, currentView, event.target, dragInfo, event.gesture.interimDirection, viewCollection.getBottomSibling, moveBottomSibling);
                //move all top siblings
                moveSiblings(event.gesture.deltaX, currentView, event.target, dragInfo, event.gesture.interimDirection, viewCollection.getTopSibling, moveTopSibling);
            };

            var performManualDrag = function(name, deltaX){
                var view = viewCollection.getViewFromStack(name),
                    direction = deltaX > 0 ? 'right' : 'left';

                dragWithSiblings({
                    gesture: {
                        interimDirection: direction,
                        deltaX: deltaX
                    },
                    target: view.dragInfo.domNode
                });
                stopDrag();
            };

            var moveSiblings = function(deltaX, startView, startElement, startElementDragInfo, direction, siblingLocatorFn, siblingMoverFn){
                var currentBottomSibling = siblingLocatorFn(startView);
                var currentElement = startElement;
                var bottomSiblingEl;
                while(currentBottomSibling){

                    if (currentBottomSibling){
                        bottomSiblingEl = currentBottomSibling.dragInfo.domNode;
                        startElementDragInfo = siblingMoverFn(deltaX, currentBottomSibling, bottomSiblingEl, currentElement, startElementDragInfo, direction);
                    }

                    currentBottomSibling = siblingLocatorFn(currentBottomSibling);
                    currentElement = bottomSiblingEl;
                }
            };

            /**
             * Moves the bottomSibling according to the movement of the topSibling if the bottomSibling
             * hit's the specific "glue points" of it's topSibling
             *
             * Options:
             * 
             *   - `deltaX` the total delta of the current drag (can probably be removed later)
             *   - `bottomSibling` the bottomSibling of the item being moved
             *   - `bottomSiblingEl` the DOM element of the bottomSibling
             *   - `topSibling` the element sitting on top of the bottomSibling
             *   - `topSiblingDragInfo` the drag info of the topSibling
             *   - `direction` the direction of the current drag
             */
            var moveBottomSibling = function(deltaX, bottomSibling, bottomSiblingEl, topSibling, topSiblingDragInfo, direction){
                //transform = "translate3d("+bottomSibling.posX+"px,0px, 0) ";
                var dragInfo = bottomSibling.dragInfo;

                //I'm not sure if this is needed anymore. Investigate!
                setLastXIfEmpty(bottomSibling, bottomSiblingEl);

                if (direction === 'right'){
                    if (shouldPullBottomSibling(bottomSiblingEl, topSibling)){
                        //we need to remember the value of the deltaX at the moment when the sibling is starting to get pulled.
                        //So that we can move the sibling by the actual distance since being pulled and not by the distance that the actor
                        //has already moved on the screen. In plain english: The sibling moves: allDistance - distanceWhenPullingOfSibling began
                        dragInfo.setMovement('pull', deltaX);
                    }
                    else{
                        return dragInfo;
                    }
                }
                else if (direction === 'left'){
                    if (shouldPushBottomSibling(bottomSiblingEl, topSibling)){
                        dragInfo.setMovement('push', deltaX);
                    }
                    else {
                        return dragInfo;
                    }
                }

                monitor.innerHTML = dragInfo.posXOnMovementChange + "-" + dragInfo.abandonedDelta;

                if (direction === 'right' && dragInfo.movement === 'pull'){
                    dragInfo.posX = topSiblingDragInfo.posX - dragInfo.width + SNAP_OFFSET_PX;
                }
                else if (direction === 'left' && dragInfo.movement === 'push'){
                    dragInfo.posX = topSiblingDragInfo.posX - SNAP_OFFSET_PX;
                }

                domPos.setLeft(bottomSiblingEl, dragInfo.posX);

                return dragInfo;
            };

            var moveTopSibling = function(deltaX, topSibling, topSiblingEl, bottomSibling, bottomSiblingDragInfo, direction){
                var dragInfo = topSibling.dragInfo;
                setLastXIfEmpty(topSibling, topSiblingEl);
                dragInfo.posX = deltaX + dragInfo.lastX;

                domPos.setLeft(topSiblingEl, dragInfo.posX);

                return dragInfo;
            };

            var element = $element[0];

            Hammer(element).on('drag', dragPanel);
            Hammer(element).on('dragend', stopDrag);

            return {
                drag: performManualDrag
            };
        };


        var self = {},
            instances = {};

        self.create = function(id, $element, viewCollection){
            instances[id] = instance = new ElasticViewController($element, viewCollection);
            return instance;
        };

        self.get = function(id){
            return instances[id];
        };

        self.remove = function(id) {
            delete instances[id];
        };

        return self;
    }]);