cc.define('cc.DeviceService', function($window){
    var self = {};

    var ua = navigator.userAgent,
        htmlTag,
        uaindex;

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

    self.getHtmlTag = function(){
        htmlTag = htmlTag || document.getElementsByTagName('html')[0];
        return htmlTag;
    };

    self.isTabletSize = function(){
        //http://stackoverflow.com/questions/6370690/media-queries-how-to-target-desktop-tablet-and-mobile
        return $window.screen.width > 641;
    };

    self.flagOs = function(){
        var htmlTag = self.getHtmlTag();
        var version = self.getOsVersion();
        var majorVersion = version.length > 0 ? version[0] : '0';
        htmlTag.className += ' cc-os-' + self.getOs().toLowerCase() + ' cc-osv-' + majorVersion;
    };

    self.flagPositionFixedSupport = function(){
        var htmlTag = self.getHtmlTag();
        htmlTag.className += self.hasPositionFixedSupport() ? ' cc-supports-position-fixed' : ' cc-no-position-fixed';
    };

    self.getOs = function(){
        return userOS;
    };

    self.getOsVersion = function(){
        return userOSver;
    };

    self.hasPositionFixedSupport = function(){
        //We know, brother sniffing is bad, but for fixed toolbars, there
        //is no easy solution.
        //http://bradfrostweb.com/blog/mobile/fixed-position/

        var version = self.getOsVersion();

        var versionStartsWith = function(str){
            return version.indexOf(str) === 0;
        };

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

    self.hasModernFlexboxSupport = function(){
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

    self.flagModernFlexboxSupport = function(){
        var htmlTag = self.getHtmlTag();
        if (self.hasModernFlexboxSupport()){
            htmlTag.className += ' ' + MODERN_FLEXBOX_SUPPORT;
        }
    };

    return self;
});