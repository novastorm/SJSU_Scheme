/******************************************************************************
 
    Evaluator
 
 ******************************************************************************/
var Constant = require('./Constant.js');
var List = require('./List.js');
var AList;
var self;


/******************************************************************************
 
    dump
 
 ******************************************************************************/

function dump (object, message) {
    console.log('*** DUMP ***');
    if (message != undefined) {
        console.log(message);
    }
    console.log('== OBJECT ==');
    console.log(JSON.stringify(object, null, 4));
    console.log('============');
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
        self = this;
        AList = Object.create(List);
        AList.initialize();
        var key, value;
        
        for ( i in self._primitive) {
            key = List.element(Constant.SYMBOL, self._primitive[i].symbol);
            if (self._primitive[i].operation.type == undefined) {
                value = List.element(Constant.PRIMITIVE, i);
            }
            else {
                value = self._primitive[i].operation;
            }
            
            AList.push(List.cons(key, value));
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
        
        var theResults = self.process(aExpr);
        dump(theResults, 'evaluate');
        
        return self.display(theResults);
    },
    

/******************************************************************************
 
    process
 
 ******************************************************************************/

    process : function (aExpr) {
//        console.log('process');
        if (aExpr.type == Constant.CONS) { // a list
//            console.log('aExpr.type: ' + aExpr.type + ' <=> ' + Constant.CONS);
            return self.process_extended(aExpr);
        }
        else if (aExpr.type == Constant.SYMBOL){
            console.log('aExpr.type: ' + aExpr.type + ' <=> ' + Constant.SYMBOL);
            node = AList.lookup(aExpr.val);
            if (node.type == Constant.PRIMITIVE) {
                console.log("process PRIMITIVE: " + aExpr.val);
                return self._primitive[node.val].operation;
            }
            else if (node.type == Constant.NIL) {
                console.log("Undefined symbol: " + aExpr.val);
                return node;
            }
            return node;
        }
        else { // an atom
            console.log('atom :[' + aExpr.type + ']');
            return aExpr;
        }
        
        return null;
    },
    

/******************************************************************************
 
    process_macro
 
 ******************************************************************************/
 
    process_macro : function (aExpr, aSExpr) {
        console.log('process_macro');
        dump(aExpr, 'aExpr');
        dump(aSExpr, 'aSExpr');
        
        if (aExpr.type == Constant.LAMBDA) {
            console.log('process_macro LAMBDA');
            return (aExpr);
        }

        return aExpr;
    },
 

/******************************************************************************
 
    process_extended
 
 ******************************************************************************/
 
    process_extended : function (aExpr) {
        console.log('process_extended');
        dump(aExpr);
        
        // check for lambda here

        var theReturnValue;
        var node, primitive;
        
        var theCar = aExpr.car;
        var theCdr = aExpr.cdr;
        
        if (theCar.type == Constant.CONS) {
            console.log('theCar.type: ' + theCar.type + ' <=> ' + Constant.CONS);
            theCar = self.process(theCar.car);
        }
        
        if (theCar.type == Constant.SYMBOL) {
           console.log('theCar.type: ' + theCar.type + ' <=> ' + Constant.SYMBOL);
            node = AList.lookup(theCar.val);
            if (node.type == Constant.PRIMITIVE) {
                console.log('process_extended SYMBOL PRIMITIVE');
                primitive = self._primitive[node.val].operation(theCdr);
                dump(primitive);
                if (primitive.type == Constant.NIL) {
                    console.log('process_extended SYMBOL PRIMITIVE NIL');
                }
                else {
                    console.log('process_extended SYMBOL PRIMITIVE OTHER');
                    primitive = self.process_macro(primitive, theCdr);
                }
                return primitive;
            }
            else if (node.type == Constant.LAMBDA) {
                console.log('process_extended SYMBOL LAMBDA');
                node = self._primitive[node.val].operation(theCdr);
                return self.process_macro(node, theCdr.cdr);
            }
            else if (node.type != Constant.NIL) {
                console.log('process_extended SYMBOL NIL');
                return node;
            }
            else {
                console.log('Undefined symbol: ' + theCar.val);
                return null;
            }
        }

//        console.log('type [' + theCar.type + '][' + theCar.val + ']');
        theReturnValue = theCar;
        
        return theReturnValue;
    },


/******************************************************************************
 
    display
 
 ******************************************************************************/
 
    display : function (expr) {
        if (expr == undefined) return '';
        if (expr.type == Constant.CONS) {
            if (expr.cdr.type == Constant.CONS || expr.cdr.type == Constant.NIL) {
//                console.log('display LIST');
                return '(' + self.display(expr.car) + self.display_extended(expr.cdr, '');
            }
            else {
//                console.log('display IMPROPER LIST');
                return '(' + self.display(expr.car) + ' . ' + self.display(expr.cdr) + ')';
            }
        }
        else {
//            console.log('ATOM');
            if (expr.type == Constant.STRING) {
                return '"' + expr.val + '"';
            }
            else if (expr.type == Constant.NUMBER) {
                return expr.val.toString();
            }
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
            return self.display_extended(expr.cdr, string + ' ' + self.display(expr.car));
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
                var node, value;
                
                if (length < 1) {
                    console.log('bad syntax');
                }
                else if (length == 1) {
                    console.log('bad syntax (missing expression after identifier)');
                }
                else if (length > 2) {
                    console.log('bad syntax (multiple expressions after identifier)');
                }
                else {
                    if (sexpr.cdr.type = Constant.CONS) {
                        value = self.process(sexpr.cdr.car);
                    }
                    else{
                        value = sexpr.cdr;
                    }

                    if (value == null) {
                        return List.nil;
                    }

                    node = AList.lookup(sexpr.car.val);
                    
                    if (node.type != Constant.NIL) {
                        node.type = value.type;
                        node.val = value.val;
                    }
                    else {
                        AList.push(List.improper(sexpr.car, value));
                    }
                }
                return value;
            }
        },
        {
            symbol : '+',
            operation : function (sexpr) {
                var result = List.element('number', 0);
                var valueNode;
                
                while (sexpr.type != Constant.NIL) {
                    valueNode = self.process(sexpr.car);
                    if (valueNode == null) {
                        result = List.nil;
                        break;
                    }
                    result.val += valueNode.val;
                    sexpr = sexpr.cdr
                }

                return result;
            }
        },
        {
            symbol : '-',
            operation : function (sexpr) {
                var result = List.element('number', 0);
                var valueNode;
                
                while (sexpr.type != Constant.NIL) {
                    valueNode = self.process(sexpr.car);
                    if (valueNode == null) {
                        result = List.nil;
                        break;
                    }
                    result.val -= valueNode.val;
                    sexpr = sexpr.cdr
                }

                return result;
            }
        },
        {
            symbol : '*',
            operation : function (sexpr) {
                var result = List.element('number', 1);
                var valueNode;
                
                while (sexpr.type != Constant.NIL) {
                    valueNode = self.process(sexpr.car);
                    if (valueNode == null) {
                        result = List.nil;
                        break;
                    }
                    result.val *= valueNode.val;
                    sexpr = sexpr.cdr
                }

                return result;
            }
        },
        {
            symbol : '/',
            operation : function (sexpr) {
                var result = List.nil;
                var valueNode;
                var length = size(sexpr);
                
                if (length < 1) {
                    console.log('bad syntax expected: at least 1 argument');
                }
                else {
                    result = self.process(sexpr.car);
                    sexpr = sexpr.cdr
                  
                    if (sexpr.type == Constant.NIL) {
                        result.val = 1 / result.val;
                    }
                    else {
                        while (sexpr.type != Constant.NIL) {
                            valueNode = self.process(sexpr.car);
                            if (valueNode == null) {
                                return List.nil;
                            }
                            result.val /= valueNode.val;
                            sexpr = sexpr.cdr
                        }
                    }
                }

                return result;
            }
        },
        {
            symbol : 'quote',
            operation : function (sexpr) {
                var length = size(sexpr);
                
                if (length != 1) {
                    console.log('bad syntax');
                }
                else {
                    return sexpr.car;
                }
            }
        },
        {
            symbol : Constant.TRUE,
            operation : List.element('boolean', Constant.TRUE)
        },
        {
            symbol : Constant.FALSE,
            operation : List.element('boolean', Constant.FALSE)
        },
        {
            symbol : 'if',
            operation : function (sexpr) {
                var length = size(sexpr);
                var node;
                var condition, ifTrue, ifFalse;
                
                if (length != 3) {
                    console.log('bad syntax');
                    console.log('has ' + length + ' parts after keyword');
                }
                else {
                    condition = sexpr.car;
                    ifTrue = sexpr.cdr.car;
                    ifFalse = sexpr.cdr.cdr.car;
                    if (self.process(condition).val == Constant.FALSE) {
                        node = self.process(ifFalse);
                    }
                    else {
                        node = self.process(ifTrue);
                    }
                }
                return node;
            }
        },
        {
            symbol : 'lambda',
            operation : function (sexpr) {
                var length = size(sexpr);
                var node;
                var condition, ifTrue, ifFalse;
                
                if (length != 2) {
                    console.log('bad syntax');
                    console.log('has ' + length + ' parts after keyword');
                    return List.nil;
                }
                else {
                    formals = sexpr.car;
                    body = sexpr.cdr.car;

                    node = {
                            type : Constant.LAMBDA,
                            formals : formals,
                            body : body
                        };
                }
                return node;
            }
        },
    ],
        
 
};

