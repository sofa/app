angular
    .module('sdk.directives.ccElasticViews')
    .factory('viewCollectionFactory', function(){

        var ViewCollectionFactory = function(views){

                //reconsider, that's because we need to iterate them from outside
                //we probably just want to expose an each function?
                this.views = views;

                this.getViewFromStack = function(id){
                    var result = views.filter(function(view){
                        return view.name === id;
                    });

                    return result.length > 0 ? result[0] : null;
                };

                this.getTopSibling = function(view){
                    var index = views.indexOf(view);
                    var reachedEnd = index === views.length -1;
                    return index === -1 || reachedEnd ? null : views[index + 1];
                };

                this.getBottomSibling = function(view){
                    var index = views.indexOf(view);
                    return index === -1 || index === 0 ? null : views[index - 1];
                };

        };

        return function(views){
            return new ViewCollectionFactory(views);
        };
    });

