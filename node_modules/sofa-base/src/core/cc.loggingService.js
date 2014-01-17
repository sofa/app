/**
 * @name LoggingService
 * @namespace cc.LoggingService
 *
 * @description
 * This service abstracts the concrete console interface away. It provides the same
 * methods for logging like `.log()`, `.info()` etc..
 *
 * Use this service to log within your application.
 */
cc.define('cc.LoggingService', function(configService){
    var self = {};

    var enabled = configService.get('loggingEnabled', false);

    var doIfEnabled = function(fn){
        if (!enabled){
            return;
        }

        fn();
    };

    var dump = function(data){
        var output = '\n'; //allways start with a new line for better alignment

        data.forEach(function(line){
            //for a cleaner output we convert objects to beautified JSON
            output += cc.Util.isString(line) ? line : JSON.stringify(line, null, 4);
            output += '\n';
        });

        return output;
    };

    /**
     * @method info
     * @memberof cc.LogingService
     * @public
     *
     * @description
     * A `console.info()` wrapper to log some info in the console.
     *
     * @param {(array|string)} str String or array to log.
     */
    self.info = function(str){
        doIfEnabled(function(){
            if (cc.Util.isArray(str)){
                console.info(dump(str));
            }
            else{
                console.info(str);
            }
        });
    };

    /**
     * @method log
     * @memberof cc.LoggingService
     * @public
     *
     * @description
     * A `console.log()` wrapper to log to console.
     *
     * @param {(string|array)} str String or array to log.
     */
    self.log = function(str){
        doIfEnabled(function(){
            if (cc.Util.isArray(str)){
                console.log(dump(str));
            }
            else{
                console.log(str);
            }
        });
    };

    /**
     * @method warn
     * @memberof cc.LoggingService
     * @public
     *
     * @description
     * A `console.warn()` wrapper to log warnings to console.
     *
     * @param {(string|array)} str String or array to log.
     */
    self.warn = function(str){
        doIfEnabled(function(){
            if (cc.Util.isArray(str)){
                console.warn(dump(str));
            }
            else{
                console.warn(str);
            }
        });
    };

    /**
     * @method error
     * @memberof cc.LoggingService
     * @public
     *
     * @description
     * A `console.error()` wrapper to log errors to console.
     *
     * @param {(string|array)} str String or array to log.
     */
    self.error = function(str){
        doIfEnabled(function(){
            if (cc.Util.isArray(str)){
                console.error(dump(str));
            }
            else{
                console.error(str);
            }
        });
    };

    return self;
});
