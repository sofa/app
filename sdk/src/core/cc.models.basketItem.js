cc.define('cc.models.BasketItem', function(){

    'use strict';

    var self = this;

    self.quantity = 0;

    return self;
});

cc.models.BasketItem.prototype.getTotal = function(){
    return cc.Util.round(this.quantity * this.product.price, 2);
};

cc.models.BasketItem.prototype.getVariantID = function(){
    return this.variant ? this.variant.variantID : null;
};

cc.models.BasketItem.prototype.getOptionID = function(){
    return cc.Util.isNumber(this.optionID) ? this.optionID : null;
};