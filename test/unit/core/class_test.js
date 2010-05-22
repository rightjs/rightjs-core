/**
 * The Class unit test-case
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var ClassTest = TestCase.create({
  name: 'ClassTest',
  
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
    ['parent', 'extend', 'include'].each(function(key) {
      var klass = new Class();
      var mixin = {};
      mixin[key] = 'replacement for '+key;
      klass.extend(mixin);
      this.assert(!(key in klass) || mixin[key] !== klass[key], "checking the '"+key+"' attribute skipping");
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
  
  testIncludedWithCallback: function() {
    var Klass = new Class().include({
      selfIncluded: function(base) {
        $ext(base, {
          boo: this.message
        });
      },
      message: 'boo boo'
    });
    this.assertEqual('boo boo', Klass.boo);
    this.assertFalse('selfIncluded' in Klass.prototype);
    
    // same for the underscored version
    var Klass = new Class().include({
      self_included: function(base) {
        $ext(base.prototype, {
          boo: this.message
        });
      },
      message: 'boo boo'
    });
    this.assertEqual('boo boo', Klass.prototype.boo);
    this.assertFalse('self_included' in Klass.prototype);
  },
  
  testExtendedWithCallback: function() {
    var Klass = new Class().extend({
      selfExtended: function(base) {
        $ext(base, {
          boo: this.message
        });
      },
      message: 'boo boo'
    });
    this.assertEqual('boo boo', Klass.boo);
    this.assertFalse('selfExtended' in Klass.prototype);
    
    // same for the underscored version
    var Klass = new Class().extend({
      self_extended: function(base) {
        $ext(base.prototype, {
          boo: this.message
        });
      },
      message: 'boo boo'
    });
    this.assertEqual('boo boo', Klass.prototype.boo);
    this.assertFalse('self_extended' in Klass.prototype);
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
  },
  
  testClassInlineExtending: function() {
    var klass = new Class({
      extend: {
        smth: 'something'
      }
    });
    this.assertEqual('something', klass.smth);
    this.assertFalse('extend' in klass.prototype);
  },
  
  testClassInlineExtendingWithSeveralModules: function() {
    var mixin1 = { smth1: 'something 1' };
    var mixin2 = { smth2: 'something 2' };
    var mixin3 = { smth3: 'something 3', smth2: 'something 4' };
    var klass = new Class({
      extend: [mixin1, mixin2, mixin3]
    });
    
    this.assertEqual('something 1', klass.smth1);
    this.assertEqual('something 4', klass.smth2);
    this.assertEqual('something 3', klass.smth3);
  },
  
  testClassInlineIncludes: function() {
    var klass = new Class({
      include: {
        smth: 'something'
      }
    });
    
    this.assertEqual('something', klass.prototype.smth);
    this.assertNotEqual('something', klass['smth']);
  },
  
  testClassInlineIncludingOfSeveralModules: function() {
    var mixin1 = { smth1: 'something 1' };
    var mixin2 = { smth2: 'something 2' };
    var mixin3 = { smth3: 'something 3', smth2: 'something 4' };
    var klass = new Class({
      include: [mixin1, mixin2, mixin3]
    });
    
    this.assertEqual('something 1', klass.prototype.smth1);
    this.assertEqual('something 4', klass.prototype.smth2);
    this.assertEqual('something 3', klass.prototype.smth3);
  },
  
  testClassIncludesByClassPropertiesOverWritting: function() {
    var klass = new Class({
      include: {
        smth: function() { return 'something'; }
      },
      
      smth: function() {
        return 'klass own something';
      }
    });
    
    var obj = new klass();
    this.assertEqual('klass own something', obj.smth());
  },
  
  testInheritance: function() {
    var s_klass = new Class();
    
    var klass = new Class(s_klass);
    this.assertSame(s_klass, klass.parent);
    
    var obj = new klass();
    this.assertInstanceOf(klass, obj);
    this.assertInstanceOf(s_klass, obj);
  },
  
  testInheritanceMethodsOverloading: function() {
    var s_klass = new Class({
      smth: function() { return 's_klass something'; }
    });
    
    var klass = new Class(s_klass);
    this.assertEqual('s_klass something', new klass().smth());
      
    var klass = new Class(s_klass, {
      smth: function() { return 'klass something'; }
    });
    this.assertEqual('klass something', new klass().smth());
    
    var klass = new Class(s_klass, {
      smth: function() { return 'overloaded '+this.$super(); }
    });
    this.assertEqual('overloaded s_klass something', new klass().smth());
  },
  
  
  testMultipleAncestors: function() {
    var A = new Class({
      say: function() { return 'A'; }
    });
    
    var B = new Class(A, {
      say: function() { return 'B' + this.$super(); }
    });
    
    var C = new Class(B, {
      say: function() { return 'C' + this.$super(); }
    });
    
    this.assertEqual([], A.ancestors);
    this.assertEqual([A], B.ancestors);
    this.assertEqual([B, A], C.ancestors);
    
    this.assertEqual('BA', new B().say());
    this.assertEqual('CBA', new C().say());
  },
  
  testPrebindFeature: function() {
    var A = new Class({
      prebind: ['boo'],
      
      value: 'A value',
      
      boo: function() {
        return this.value;
      }
    });
   
    var a = new A(), boo = a.boo;
    
    this.assertEqual(a.value, boo());
  }
});