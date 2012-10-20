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
        
        if (theResults.type == Constant.CONS) {
            theReturnValue = "a list";
        }
        else {
            theReturnValue = theResults.val;
        }
        
        return theReturnValue;
    },
    

/******************************************************************************
 
    process
 
 ******************************************************************************/

    process : function (aExpr) {
        var theCar 
        var theCdr;
        
        var theReturnValue;
        
        if (aExpr.type == Constant.CONS) { // a list
            console.log('aExpr.type: ' + aExpr.type + ' <=> ' + Constant.CONS);
            theCar = aExpr.car;
            thecdr = aExpr.cdr;
            
            if (theCar.type == Constant.CONS) {
                console.log('theCar.type: ' + theCar.type + ' <=> ' + Constant.CONS);
                return this.process(theCar.car);
            }
            
            if (theCar.type == Constant.SYMBOL) {
                console.log('theCar.type: ' + theCar.type + ' <=> ' + Constant.SYMBOL);
            }
            else if (theCar.type == Constant.LAMBDA) {
                console.log('theCar.type: ' + theCar.type + ' <=> ' + Constant.LAMBDA);
            }

            console.log('type [' + theCar.type + ']');
            theReturnValue = aExpr;
        }
        else if (aExpr.type == Constant.SYMBOL){
            console.log('aExpr.type: ' + aExpr.type + ' <=> ' + SYMBOL);
        }
        else { // an atom
            console.log('atom :[' + aExpr.type + ']');
            theReturnValue = aExpr.val;
        }
        
        return theReturnValue;
    }
    
};

