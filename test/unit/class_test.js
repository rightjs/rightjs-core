/**
 * The Class unit test-case
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var ClassTest = TestCase.create({
  name: 'ObjectTest',
  
  testNew: function() {
    var klass = new Class();
    this.assertTypeOf('function', klass);
    this.assertNotNull(klass.prototype);
    this.assertSame(klass, klass.prototype.constructor);
  },
  
  testClassExtend: function() {
    var klass = new Class();
    this.assertSame(klass, klass.extend({
      something1: 1, something2: 2
    }));
    this.assertEqual(1, klass.something1);
    this.assertEqual(2, klass.something2);
    
    klass.extend({something2: 3}, {something3: 4}, {something4: 2});
    this.assertEqual(3, klass.something2);
    this.assertEqual(4, klass.something3);
    this.assertEqual(2, klass.something4);
  },
  
  testClassExtendPrototypeSkipping: function() {
    var klass = new Class();
    var klass2 = new Class();
    klass.extend(klass2);
    this.assertNotSame(klass2.prototype, klass.prototype);
  },
  
  testClassExtendKeyAttributesSkipping: function() {
    ['name', 'parent', 'extend', 'include'].forEach(function(key) {
      var klass = new Class();
      var mixin = {};
      mixin[key] = 'replacement for '+key;
      klass.extend(mixin);
      this.assertNotEqual(mixin[key], klass[key], "checking the '"+key+"' attribute skipping");
    }, this);
  },
    
  testClassInclude: function() {
    var klass = new Class();
    this.assertSame(klass, klass.include({
      something1: 1, something2: 2
    }));
    this.assertEqual(1, klass.prototype.something1);
    this.assertEqual(2, klass.prototype.something2);
    
    klass.include({something2: 3}, {something3: 4}, {something4: 2});
    this.assertEqual(3, klass.prototype.something2);
    this.assertEqual(4, klass.prototype.something3);
    this.assertEqual(2, klass.prototype.something4);
  },
  
  testClassIncludeKlassSkipping: function() {
    var klass = new Class();
    klass.include({
      'klass': 'replacement'
    });
    
    this.assertNotEqual('replacement', klass.prototype['klass']);
  },
  
  testNewWithConstructor: function() {
    var klass = new Class({
      initialize: function(value) {
        this._initialized = value;
      }
    });
    this.assertNotNull(klass.prototype.initialize);
    
    var obj = new klass('some value');
    this.assertInstanceOf(klass, obj);
    this.assertEqual('some value', obj._initialized);
  }
});