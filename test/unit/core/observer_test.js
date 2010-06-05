/**
 * The Observer unit tests
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var ObserverTest = TestCase.create({
  name: 'ObserverTest',
  
  testOn: function() {
    var o = new Observer();
    var f1 = function() {};
    var f2 = function() {};
    var f3 = function() {};
    
    this.assertSame(o, o.on('foo', f1));
    this.assertSame(o, o.on('foo', f2));
    this.assertSame(o, o.on('bar', f3));
    
    this.assert(o.observes('foo', f1));
    this.assert(o.observes('foo', f2));
    this.assert(o.observes('bar', f3));
  },
  
  testOnHash: function() {
    var o = new Observer();
    var f1 = function() {};
    var f2 = function() {};
    
    this.assertSame(o, o.on({
      foo: f1, bar: f2
    }));
    
    this.assert(o.observes('foo', f1));
    this.assert(o.observes('bar', f2));
  },
  
  testOnHashWithSharedArgs: function() {
    var o = new Observer();
    var a1, a2, b1, b2;
    var f1 = function(a, b) { a1 = a; b1 = b; };
    var f2 = function(a, b) { a2 = a; b2 = b; };
    
    o.on({
      foo: f1, bar: f2
    }, 'a', 'b');
    
    o.fire('foo').fire('bar');
    
    this.assertEqual('a', a1);
    this.assertEqual('a', a2);
    
    this.assertEqual('b', b1);
    this.assertEqual('b', b2)
  },
  
  testOnArray: function() {
    var o = new Observer();
    var f1 = function() {};
    var f2 = function() {};
    
    o.on('foo', [f1, f2]);
    
    this.assert(o.observes('foo', f1));
    this.assert(o.observes('foo', f2))
  },
  
  testOnArrayByName: function() {
    var a1, a2, b1, b2;
    
    var o = new Observer();
    o.foo = function(a, b) { a1 = a; b1 = b; };
    o.bar = function(a, b) { a2 = a; b2 = b; };
    
    o.on('some', ['foo', ['bar', 'a']], 'b').fire('some');
    
    this.assertEqual('b', a1);
    this.assertEqual(undefined, b1);
    this.assertEqual('a', a2);
    this.assertEqual('b', b2);
  },
  
  testObserves: function() {
    var o = new Observer();
    var f1 = function() {};
    var f2 = function() {};
    var f3 = function() {};
    
    o.on('foo', f1);
    o.on('foo', f2);
    o.on('bar', f3);
    
    this.assert(o.observes('foo'));
    this.assert(o.observes('bar'));
    this.assert(o.observes('foo', f1));
    this.assert(o.observes('foo', f2));
    this.assert(o.observes('bar', f3));
    
    this.assertFalse(o.observes('boo'));
    this.assertFalse(o.observes('foo', f3));
    this.assertFalse(o.observes('bar', f1));
    this.assertFalse(o.observes('bar', f2));
        
    // testing direct by function check
    this.assert(o.observes(f1));
    this.assert(o.observes(f2));
    this.assertFalse(o.observes(new Function()));
  },
  
  testObservesByName: function() {
    var o = new Observer();
    o.method1 = function() {};
    o.method2 = function() {};
    
    o.on('foo', 'method1');
    o.on('bar', 'method2');
    
    this.assert(o.observes('foo', 'method1'));
    this.assert(o.observes('bar', 'method2'));
    
    this.assertFalse(o.observes('foo', 'method2'));
    this.assertFalse(o.observes('bar', 'method1'));
  },
  
  testStopObserving: function() {
    var o = new Observer();
    var f1 = function() {};
    var f2 = function() {};
    
    o.on('foo', f1);
    o.on('foo', f2);
    
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
        
    // trying unsubscribe function just by the function call
    o.on('foo', f1);
    this.assert(o.observes(f1));
    this.assertSame(o, o.stopObserving(f1));
    this.assertFalse(o.observes(f1));
  },
  
  testStopObservingByName: function() {
    var o = new Observer();
    o.method1 = function() {};
    o.method2 = function() {};
    
    o.on('foo', 'method1');
    o.on('bar', 'method2');
    
    this.assert(o.observes('foo', 'method1'));
    this.assert(o.observes('bar', 'method2'));
    
    o.stopObserving('foo', 'method1');
    
    this.assertFalse(o.observes('foo', 'method1'));
    this.assert(o.observes('bar', 'method2'));
    
    o.stopObserving('bar', 'method2');
    
    this.assertFalse(o.observes('foo', 'method1'));
    this.assertFalse(o.observes('bar', 'method2'));
  },
  
  testStopObservingWithHash: function() {
    var f1 = function() { };
    var f2 = function() { };
    var events = {
      foo: f1,
      boo: f2
    };
    
    var o = new Observer().on(events);
    
    this.assert(o.observes('foo', f1));
    this.assert(o.observes('boo', f2));
    
    
    o.stopObserving(events);
    
    this.assertFalse(o.observes('foo'));
    this.assertFalse(o.observes('boo'));
    this.assertFalse(o.observes(f1));
    this.assertFalse(o.observes(f2));
  },
  
  testFire: function() {
    var o = new Observer(), e1, e2, e3, o1, o2, o3;
    
    e1 = e2 = e3 = false;
    o1 = o2 = o3 = null;
    
    o.on('foo', function(e) { e1 = e; o1 = this; });
    o.on('foo', function(e) { e2 = e; o2 = this; });
    o.on('bar', function(e) { e3 = e; o3 = this; });
    
    this.assertSame(o, o.fire('foo', 'e'));
    
    this.assertEqual('e', e1);
    this.assertEqual('e', e2);
    this.assertFalse(e3);
    
    // checking that the function were executed in the scope of the observer
    this.assertSame(o, o1);
    this.assertSame(o, o2);
    
    e1 = e2 = e3 = false;
    
    this.assertSame(o, o.fire('bar', 'e'));
    
    this.assertEqual('e', e3);
    this.assertFalse(e1);
    this.assertFalse(e2);
    
    this.assertSame(o, o3);
  },
  
  testListeners: function() {
    var o = new Observer();
    
    var f1 = function() {};
    var f2 = function() {};
    var f3 = function() {};
    
    o.on('foo', f1);
    o.on('foo', f2);
    o.on('bar', f3);
    
    this.assertEqual([f1, f2], o.listeners('foo'));
    this.assertEqual([f3], o.listeners('bar'));
  },
    
  testByNameObserving: function() {
    var o = new Observer();
    
    var args = null, o_this = null;
    o.foo = function() {
      o_this = this;
      args   = $A(arguments);
    };
    
    o.on('bar', 'foo', 1, 2, 3);
    o.fire('bar');
    
    this.assertSame(o, o_this);
    this.assertEqual([1,2,3], args);
  },
  
  testAutoShortcutsGeneration: function() {
    var Klass = new Class(Observer, {
      EVENTS: ['foo', 'bar']
    });
    
    var klass = new Klass();
    this.assert(klass.onFoo);
    this.assert(klass.onBar);
  },
  
  testCamelacedShortcutsGeneration: function() {
    var Klass = new Class(Observer, {
      EVENTS: $w('some_event anotherEvent')
    });
    
    var klass = new Klass();
    
    this.assert(klass.onSomeEvent);
    this.assert(klass.onAnotherEvent);
  },
  
  testAutoShortcutsGeneratorForClass: function() {
    var Klass = new Class(Observer, {
      extend: {
        EVENTS: $w('foo bar')
      }
    });
    
    var klass = new Klass();
    this.assert(klass.onFoo);
    this.assert(klass.onBar);
    
    // checking inheritance support
    var Klass2 = new Class(Klass, {});
    
    var klass = new Klass2();
    this.assert(klass.onFoo);
    this.assert(klass.onBar);
  }
})