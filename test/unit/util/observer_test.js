/**
 * The Observer unit tests
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var ObserverTest = TestCase.create({
  name: 'ObserverTest',
  
  testInstance: function() {
    var o = new Observer();
    
    this.assertNotNull(o.observe, "has 'observe' method");
    this.assertNotNull(o.observes, "has 'observes' method");
    this.assertNotNull(o.stopObserving, "has 'stopObserving' method");
    this.assertNotNull(o.fire, "has 'fire' method");
  },
  
  testObserve: function() {
    var o = new Observer();
    var f1 = function() {};
    var f2 = function() {};
    var f3 = function() {};
    
    this.assertSame(o, o.observe('foo', f1));
    this.assertSame(o, o.observe('foo', f2));
    this.assertSame(o, o.observe('bar', f3));
    
    this.assert(o.observes('foo', f1));
    this.assert(o.observes('foo', f2));
    this.assert(o.observes('bar', f3));
  },
  
  testObserveHash: function() {
    var o = new Observer();
    var f1 = function() {};
    var f2 = function() {};
    
    this.assertSame(o, o.observe({
      foo: f1, bar: f2
    }));
    
    this.assert(o.observes('foo', f1));
    this.assert(o.observes('bar', f2));
  },
  
  testObserveWithWeirdNames: function() {
    var o = new Observer();
    o.observe('onSomEthing', function() {});
    
    this.assert(o.observes('something'));
  },
  
  testObserves: function() {
    var o = new Observer();
    var f1 = function() {};
    var f2 = function() {};
    var f3 = function() {};
    
    o.observe('foo', f1);
    o.observe('foo', f2);
    o.observe('bar', f3);
    
    this.assert(o.observes('foo'));
    this.assert(o.observes('bar'));
    this.assert(o.observes('foo', f1));
    this.assert(o.observes('foo', f2));
    this.assert(o.observes('bar', f3));
    
    this.assertFalse(o.observes('boo'));
    this.assertFalse(o.observes('foo', f3));
    this.assertFalse(o.observes('bar', f1));
    this.assertFalse(o.observes('bar', f2));
    
    // testing the hash interface
    this.assert(o.observes({foo: f1, bar: f3}));
    this.assert(o.observes({foo: f2, bar: f3}));
    
    this.assertFalse(o.observes({foo: f1, bar: f2}));
    this.assertFalse(o.observes({foo: f1, bar: f1}));
    
    // checking weird names support
    this.assert(o.observes('FOO'));
    this.assert(o.observes('onBar'));
  },
  
  testStopObserving: function() {
    var o = new Observer();
    var f1 = function() {};
    var f2 = function() {};
    
    o.observe('foo', f1);
    o.observe('foo', f2);
    
    // test remove by function
    this.assertSame(o, o.stopObserving('foo', f2));
    
    this.assert(o.observes('foo'));
    this.assert(o.observes('foo', f1))
    this.assertFalse(o.observes('foo', f2));
    
    // test remove by name
    this.assertSame(o, o.stopObserving('foo'));
    
    this.assertFalse(o.observes('foo'));
    this.assertFalse(o.observes('foo', f1))
    this.assertFalse(o.observes('foo', f2));
    
    // test weird names support
    o.observe('foo', f1);
    o.observe('bar', f2);
    
    o.stopObserving('FOO');
    o.stopObserving('onBar');
    
    this.assertFalse(o.observes('foo'));
    this.assertFalse(o.observes('bar'));
  },
  
  testFire: function() {
    var o = new Observer();
    
    var e1 = e2 = e3 = false;
    var o1 = o2 = o3 = null;
    
    o.observe('foo', function(e) { e1 = e; o1 = this; });
    o.observe('foo', function(e) { e2 = e; o2 = this; });
    o.observe('bar', function(e) { e3 = e; o3 = this; });
    
    this.assertSame(o, o.fire('foo'));
    
    this.assert(e1);
    this.assert(e2);
    this.assertFalse(e3);
    
    // checking that the function were executed in the scope of the observer
    this.assertSame(o, o1);
    this.assertSame(o, o2);
    
    e1 = e2 = e3 = false;
    
    this.assertSame(o, o.fire('bar'));
    
    this.assert(e3);
    this.assertFalse(e1);
    this.assertFalse(e2);
    
    this.assertSame(o, o3);
    
    this.assertInstanceOf(Event.Custom, e3, "the event should be an Event.Custom instance");
    
    // test weird names
    e1 = e2 = e3 = false;
    
    this.assertSame(o, o.fire('FOO'));
    this.assertSame(o, o.fire('onBar'));
    
    this.assert(e1);
    this.assert(e2);
    this.assert(e3);
  },
  
  testShortcutsGeneration: function() {
    var o = new Observer({
      shorts: ['foo', 'bar']
    });
    
    this.assert(o.foo);
    this.assert(o.bar);
    this.assert(o.onFoo);
    this.assert(o.onBar);
    
    var foo = bar = false;
    var o1  = o2  = null;
    
    this.assertSame(o, o.onFoo(function(e) { foo = e; o1 = this; }));
    this.assertSame(o, o.onBar(function(e) { bar = e; o2 = this; }));
    
    this.assert(o.observes('foo'));
    this.assert(o.observes('bar'));
    
    this.assertSame(o, o.foo());
    this.assertSame(o, o.bar());
    
    this.assert(foo);
    this.assert(bar);
    
    this.assertInstanceOf(Event.Custom, foo);
    this.assertInstanceOf(Event.Custom, bar);
    
    this.assertSame(o, o1);
    this.assertSame(o, o2);
  },
  
  testCustomWiringCallback: function() {
    var custom_name = custom_callback = custom_scope = null;
    var o = new Observer({
      wire: function(name, callback) {
        custom_name     = name;
        custom_callback = callback;
        custom_scope    = this;
      }
    });
    
    var f1 = function() { called = true; scope = this;};
    
    o.observe('foo', f1);
    
    this.assertEqual('foo', custom_name);
    this.assertSame(f1, custom_callback);
    this.assertSame(o, custom_scope);
    
    this.assert(o.observes('foo', f1));
    
    // checking weird
    o.observe('BAR', f1);
    this.assertEqual('bar', custom_name);
    o.observe('onBoo', f1);
    this.assertEqual('boo', custom_name)
  },
  
  testCustomStoppingCallback: function() {
    var custom_name = custom_callback = custom_scope = null;
    var o = new Observer({
      stop: function(name, callback) {
        custom_name     = name;
        custom_callback = callback;
        custom_scope    = this;
      }
    });
    
    var f1 = function() {};
    o.observe('foo', f1);
    o.stopObserving('foo', f1);
    
    this.assertEqual('foo', custom_name);
    this.assertSame(f1, custom_callback);
    this.assertSame(o, custom_scope);
  },
  
  testCustomWrappingCallback: function() {
    var custom_name = custom_callback = custom_scope = null;
    var o = new Observer({
      wrap: function(name, callback) {
        custom_name     = name;
        custom_callback = callback;
        custom_scope    = this;
        
        return callback.bindAsEventListener(this, 'custom data');
      }
    });
    
    var e1 = scope = data = null;
    var f1 = function(e, d) { e1 = e; scope = this; data = d; };
    
    o.observe('foo', f1);
    
    this.assertEqual('foo', custom_name);
    this.assertSame(f1, custom_callback);
    this.assertSame(o, custom_scope);
    
    this.assert(o.observes('foo', f1));
    
    o.fire('foo');
    
    this.assertInstanceOf(Event.Custom, e1);
    this.assertSame(o, scope);
    this.assertEqual('custom data', data);
  },
  
  testCreate: function() {
    var o = {};
    
    var wire_name, wire_call, wire_scope, stop_name, stop_call, stop_scope, wrap_name, wrap_call, wrap_scope;
    
    Observer.create(o, {
      wire: function(name, callback) {
        wire_name  = name;
        wire_call  = callback;
        wire_scope = this;
      },
      stop: function(name, callback) {
        stop_name  = name;
        stop_call  = callback;
        stop_scope = this;
      },
      wrap: function(name, callback) {
        wrap_name  = name;
        wrap_call  = callback;
        wrap_scope = this;
        
        return callback;
      },
      
      shorts: ['bar']
    });
    
    // checking the observer methods existance
    this.assertNotNull(o.observe);
    this.assertNotNull(o.observes);
    this.assertNotNull(o.stopObserving);
    this.assertNotNull(o.fire);
    
    // checking the shortcuts existance
    this.assertNotNull(o.onBar);
    this.assertNotNull(o.bar);
    
    // trying to wire some function
    var fired = false, scope = null;
    var f1 = function() { fired = true; scope = this; };
    
    this.assertSame(o, o.observe('foo', f1));
    this.assert(o.observes('foo', f1));
    
    // trying to fire the event
    this.assertSame(o, o.fire('foo'));
    
    this.assert(fired);
    this.assertSame(o, scope);
    
    // trying to stop the event
    this.assertSame(o, o.stopObserving('foo'));
    
    this.assertFalse(o.observes('foo'));
    
    // checking the callbacks values
    this.assertEqual('foo', wire_name);
    this.assertEqual('foo', wrap_name);
    this.assertEqual('foo', stop_name);
    
    this.assertSame(f1, wire_call);
    this.assertSame(f1, wrap_call);
    this.assertSame(f1, stop_call);
    
    this.assertSame(o, wire_scope);
    this.assertSame(o, wrap_scope);
    this.assertSame(o, stop_scope);
  },
  
  testByNameObserving: function() {
    var o = new Observer({
      shorts: ['bar']
    });
    
    var args = null, o_this = null;
    o.foo = function() {
      o_this = this;
      args   = $A(arguments);
    };
    
    o.onBar('foo', 1, 2, 3);
    o.bar();
    
    this.assertSame(o, o_this);
    this.assertEqual([1,2,3], args);
  }
})