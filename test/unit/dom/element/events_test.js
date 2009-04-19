/**
 * The Element unit events related methods test-case
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var ElementEventsTest = TestCase.create({
  name: 'ElementEventsTest',
  
  setUp: function() {
    this.el = new Element('div');
    document.body.appendChild(this.el);
    this.div = document.createElement('div');
    document.body.appendChild(this.div);
  },
  
  tearDown: function() {
    this.el.remove();
    Element.remove(this.div);
  },
  
  _callFor: function(element, name) {
    return element == this.el ? 
      function() {
        var args = $A(arguments), element = args.shift();
        return element[name].apply(element, args);
      } :
      Element[name];
  },
  
  testObserve: function() {
    this.assertObserve(this.el);
  },
  
  testObserve_static: function() {
    this.assertObserve(this.div);
    this.assertNull(this.div['observe'], "should not be wired");
  },
  
  assertObserve: function(element) {
    var wired = false, call = this._callFor(element, 'observe');
    this.assertSame(element, call(element, 'click', function() { wired = true; }));
    this.fireClick(element);
    this.assert(wired);
  },
  
  testObserve_nameVariations: function() {
    this.assertObserve_nameVariations(this.el);
  },
  
  testObserve_nameVariations_static: function() {
    this.assertObserve_nameVariations(this.div);
  },
  
  assertObserve_nameVariations: function(element, call) {
    var call = this._callFor(element, 'observe');
    
    var clicked = false;
    var hovered = false;
    call(element, 'onclick', function() { clicked = true; });
    call(element, 'onMouseOver', function() { hovered = true; });
    
    this.fireClick(element);
    this.fireMouseOver(element);
    
    this.assert(clicked);
    this.assert(hovered);
  },
  
  testObserve_aHash: function() {
    this.assertObserve_aHash(this.el);
  },
  
  testObserve_aHash: function() {
    this.assertObserve_aHash(this.div);
  },
  
  assertObserve_aHash: function(element) {
    var observe = this._callFor(element, 'observe');
    var clicked = false;
    var hovered = false;
    
    this.assertSame(element, observe(element, {
      click:     function() {clicked = true},
      mouseover: function() {hovered = true}
    }));
    
    this.fireClick(element);
    this.fireMouseOver(element);
    
    this.assert(clicked);
    this.assert(hovered);
  },
  
  testObserves: function() {
    this.assertObserves(this.el);
  },
  
  testObserves_static: function() {
    this.assertObserves(this.div);
    this.assertNull(this.div['observes'], "should not be wired");
  },
  
  assertObserves: function(element) {
    var func = function() {},
        observe = this._callFor(element, 'observe'),
        observes = this._callFor(element, 'observes');
        
    observe(element, 'click', func);
    
    this.assert(observes(element, 'click'));
    this.assert(observes(element, 'click', func));
    
    this.assertFalse(observes(element, 'mouseover'));
    this.assertFalse(observes(element, 'click', function() {}));
    
    observe(element, 'mouseover', function() {});
    
    this.assert(observes(element, {
      click: func
    }));
    
    this.assert(observes(element, {
      click: func,
      mouseover: null
    }));
    
    this.assertFalse(observes(element, {
      click: func,
      mousedown: null
    }));
  },
  
  testStopObserving: function() {
    this.assertStopObserving(this.el);
  },
  
  testStopObserving_static: function() {
    this.assertStopObserving(this.div);
    this.assertNull(this.div['stopObserve'], "should not be wired");
  },
  
  assertStopObserving: function(element) {
    var clicked1 = false;
    var clicked2 = false;
    var observe  = this._callFor(element, 'observe');
    var observes = this._callFor(element, 'observes');
    var stopObserving = this._callFor(element, 'stopObserving');
    
    var func1 = function() {clicked1 = true;};
    var func2 = function() {clicked2 = true;};
    
    observe(element, 'click', func1);
    observe(element, 'click', func2);
    
    this.assertSame(element, stopObserving(element, 'click', func1));
    
    this.fireClick(element);
    
    this.assertFalse(clicked1, "didn't call the first function");
    this.assert(clicked2);
    
    this.assertFalse(observes(element, 'click', func1), "Checking by function stop");
    this.assert(observes(element, 'click'));
    
    var clicked1 = false;
    var clicked2 = false;
    
    this.assertSame(element, stopObserving(element, 'click'));
    
    this.fireClick(element);
    
    this.assertFalse(clicked1, "assuring didn't call the first function");
    this.assertFalse(clicked2, "assuring didn't call the second function");
    
    this.assertFalse(observes(element, 'click'), "checking the whole event stop");
  }
});