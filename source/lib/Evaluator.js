/******************************************************************************
 
    Evaluator
 
 ******************************************************************************/
var Constant = require('./Constant.js');

function dump (x) {
    console.log(JSON.stringify(x, null, 4));
};

module.exports = {

/******************************************************************************
 
    evaluate
 
 ******************************************************************************/

    evaluate : function (aExpr) {
        if (aExpr == null) return aExpr;
        
        var theReturnValue;
        
        var theResults = this.process(aExpr);
//        dump (theResults);
        
        if (theResults.type == Constant.CONS) {
            theReturnValue = this.display(theResults);
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
        return aExpr;
        console.log('process');
        var theCar 
        var theCdr;
        
        var theReturnValue;
        
        if (aExpr.type == Constant.CONS) { // a list
            console.log('aExpr.type: ' + aExpr.type + ' <=> ' + Constant.CONS);
            theCar = aExpr.car;
            theCdr = aExpr.cdr;
            
            if (theCar.type == Constant.CONS) {
                console.log('theCar.type: ' + theCar.type + ' <=> ' + Constant.CONS);
                theCar = this.process(theCar.car);
            }
            
            if (theCar.type == Constant.SYMBOL) {
                console.log('theCar.type: ' + theCar.type + ' <=> ' + Constant.SYMBOL);
                if ( theCar.val == '+') {
                    console.log('cdar[' + theCdr.car.val + '] cddar[' + theCdr.cdr.car.val + ']');
                    return (theCdr.car.val + theCdr.cdr.car.val);
                }
            }
            else if (theCar.type == Constant.LAMBDA) {
                console.log('theCar.type: ' + theCar.type + ' <=> ' + Constant.LAMBDA);
            }

            console.log('type [' + theCar.type + '][' + theCar.val + ']');
            theReturnValue = theCar;
        }
        else if (aExpr.type == Constant.SYMBOL){
            console.log('aExpr.type: ' + aExpr.type + ' <=> ' + SYMBOL);
            return ('aExpr.type: ' + aExpr.type + ' <=> ' + SYMBOL);
        }
        else { // an atom
            console.log('atom :[' + aExpr.type + ']');
            theReturnValue = aExpr.val;
        }
        
        return theReturnValue;
    },
    

/******************************************************************************
 
    display
 
 ******************************************************************************/
 
    display : function (expr) {
        dump(expr);
        if (expr.type == Constant.CONS) {
            if (expr.cdr.type == Constant.CONS || expr.cdr.type == Constant.NIL) {
                console.log('LIST');
                return '(' + this.display(expr.car) + this.display_extended(expr.cdr, '');
            }
            else {
                console.log('IMPROPER LIST');
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
        dump(expr);
        if (expr.type == Constant.CONS) {
            console.log('more CONS');
            return this.display_extended(expr.cdr, string + ' ' + this.display(expr.car));
        }
        else if (expr.type == Constant.NIL) {
            console.log('more NIL');
            return string + ')';
        }
        else {
            console.log('more ATOM');
            return string + ' ' + expr.val;
        }
    }
};

