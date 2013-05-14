cc.define('cc.models.BasketItem', function(){

    'use strict';

    var self = this;

    self.quantity = 0;

    return self;
});

cc.models.BasketItem.prototype.getTotal = function(){
    return cc.Util.round(this.quantity * this.product.price, 2);
}