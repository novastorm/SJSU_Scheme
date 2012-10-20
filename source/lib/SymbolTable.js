/******************************************************************************
 
    List.js
 
 ******************************************************************************/
var CONSTANT = require('./Constant.js');

module.exports = {
    _list : this.nil,

    nil : {type:'nil', val: null},

    cons : function (aCar, aCdr) { return {type:'cons', car:aCar, cdr:aCdr}; },

    improper : function (aCar, aCdr) { return this.cons(aCar, aCdr); },

    symbol : function (aValue) { return {type:'symbol', val:aValue}; },

    element : function (aType, aValue) { return {type:aType, val:aValue}; },
    
    

    push : function (aCar, aCdr) { return this.cons(aCar, this.cons(aCdr, NIL)); },
    
    pop : function (aCar, aCdr) {
            var result = this.car;
            this._list = this.cdr;
            return result;
        },

    peek : function (aCar, aCdr) { return this.car; },
    
    get_list : function () { return _list; },
};

