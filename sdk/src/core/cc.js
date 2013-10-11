var cc = window.cc = {};

(function(){

    'use strict';

    /**
     * Creates the given namespace within the cc namespace.
     * The method returns an object that contains meta data
     *
     * - targetParent (object)
     * - targetName (string)
     * - bind (function) : a convenient function to bind
                           a value to the namespace
     * 
     * Options:
     * 
     *   - `namespaceString` e.g. 'cc.services.FooService'
     * 
     */

    cc.namespace = function (namespaceString) {
        var parts = namespaceString.split('.'), parent = cc, i;

        //strip redundant leading global
        if (parts[0] === 'cc') {
            parts = parts.slice(1);
        }

        var targetParent = cc,
            targetName;

        for (i = 0; i < parts.length; i++) {
            //create a propery if it doesn't exist
            if (typeof parent[parts[i]] === "undefined") {
                parent[parts[i]] = {};
            }

            if (i === parts.length - 2){
                targetParent = parent[parts[i]];
            }

            targetName = parts[i];

            parent = parent[parts[i]];
        }
        return {
            targetParent: targetParent,
            targetName: targetName,
            bind: function(target){
                targetParent[targetName] = target;
            }
        };
    };

    cc.define = function(namespace, fn){
        cc.namespace(namespace)
          .bind(fn);
    };

    /**
     * Sets up an inheritance chain between two objects
     * https://github.com/isaacs/inherits/blob/master/inherits.js
     * Can be used like this:
     *
     *   function Child () {
     *    Child.super.call(this)
     *    console.error([this
     *                  ,this.constructor
     *                  ,this.constructor === Child
     *                  ,this.constructor.super === Parent
     *                  ,Object.getPrototypeOf(this) === Child.prototype
     *                  ,Object.getPrototypeOf(Object.getPrototypeOf(this))
     *                   === Parent.prototype
     *                  ,this instanceof Child
     *                  ,this instanceof Parent])
     *  }
     *  function Parent () {}
     *  inherits(Child, Parent)
     *  new Child
     *
     */

     /*jshint asi: true*/
    cc.inherits = function (c, p, proto) {
        //this code uses a shitty form of semicolon less
        //writing. We just copied it from:
        //https://github.com/isaacs/inherits/blob/master/inherits.js

        proto = proto || {}
        var e = {}
        ;[c.prototype, proto].forEach(function (s) {
            Object.getOwnPropertyNames(s).forEach(function (k) {
                e[k] = Object.getOwnPropertyDescriptor(s, k)
            })
        })
        c.prototype = Object.create(p.prototype, e)
        c.super = p
    };
    /*jshint asi: false*/

})();





