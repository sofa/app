cc.Util = {
    //http://docs.sencha.com/touch/2.2.0/source/Number2.html#Ext-Number-method-toFixed
    isToFixedBroken: (0.9).toFixed() !== '1',
    round: function(value, places){
        var multiplier = Math.pow(10, places);
        return (Math.round(value * multiplier) / multiplier);
    },
    toFixed: function(value, precision){
        if (cc.Util.isToFixedBroken) {
            precision = precision || 0;
            var pow = Math.pow(10, precision);
            return (Math.round(value * pow) / pow).toFixed(precision);
        }

        return value.toFixed(precision);
    },
    deepExtend: function () {
        var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options;

        if (target.constructor == Boolean) {
            deep = target;
            target = arguments[1] || {};
            i = 2;
        }

        if (typeof target != "object" && typeof target != "function")
            target = {};

        if (length == 1) {
            target = this;
            i = 0;
        }

        for (; i < length; i++)
            if ((options = arguments[i]) != null)
                for (var name in options) {
                    if (target === options[name])
                        continue;

                    if (deep && options[name] && typeof options[name] == "object" && target[name] && !options[name].nodeType)
                        target[name] = this.deepExtend(true, target[name], options[name]);

                    else if (options[name] != undefined)
                        target[name] = options[name];
                }

        return target;
    },
    Array: {
        remove: function(arr, item){
            var index = arr.indexOf(item);
            arr.splice(index, 1);
            return arr;
        }
    }
}