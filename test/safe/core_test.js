/**
 * The core units test
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var CoreTest = TestCase.create({
  name: 'CoreTest',
  
  testRightJS: function() {
    this.assert('RightJS' in window);
    this.assert(typeof(RightJS) == 'function');
  },
  
  testClass: function() {
    this.assert('Class' in RightJS);
    this.assertFalse('Class' in window);
    
    var Klass = new RightJS.Class({
      initialize: function() {
        this.initialized = true;
      },
      
      callMommy: function() {
        this.mommyCalled = true;
      }
    });
    
    var k = new Klass();
    k.callMommy();
    
    this.assert(k.initialized);
    this.assert(k.mommyCalled);
  },
  
  testObserver: function() {
    this.assert('Observer' in RightJS);
    this.assertFalse('Observer' in window);
    
    var result;
    
    new RightJS.Observer()
      .on('boo', function() { result = 'hoo'; })
      .fire('boo');
      
    this.assertEqual('hoo', result);
  },
  
  testOptions: function() {
    this.assert('Options' in RightJS);
    this.assertFalse('Options' in window);
    
    with (RightJS) {
      var Klass = new Class({
        include: Options,
        
        extend: {
          Options: {
            boo: 'boo'
          }
        },
        
        initialize: function(options) {
          this.setOptions(options);
        }
      });
    }
    
    var k = new Klass({
      hoo: 'hoo'
    });
    
    this.assert(k.options);
    this.assertEqual('boo', k.options.boo);
    this.assertEqual('hoo', k.options.hoo);
  },
  
  test$ext: function() {
    this.assert('$ext' in RightJS);
    this.assertFalse('$ext' in window);
    
    this.assertEqual({
      boo: 'boo',
      hoo: 'hoo'
    }, RightJS.$ext({boo: 'boo'}, {hoo: 'hoo'}));
  }
});