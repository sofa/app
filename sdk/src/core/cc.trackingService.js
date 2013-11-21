cc.define('cc.TrackingService', function($window, $http){
    'use strict';

    var self = {};
    var trackers = [];

    self.addTracker = function(tracker) {

        if (!tracker.setup){
            throw new Error('tracker must implement a setup method');
        }

        if (!tracker.trackEvent){
            throw new Error('tracker must implement a trackEvent method');
        }

        tracker.setup();

        trackers.push(tracker);
    };

    self.trackEvent = function(eventData) {
        trackers.forEach(function(tracker){
            tracker.trackEvent(eventData, $http);
        });
    };

    return self;
});