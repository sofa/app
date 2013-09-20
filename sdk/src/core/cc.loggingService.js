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