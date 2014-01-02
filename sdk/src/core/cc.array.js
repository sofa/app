/**
 * @name Array
 * @class
 * @namespace cc.Array
 *
 * @description
 * This is more like a utility function to have a `[].remove()` method.
 */
cc.Array = {
    /**
     * @method remove
     * @memberof cc.Array
     *
     * @description
     * Removes a given item from a given array and returns the manipulated
     * array.
     *
     * @example
     * var arr = ['foo', 'bar'];
     *
     * var newArr = cc.Array.remove(arr, 'foo');
     *
     * @param {array} arr An array.
     * @param {object} item The item to remove from the array.
     *
     * @return {array} Manipulated array.
     */
    remove: function(arr, item){
            var index = arr.indexOf(item);
            arr.splice(index, 1);
            return arr;
        }
};
