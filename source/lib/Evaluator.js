/******************************************************************************
 
    Evaluator
 
 ******************************************************************************/
var Constant = require('./Constant.js');
var List = require('./List.js');
var AList;



/******************************************************************************
 
    dump
 
 ******************************************************************************/

function dump (x) {
    console.log(JSON.stringify(x, null, 4));
};


/******************************************************************************
 
    size
 
 ******************************************************************************/

function size (expr) {
    var count = 0;
    while (expr.type != Constant.NIL) {
        count++;
        expr = expr.cdr;
    }
    return count;
}


/******************************************************************************
 
    module.exports
 
 ******************************************************************************/

module.exports = {
    initialize : function () {
        AList = Object.create(List);
        AList.initialize();
        for ( i in this._primitive) {
            AList.push(
                List.cons(
                    List.element(Constant.SYMBOL, this._primitive[i].symbol),
                    List.element(Constant.PRIMITIVE, i)
                )
            );
        }
    },

    alist : function () {
        return AList.head(); 
    },


/******************************************************************************
 
    evaluate
 
 ******************************************************************************/

    evaluate : function (aExpr) {
        if (aExpr == null) return aExpr;
        
        var theReturnValue;
        
        var theResults = this.process(aExpr);
//        dump (theResults);
        
        if ((theResults != undefined)
          && (theResults.type == Constant.CONS || theResults.type == Constant.NIL)) {
            return this.display(theResults);
        }
        else {
            theReturnValue = theResults;
        }
        
        return theReturnValue;
    },
    

/******************************************************************************
 
    process
 
 ******************************************************************************/

    process : function (aExpr) {
//        console.log('process');
        var theReturnValue;
        
        if (aExpr.type == Constant.CONS) { // a list
//            console.log('aExpr.type: ' + aExpr.type + ' <=> ' + Constant.CONS);
            return this.process_extended(aExpr);
        }
        else if (aExpr.type == Constant.SYMBOL){
            console.log('aExpr.type: ' + aExpr.type + ' <=> ' + Constant.SYMBOL);
            return AList.lookup(aExpr.val);
        }
        else { // an atom
//            console.log('atom :[' + aExpr.type + ']');
            return aExpr.val;
        }
        
        return theReturnValue;
    },
    

/******************************************************************************
 
    process_extended
 
 ******************************************************************************/
 
    process_extended : function (aExpr) {
        var theReturnValue;
        
        theCar = aExpr.car;
        theCdr = aExpr.cdr;
        
        if (theCar.type == Constant.CONS) {
//            console.log('theCar.type: ' + theCar.type + ' <=> ' + Constant.CONS);
            theCar = this.process(theCar.car);
        }
        
        if (theCar.type == Constant.SYMBOL) {
            console.log('theCar.type: ' + theCar.type + ' <=> ' + Constant.SYMBOL);
            node = AList.lookup(theCar.val);
            return this._primitive[node.val].operation(aExpr.cdr);
        }
        else if (theCar.type == Constant.LAMBDA) {
//            console.log('theCar.type: ' + theCar.type + ' <=> ' + Constant.LAMBDA);
        }

//        console.log('type [' + theCar.type + '][' + theCar.val + ']');
        theReturnValue = theCar;
        
        return theReturnValue;
    },

/******************************************************************************
 
    display
 
 ******************************************************************************/
 
    display : function (expr) {
//        dump(expr);
        if (expr.type == Constant.CONS) {
            if (expr.cdr.type == Constant.CONS || expr.cdr.type == Constant.NIL) {
//                console.log('display LIST');
                return '(' + this.display(expr.car) + this.display_extended(expr.cdr, '');
            }
            else {
//                console.log('display IMPROPER LIST');
                return '(' + this.display(expr.car) + ' . ' + this.display(expr.cdr) + ')';
            }
        }
        else {
            console.log('ATOM');
            return expr.val;
        }
    },


/******************************************************************************
 
    display_extended
 
 ******************************************************************************/
 
    display_extended : function (expr, string) {
//        dump(expr);
        if (expr.type == Constant.CONS) {
//            console.log('display extended CONS');
            return this.display_extended(expr.cdr, string + ' ' + this.display(expr.car));
        }
        else if (expr.type == Constant.NIL) {
//            console.log('display extended NIL');
            return string + ')';
        }
        else {
//            console.log('display extended ATOM');
            return string + ' ' + expr.val;
        }
    },
    

/******************************************************************************
 
    add
 
 ******************************************************************************/
 
    _primitive : [
        {
            symbol : 'define',
            operation : function (sexpr) {
                var length = size(sexpr);
                var node;
                
                if (sexpr.car.type != Constant.SYMBOL) {
                    console.log('bad syntax');
                }
                else if (length == 1) {
                    console.log('bad syntax (missing expression after identifier)');
                }
                else if (length > 2) {
                    console.log('bad syntax (multiple expressions after identifier)');
                }
                else {
                    node = AList.lookup(sexpr.car.val);
                    if (node) {
                        node.val = sexpr.cdr.car.val;
                    }
                    else {
                        AList.push(List.improper(sexpr.car, sexpr.cdr.car));
                    }
                }
                return;
            }
        },
        {
            symbol : '+',
            operation : function (sexpr) {
                var result = 0;

                while (sexpr.type != Constant.NIL) {
                    result += sexpr.car.val;
                    sexpr = sexpr.cdr;
                }

                return result;
            }
        },
        {
            symbol : '-',
            operation : function (sexpr) {
                var result = 0;

                while (sexpr.type != Constant.NIL) {
                    result -= sexpr.car.val;
                    sexpr = sexpr.cdr;
                }

                return result;
            }
        }
    ],
        
 
};

