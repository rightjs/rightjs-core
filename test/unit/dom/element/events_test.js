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
  },
  
  tearDown: function() {
    this.el.remove();
  },

  testObserve: function() {
    var wired = false, context = null;
    this.assertSame(this.el, this.el.observe('click', function() { wired = true; context = this; }));
    this.fireClick(this.el);
    this.assert(wired);

    this.assertSame(this.el, context);
  },
  
  testObserve_nameVariations: function() {
    var clicked = false;
    var hovered = false;
    this.el.observe('onclick', function() { clicked = true; });
    this.el.observe('onMouseOver', function() { hovered = true; });
    
    this.fireClick(this.el);
    this.fireMouseOver(this.el);
    
    this.assert(clicked);
    this.assert(hovered);
  },
  
  testObserve_aHash: function() {
    var clicked = false;
    var hovered = false;
    
    this.assertSame(this.el, this.el.observe({
      click:     function() {clicked = true},
      mouseover: function() {hovered = true}
    }));
    
    this.fireClick(this.el);
    this.fireMouseOver(this.el);
    
    this.assert(clicked);
    this.assert(hovered);
  },
  
  testObserves: function() {
    var func = function() {}
        
    this.el.observe('click', func);
    
    this.assert(this.el.observes('click'));
    this.assert(this.el.observes('click', func));
    
    this.assertFalse(this.el.observes('mouseover'));
    this.assertFalse(this.el.observes('click', function() {}));
    
    this.el.observe('mouseover', function() {});
  },
  
  testStopObserving: function() {
    var clicked1 = false;
    var clicked2 = false;
    
    var func1 = function() {clicked1 = true;};
    var func2 = function() {clicked2 = true;};
    
    this.el.observe('click', func1);
    this.el.observe('click', func2);
    
    this.assertSame(this.el, this.el.stopObserving('click', func1));
    
    this.fireClick(this.el);
    
    this.assertFalse(clicked1, "didn't call the first function");
    this.assert(clicked2);
    
    this.assertFalse(this.el.observes('click', func1), "Checking by function stop");
    this.assert(this.el.observes('click'));
    
    var clicked1 = false;
    var clicked2 = false;
    
    this.assertSame(this.el, this.el.stopObserving('click'));
    
    this.fireClick(this.el);
    
    this.assertFalse(clicked1, "assuring didn't call the first function");
    this.assertFalse(clicked2, "assuring didn't call the second function");
    
    this.assertFalse(this.el.observes('click'), "checking the whole event stop");
  },
  
  testFire: function() {
    var clicked = false, event = null;
    this.el.observe('click', function(e) { event = e; clicked = true; });
    
    this.assertSame(this.el, this.el.fire('click'));
    
    this.assert(clicked);
    this.assert('click', event.type);
  },
  
  testFireWithStop: function() {
    var e1 = e2 = false;
    
    this.el.observe('click', function(e) { e1 = e; e.stop(); });
    this.el.observe('click', function(e) { e2 = e; });
    
    this.el.fire('click');
    
    this.assert(e1);
    this.assert(e2);
  },
  
  testFireArgumentsByPassing: function() {
    var args, event;
    
    this.el.observe('click', function(e) { event = e; args = arguments; }, 1, 2);
    this.el.fire('click', {a:3, b:4}, 5, 6);
    
    this.assertSame(event, args[0]);
    this.assertEqual([1,2,5,6], $A(args).slice(1));
  },
  
  testShortcuts: function() {
    $w('click contextmenu mousedown mouseup mouseover mouseout mousemove keypress keydown keyup').each(function(event) {
      var submitted = false;
      
      this.el['on'+event.capitalize()](function() { submitted = true; })[event]();
      
      this.assert(submitted, "testing event: "+event);
    }, this);
  },
  
  testStopEvent: function() {
    this.assert(typeof(this.el.stopEvent) == 'function');
  },
  
  testEventByNameCalls: function() {
    var add_class_args;
    var remove_class_args;
    var stop_event_args;
    
    this.el.addClass    = function() { add_class_args    = $A(arguments); };
    this.el.removeClass = function() { remove_class_args = $A(arguments); };
    this.el.stopEvent   = function() { stop_event_args   = $A(arguments); };
    
    this.el.on('mouseover', 'addClass', 'test-class');
    this.el.on('mouseout', 'removeClass', 'test-class');
    this.el.on('click', 'stopEvent');
    
    this.fireMouseOver(this.el);
    this.fireMouseOut(this.el);
    this.fireClick(this.el);
    
    this.assertEqual(['test-class'], add_class_args);
    this.assertEqual(['test-class'], remove_class_args);
    this.assertEqual(1, stop_event_args.length);
    this.assertEqual("click", stop_event_args[0].type);
    
  }
});