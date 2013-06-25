cc.define('cc.DeviceService', function(){
    var self = {};

    var ua = navigator.userAgent,
        uaindex;

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

    return self;
});