/******************************************************************************
 
    SymbolTable.js
 
 ******************************************************************************/
var CONSTANT = require('./Constant.js');

module.exports = {
    _theList : null,
    
    initialize : function () {
        this._theList = this.nil();
    },

    cons : function (aCar, aCdr) { return {type:'cons', car:aCar, cdr:aCdr}; },

    improper : function (aCar, aCdr) { return this.cons(aCar, aCdr); },

    element : function (aType, aValue) { return {type:aType, val:aValue}; },
    
    nil : function () { return this.element('nil', null); },
    
    

    push : function (element) {
            var current = this._theList;
            this._theList = this.cons(element, current);
            return;
        },
    
    pop : function () {
            var result = this.car;
            this._theList = this.cdr;
            return result;
        },

    peek : function () { return this.car; },
    
    head : function (aList) {
            if (aList) this._theList = aList;
            return this._theList; 
        },
};

