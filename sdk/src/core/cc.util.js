cc.Util = {
    //http://docs.sencha.com/touch/2.2.0/source/Number2.html#Ext-Number-method-toFixed
    isToFixedBroken: (0.9).toFixed() !== '1',
    indicatorObject: {},
    //Used to determine if values are of the language type Object
    objectTypes: {
        'boolean': false,
        'function': true,
        'object': true,
        'number': false,
        'string': false,
        'undefined': false
    },
    round: function(value, places){
        var multiplier = Math.pow(10, places);
        return (Math.round(value * multiplier) / multiplier);
    },
    toFixed: function(value, precision){

        value = cc.Util.isString(value) ? parseFloat(value) : value;

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
    //this method is ripped out from lo-dash
    createCallback: function(func, thisArg, argCount) {
      if (func === null) {
        return identity;
      }
      var type = typeof func;
      if (type != 'function') {
        if (type != 'object') {
          return function(object) {
            return object[func];
          };
        }
        var props = keys(func);
        return function(object) {
          var length = props.length,
              result = false;
          while (length--) {
            if (!(result = isEqual(object[props[length]], func[props[length]], cc.Util.indicatorObject))) {
              break;
            }
          }
          return result;
        };
      }
      if (typeof thisArg == 'undefined') {
        return func;
      }
      if (argCount === 1) {
        return function(value) {
          return func.call(thisArg, value);
        };
      }
      if (argCount === 2) {
        return function(a, b) {
          return func.call(thisArg, a, b);
        };
      }
      if (argCount === 4) {
        return function(accumulator, value, index, collection) {
          return func.call(thisArg, accumulator, value, index, collection);
        };
      }
      return function(value, index, collection) {
        return func.call(thisArg, value, index, collection);
      };
    },
    //this method is ripped out from lo-dash
    findKey: function(object, callback, thisArg) {
      var result;
      callback = cc.Util.createCallback(callback, thisArg);
      cc.Util.forOwn(object, function(value, key, object) {
        if (callback(value, key, object)) {
          result = key;
          return false;
        }
      });
      return result;
    },
    find: function(object, callback, thisArg) {
      var result;
      callback = cc.Util.createCallback(callback, thisArg);
      cc.Util.forOwn(object, function(value, key, object) {
        if (callback(value, key, object)) {
          result = value;
          return false;
        }
      });
      return result;
    },
    //this method is ripped out from lo-dash
    forOwn: function(collection, callback) {
        var index,
            iterable = collection,
            result = iterable;

        if (!iterable) {
            return result;
        }

        if (!cc.Util.objectTypes[typeof iterable]) {
            return result;
        }

        for (index in iterable) {
            if (Object.prototype.hasOwnProperty.call(iterable, index)) {
                if (callback(iterable[index], index, collection) === cc.Util.indicatorObject) {
                    return result;
                }
            }
        }
        return result;
    },
    isArray: function(value){
            return toString.call(value) === '[object Array]';
    },
    isFunction: function(value){
        return typeof value === 'function';
    },
    isString: function(value){
        return typeof  value === 'string';
    },
    isUndefined: function(value){
        return typeof value === 'undefined';
    },
    Array: {
        remove: function(arr, item){
            var index = arr.indexOf(item);
            arr.splice(index, 1);
            return arr;
        }
    }
};