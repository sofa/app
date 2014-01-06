/**
 * @name TrackingService
 * @namespace cc.TrackingService
 *
 * @description
 * Abstraction layer to communicate with concrete tracker services
 * like Google Analytics.
 */
cc.define('cc.TrackingService', function($window, $http){
    'use strict';

    var self = {};
    var trackers = [];

    /**
     * @method addTracker
     * @memberof cc.TrackingService
     *
     * @description
     * Adds a concrete tracker service implementation and also takes care
     * of the setup. It'll throw exceptions if the tracker service
     * doesn't implement the needed API.
     *
     * @param {object} tracker Concrete tracker implementation.
     */
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

    /**
     * @method trackEvent
     * @memberof cc.TrackingService
     *
     * @description
     * Forces all registered trackers to track an event.
     *
     * @param {object} eventData Event data object.
     */
    self.trackEvent = function(eventData) {
        trackers.forEach(function(tracker){
            tracker.trackEvent(eventData, $http);
        });
    };

    return self;
});
