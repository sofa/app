/** * @name DeviceService
 * @namespace cc.DeviceService
 *
 * @description
 * This is a helper service that gives you methods to check for certain contexts
 * on touch devices etc.. It determines the state for the usage of flexbox as well
 * as things like position fixed support.
 */
cc.define('cc.DeviceService', function($window){
    var self = {};

    var ua = navigator.userAgent,
        htmlTag,
        uaindex,
        userOS,
        userOSver;

    var MODERN_FLEXBOX_SUPPORT = 'cc-supports-modern-flexbox';

    // determine OS
    if ( ua.match(/iPad/i) || ua.match(/iPhone/i) ){
        userOS = 'iOS';
        uaindex = ua.indexOf( 'OS ' );
    }
    else if ( ua.match(/Android/i) ){
        userOS = 'Android';
        uaindex = ua.indexOf( 'Android ' );
    }
    else{
        userOS = 'unknown';
    }

    // determine version
    if ( userOS === 'iOS'  &&  uaindex > -1 ){
        userOSver = ua.substr( uaindex + 3, 3 ).replace( '_', '.' );
    }
    else if ( userOS === 'Android'  &&  uaindex > -1 ){
        userOSver = ua.substr( uaindex + 8, 3 );
    }
    else {
        userOSver = 'unknown';
    }

    var dimensions = {};

    var updateDimension = function(){
        dimensions.width = $window.innerWidth;
        dimensions.height = $window.innerHeight;
    };

    updateDimension();

    $window.addEventListener("orientationchange", updateDimension, false);

    var versionStartsWith = function(str){
        var version = self.getOsVersion();
        return version.indexOf(str) === 0;
    };

    /**
     * @method isInPortraitMode
     * @memberof cc.DeviceService
     *
     * @description
     * Returns a bool indicating whether the decice is held in portrait mode.
     *
     * @return {object} HTMLDomObject
     */
    self.isInPortraitMode = function(){
        return dimensions.height > dimensions.width;
    };

    /**
     * @method isLandscapeMode
     * @memberof cc.DeviceService
     *
     * @description
     * Returns a bool indicating whether the decice is held in landscape mode.
     *
     * @return {object} HTMLDomObject
     */
    self.isInLandscapeMode = function(){
        return !self.isInPortraitMode();
    };

    /**
     * @method getHtmlTag
     * @memberof cc.DeviceService
     *
     * @description
     * Returns an HTMLDomObject for HTML.
     *
     * @return {object} HTMLDomObject
     */
    self.getHtmlTag = function(){
        htmlTag = htmlTag || document.getElementsByTagName('html')[0];
        return htmlTag;
    };

    /**
     * @method isTabletSiye
     * @memberof cc.DeviceService
     *
     * @description
     * Returns true if the current device is in "TabletSize". See SO link for more
     * information (http://stackoverflow.com/questions/6370690/media-queries-how-to-target-desktop-tablet-and-mobile).
     *
     * @return {boolean} Whether the device is in tablet size or not.
     */
    self.isTabletSize = function(){
        return $window.screen.width > 641;
    };

    /**
     * @method isStockAndroidBrowser
     * @memberof cc.DeviceService
     *
     * @description
     * Checks if browser is stock android browser or not.
     *
     * @return {boolean}
     */
    self.isStockAndroidBrowser = function(){
        return userOS === 'Android' && ua.indexOf("Chrome") < 0;
    };

    /**
     * @method flagOs
     * @memberof cc.DeviceService
     *
     * @description
     * Flags the current document with an SDK specific class depending on the OS
     * of the device.
     */
    self.flagOs = function(){
        var htmlTag = self.getHtmlTag();
        var version = self.getOsVersion();
        var majorVersion = version.length > 0 ? version[0] : '0';
        htmlTag.className += ' cc-os-' + self.getOs().toLowerCase() + ' cc-osv-' + majorVersion;
    };

    /**
     * @method flagPositionFixedSupport
     * @memberof cc.DeviceService
     *
     * @description
     * Flags the current document with an SDK specific class depending on given
     * position fixed support.
     */
    self.flagPositionFixedSupport = function(){
        var htmlTag = self.getHtmlTag();
        htmlTag.className += self.hasPositionFixedSupport() ? ' cc-supports-position-fixed' : ' cc-no-position-fixed';
    };

     /**
      * @method getUserAgent
      * @memberof cc.DeviceService
      *
      * @description
      *
      * @example
      *
      * @return {string} User agent currently in use
      */
    self.getUserAgent = function(){
        return ua;
    };
    
    /**
     * @method getOs
     * @memberof cc.DeviceService
     *
     * @description
     * Returns OS string.
     *
     * @return {string} Name of OS.
     */
    self.getOs = function(){
        return userOS;
    };

    /**
     * @method getOsVersion
     * @memberof cc.DeviceService
     *
     * @description
     * Returns OS version string.
     *
     * @return {string} Version of OS.
     */
    self.getOsVersion = function(){
        return userOSver;
    };

    /**
     * @method isAndroid2x
     * @memberof cc.DeviceService
     *
     * @description
     * Returns true if device os is Android and version starts with '2'.
     *
     * @return {bool}
     */
    self.isAndroid2x = function () {
      return self.getOs() === 'Android' && versionStartsWith('2');
    };

    /**
     * @method hasPositionFixedSupport
     * @memberof cc.DeviceService
     *
     * @description
     * Checks if the current device kinda supports position fixed.
     * We know, brother sniffing is bad, but for fixed toolbars, 
     * there is no easy solution. 
     *
     * @return {boolean}
     */
     self.hasPositionFixedSupport = function(){
        if (self.getOs() === 'Android'){
            //versions < 2.3 of Android have poor fixed support
            if (versionStartsWith('2')){
                if (versionStartsWith('2.2') || versionStartsWith('2.1') || versionStartsWith('2.0')){
                    return false;
                }
                else{
                    return true;
                }
            }
            //make all other versions except 1.x return true
            return !versionStartsWith(1);
        }
        else if (self.getOs() === 'iOS'){
            return  !versionStartsWith('1') &&
                    !versionStartsWith('2') &&
                    !versionStartsWith('3') &&
                    !versionStartsWith('4');
        }
    };

    /**
     * @method hasModernFlexboxSupport
     * @memberof cc.DeviceService
     *
     * @description
     * Checks if the browser has modern flexbox support or not.
     *
     * @return {boolean}
     */
    self.hasModernFlexboxSupport = function(){

        // Firefox currently has a flexbox bug
        // See http://stackoverflow.com/a/17435156/956278
        if ( ua.match(/Firefox/i) ) {
            return false;
        }

        var supportedValues =   [
                                    '-webkit-flex',
                                    '-moz-flex',
                                    '-o-flex',
                                    '-ms-flex',
                                    'flex'
                                ];

        var testSpan = document.createElement('span');
        supportedValues.forEach(function(value){
            testSpan.style.display = value;
        });

        return supportedValues.indexOf(testSpan.style.display) > -1;
    };

    /**
     * @method flagModernFlexboxSupport
     * @memberof cc.DeviceService
     *
     * @description
     * Flags the document with an SDK specific class for modern flexbox support.
     */
    self.flagModernFlexboxSupport = function(){
        var htmlTag = self.getHtmlTag();
        if (self.hasModernFlexboxSupport()){
            htmlTag.className += ' ' + MODERN_FLEXBOX_SUPPORT;
        }
    };

    return self;
});
