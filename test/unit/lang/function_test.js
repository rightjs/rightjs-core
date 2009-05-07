/**
 * The Function class unit-test
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var FunctionTest = TestCase.create({
  name: 'FunctionTest',
  
  testBind: function() {
    var obj = {
      attr: null
    };
    
    var func = (function() {
      return this.attr = 'bind';
    }).bind(obj);
    
    this.assertInstanceOf(Function, func);
    this.assertEqual('bind', func());
    this.assertEqual('bind', obj.attr);
  },
  
  testBindWithCurry: function() {
    var obj = {
      attr: null
    };
    
    var func = (function(def, users) {
      return this.attr = users || def;
    }).bind(obj, 'default');
    
    this.assertInstanceOf(Function, func);
    this.assertEqual('default', func());
    this.assertEqual('default', obj.attr);
    
    this.assertEqual('users', func('users'));
    this.assertEqual('users', obj.attr);
  },
  
  testBindAsEventListener: function() {
    var obj = {
      'event': null,
      'attr': null
    };
    
    var func = (function(event, def, users) {
      this.event = event;
      return this.attr = def || users;
    }).bindAsEventListener(obj, 'default');
    
    this.assertInstanceOf(Function, func);
    this.assertEqual('default', func('event'));
    this.assertEqual('default', obj.attr);
  },
  
  testCurry: function() {
    var func = function(x,y) { return x * y; };
    var triple = func.curry(3);
    var quadro = func.curry(4);
    
    this.assertInstanceOf(Function, triple);
    this.assertInstanceOf(Function, quadro);
    this.assertEqual(15, triple(5));
    this.assertEqual(20, quadro(5));
  },
  
  testDelay: function() {
    var timeout = (function(txt) {
      //alert(txt);
    }).delay(5000, 'some text');
    
    this.assertNotNull(timeout);
  },
  
  testPeriodical: function() {
    var interval = (function(txt) {
      //alert(txt);
    }).periodical(5000, 'some text');
    
    this.assertNotNull(interval);
  }
});