/**
 * The basic events delegation module tests
 *
 * Copyright (C) 2010 Nikolay V. Nemshilov
 */
var EventDelegationTest = TestCase.create({
  name: 'EventDelegationTest',
  
  setUp: function() {
    this.el  = $E('div').insertTo(document.body);
    this.el1 = $E('div', {id: 'first'}).insertTo(this.el);
    this.el2 = $E('div', {id: 'second'}).insertTo(this.el);
    this.el3 = $E('div', {id: 'third'}).insertTo(this.el);
  },
  
  tearDown: function() {
    this.el.remove();
  },
  
  testSimpleDelegation: function() {
    var target1 = null;
    var target2 = null;
    
    var event1 = null;
    var event2 = null;
    
    this.el.delegate('click', '#first',  function(e) { event1 = e; target1 = this; });
    this.el.delegate('click', '#second', function(e) { event2 = e; target2 = this; });
    
    this.fireClick(this.el1._);
    
    this.assert(event1 instanceof Event);
    this.assertSame(this.el1, target1);
    
    this.assertNull(event2);
    this.assertNull(target2);
    
    // trying to click the second element
    target1 = target2 = event1 = event2 = null;
    
    this.fireClick(this.el2._);
    
    this.assert(event2 instanceof Event);
    this.assertSame(this.el2, target2);
    
    this.assertNull(event1);
    this.assertNull(target1);
    
    // trying to click the third the unhooked element
    target1 = target2 = event1 = event2 = null;
    
    this.fireClick(this.el3._);
    
    this.assertNull(event1);
    this.assertNull(target1);
    
    this.assertNull(event2);
    this.assertNull(target2);
  },
  
  testDelegationWithArguments: function() {
    var event = null;
    var args  = null;
    
    this.el.delegate('click', '#first', function(e) {
      event = e; args = $A(arguments).slice(1)
    }, 1, 2, 3);
    
    this.fireClick(this.el1._);
    
    this.assert(event instanceof Event);
    this.assertEqual([1,2,3], args);
  },
  
  testDelegationWithArray: function() {
    var first_called = false;
    var second_called = false;
    
    this.el.delegate('click', '#first', [
      function() { first_called = true; },
      function() { second_called = true; }
    ]);
    
    this.fireClick(this.el1._);
    
    this.assert(first_called);
    this.assert(second_called);
  },
  
  testDelegationWithArrayAndArguments: function() {
    var args1 = null;
    var args2 = null;
    
    this.el.delegate('click', '#first', [
      [function() { args1 = $A(arguments).slice(1); }, 1, 2, 3],
      [function() { args2 = $A(arguments).slice(1); }, 4, 5, 6]
    ]);
    
    this.fireClick(this.el1._);
    
    this.assertEqual([1,2,3], args1);
    this.assertEqual([4,5,6], args2);
  },
  
  testDelegationByName: function() {
    var event1  = null;
    var event2  = null;
    var event3  = null;
    var target1 = null;
    var target2 = null;
    var target3 = null;
    
    this.el1.dummy = function(e) { target1 = this; event1 = e; };
    this.el2.dummy = function(e) { target2 = this; event2 = e; };
    this.el3.dummy = function(e) { target3 = this; event3 = e; };
    
    this.el.delegate('click', '#first', 'dummy');
    this.el.delegate('click', '#second', ['dummy']);
    
    this.fireClick(this.el1._);
    this.fireClick(this.el2._);
    
    // there is no events when called by name
    this.assertNull(event1);
    this.assertNull(event2);
    
    this.assertSame(target1, this.el1);
    this.assertSame(target2, this.el2);
    
    this.assertNull(event3);
    this.assertNull(target3);
  },
  
  testDelegationByNameWithArguments: function() {
    var args1  = null;
    var args2  = null;
    var event1 = null;
    var event2 = null;
    
    this.el1.dummy = function() { args1 = $A(arguments) };
    this.el2.dummy = function() { args2 = $A(arguments) };
    
    this.el.delegate('click', '#first', 'dummy', 1, 2, 3);
    this.el.delegate('click', '#second', [['dummy', 4, 5, 6]]);
    
    this.fireClick(this.el1._);
    this.fireClick(this.el2._);
    
    // there is no events when called by name
    this.assertNull(event1);
    this.assertNull(event2);
    
    this.assertEqual([1,2,3], args1);
    this.assertEqual([4,5,6], args2);
  },
  
  testDelegationByHash: function() {
    var args1   = null;
    var args2   = null;
    var args3   = null;
    var event1  = null;
    var event2  = null;
    var event3  = null;
    var target1 = null;
    var target2 = null;
    var target3 = null;
    
    this.el2.dummy = function() { args2 = $A(arguments) };
    this.el3.dummy = function() { args3 = $A(arguments) };
    
    this.el.delegate('click', {
      '#first':  function(e) { event1 = e; args1 = $A(arguments).slice(1); },
      '#second': ['dummy', 1, 2, 3],
      '#third':  'dummy'
    });
    
    this.fireClick(this.el1._);
    this.fireClick(this.el2._);
    this.fireClick(this.el3._);
    
    this.assert(event1 instanceof Event);
    
    this.assertEqual([],      args1);
    this.assertEqual([1,2,3], args2);
    this.assertEqual([],      args3);
  },
  
  testDelegatesEmptyCase: function() {
    var callback = function() {};
    
    this.assertFalse(this.el.delegates('click'));
    this.assertFalse(this.el.delegates('click', '#first'));
    this.assertFalse(this.el.delegates('click', '#first', callback));
  },
  
  testDelegatesPositiveCase: function() {
    var callback = function() {};
    
    this.el.delegate('click', '#first', callback);
    
    this.assert(this.el.delegates('click'));
    this.assert(this.el.delegates('click', '#first'));
    this.assert(this.el.delegates('click', '#first', callback));
    
    // various false checks
    this.assertFalse(this.el.delegates('mouseover'));
    this.assertFalse(this.el.delegates('click', '#second'));
    this.assertFalse(this.el.delegates('click', '#first', function() {}));
  },
  
  testDelegatesInterference: function() {
    this.el.onMouseover('addClass', 'boo');
    
    this.assertFalse(this.el.delegates('mouseover'));
  },
  
  testDelegatesWithHash: function() {
    var callback = function() {};
    
    this.el.delegate('click', '#first', callback);
    
    this.assert(this.el.delegates('click', {
      '#first': callback
    }));
  },
  
  testUndelegate: function() {
    var callback = function() {};
    
    this.el.on('click', callback);
    this.el.delegate('click', '#first', callback);
    this.el.delegate('mouseover', '#first', callback);
    
    this.assert(this.el.delegates('click'));
    this.assert(this.el.observes('click'));
    
    this.el.undelegate('click');
    
    this.assertFalse(this.el.delegates('click'));
    
    this.assert(this.el.observes('click'));
    this.assert(this.el.delegates('mouseover', '#first', callback));
  },
  
  testUndelegateByCSSRule: function() {
    this.el.delegate('click', '#first', 'boo');
    this.el.delegate('click', '#second', 'boo');
    
    this.el.undelegate('click', '#first');
    
    this.assertFalse(this.el.delegates('click', '#first'));
    this.assert(this.el.delegates('click', '#second'));
  },
  
  testUndelegateByFunction: function() {
    var callback1 = function() {};
    var callback2 = function() {};
    
    this.el.delegate('click', '#first', [callback1, callback2]);
    
    this.el.undelegate('click', '#first', callback2);
    
    this.assert(this.el.delegates('click', '#first', callback1));
    this.assertFalse(this.el.delegates('click', '#first', callback2));
  },
  
  testUndelegateByName: function() {
    this.el.delegate('click', '#first', ['method1', 'method2']);
    
    this.el.undelegate('click', '#first', 'method2');
    
    this.assert(this.el.delegates('click', '#first', 'method1'));
    this.assertFalse(this.el.delegates('click', '#first', 'method2'));
  },
  
  testUndelegateByHash: function() {
    this.el.delegate('click', {
      '#first':  'method1',
      '#second': 'method2',
      '#third':  'method3'
    });
    
    this.el.undelegate('click', {
      '#first':  'method1',
      '#second': 'method2'
    });
    
    this.assertFalse(this.el.delegates('click', '#first'));
    this.assertFalse(this.el.delegates('click', '#second'));
    this.assert(this.el.delegates('click', '#third'))
  },
  
  testStringOnShortcut: function() {
    var args, css_rule = ".some.css-rule";
    
    this.mock($(document), 'delegate', function() { args = $A(arguments); return $(document); });
    
    this.assertSame(css_rule, css_rule.on('click', 'addClass', 'foo'));
    
    this.assertEqual(['click', css_rule, 'addClass', 'foo'], args);
    
    this.undoMock($(document), 'delegate');
  },
  
  testStringStopObservingShortcut: function() {
    var args, css_rule = ".some.css-rule";
    
    this.mock($(document), 'undelegate', function() { args = $A(arguments); return $(document); });
    
    this.assertSame(css_rule, css_rule.stopObserving('click', 'addClass', 'foo'));
    
    this.assertEqual(['click', css_rule, 'addClass', 'foo'], args);
    
    this.undoMock($(document), 'undelegate');
  },
  
  testStringObservesShortcut: function() {
    var args, css_rule = ".some.css-rule", result = 'result';
    
    this.mock($(document), 'delegates', function() { args = $A(arguments); return result; });
    
    this.assertSame(result, css_rule.observes('click', 'addClass', 'foo'));
    
    this.assertEqual(['click', css_rule, 'addClass', 'foo'], args);
    
    this.undoMock($(document), 'delegates');
  },
  
  testStringOnNamedShortcuts: function() {
    var args = null, rule = ".some.css-stuff", dummy = function() {};
    
    // mocking the 'on' method
    var old_method = String.prototype.on;
    String.prototype.on = function() { args = $A(arguments); };
    
    $w('click rightclick contextmenu mousedown mouseup mouseover mouseout mousemove keypress keydown keyup' +
      ' disable enable focus blur change submit reset focus'
    ).each(function(name) {
      this.assert(rule['on'+ name.capitalize()], "checking shortcut presence '"+ 'on'+ name.capitalize() + "'");
      rule['on'+ name.capitalize()](dummy);
      this.assertEqual([name, dummy], args, "checking shortcut for '"+ name + "'");
    }, this);
    
    String.prototype.on = old_method;
  }
});