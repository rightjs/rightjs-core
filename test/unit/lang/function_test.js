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

  testRCurry: function() {
    var func = function() {
      return $A(arguments);
    };
    var f1 = func.rcurry(1);
    var f2 = func.rcurry(1,2,3);

    this.assertEqual([1,1], f1(1));
    this.assertEqual([1,2,1], f1(1,2));
    this.assertEqual([1,2,1,2,3], f2(1,2));
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
  },

  testChain: function() {
    var f1 = function(a,num) { a.push(num); return a; };
    var f2 = function(a,num) { a.push(num) };
    var f3 = function(a,num) { a.push(num) };
    var f4 = function(a,num) { a.push(num) };

    var a = [];

    var f = f1.chain(f2, a, 2).chain(f3, a, 3).chain(f4, a, 4);

    this.assertNotSame(f, f1);
    this.assertNotSame(f, f2);
    this.assertNotSame(f, f3);
    this.assertNotSame(f, f4);

    var r = f(a, 1);
    this.assertSame(r, a, "checking it had returned the original result");
    this.assertEqual([1,2,3,4], a, "checking the chain works properly");
  }
});
