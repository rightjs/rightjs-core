/**
 * The Element unit events related methods test-case
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
 */
var ElementEventsTest = TestCase.create({
  name: 'ElementEventsTest',
  
  setUp: function() {
    this.el = $E('div');
    document.body.appendChild(this.el._);
  },
  
  tearDown: function() {
    this.el.remove();
  },

  testObserve: function() {
    var wired = false, context = null, event;
    this.assertSame(this.el, this.el.on('click', function(e) { wired = true; context = this; event = e; }));
    
    this.fireClick(this.el._);
    
    this.assert(wired);
    
    this.assert(event instanceof Event, "the event object should be wrapped in the Event class");

    this.assertSame(this.el, context, "the function should be called in the context of the element");
    this.assertSame(this.el, event.currentTarget, "it should assign the currentTarget property properly");
  },
  
  testObserve_aHash: function() {
    var clicked = false;
    var hovered = false;
    
    this.assertSame(this.el, this.el.on({
      click:     function() {clicked = true},
      mouseover: function() {hovered = true}
    }));
    
    this.fireClick(this.el._);
    this.fireMouseOver(this.el._);
    
    this.assert(clicked);
    this.assert(hovered);
  },
  
  testObserves: function() {
    var func = function() {}
        
    this.el.on('click', func);
    
    this.assert(this.el.observes('click'));
    this.assert(this.el.observes('click', func));
    
    this.assertFalse(this.el.observes('mouseover'));
    this.assertFalse(this.el.observes('click', function() {}));
    
    this.el.on('mouseover', function() {});
  },
  
  testStopObserving: function() {
    var clicked1 = false;
    var clicked2 = false;
    
    var func1 = function() {clicked1 = true;};
    var func2 = function() {clicked2 = true;};
    
    this.el.on('click', func1);
    this.el.on('click', func2);
    
    this.assertSame(this.el, this.el.stopObserving('click', func1));
    
    this.fireClick(this.el._);
    
    this.assertFalse(clicked1, "didn't call the first function");
    this.assert(clicked2);
    
    this.assertFalse(this.el.observes('click', func1), "Checking by function stop");
    this.assert(this.el.observes('click'));
    
    var clicked1 = false;
    var clicked2 = false;
    
    this.assertSame(this.el, this.el.stopObserving('click'));
    
    this.fireClick(this.el._);
    
    this.assertFalse(clicked1, "assuring didn't call the first function");
    this.assertFalse(clicked2, "assuring didn't call the second function");
    
    this.assertFalse(this.el.observes('click'), "checking the whole event stop");
  },
  
  testFire: function() {
    var clicked = false, event = null;
    this.el.on('click', function(e) { event = e; clicked = true; });
    
    this.assertSame(this.el, this.el.fire('click'));
    
    this.assert(clicked);
    this.assert('click', event.type);
  },
  
  testFireWithStop: function() {
    var e1, e2; e1 = e2 = false;
    
    this.el.on('click', function(e) { e1 = e; e.stop(); });
    this.el.on('click', function(e) { e2 = e; });
    
    this.el.fire('click');
    
    this.assert(e1);
    this.assert(e2);
  },
  
  testFireWithListenerByName: function() {
    this.el.on('boo', 'addClass', 'boo-hoo');
    
    this.el.fire('boo');
    
    this.assertEqual('boo-hoo', this.el._.className);
  },
  
  testShortcuts: function() {
    $w('click contextmenu mousedown mouseup mouseover mouseout mousemove keypress keydown keyup').each(function(event) {
      var submitted = false;

      this.el['on'+event.capitalize()](function() { submitted = true; }).fire(event);
      
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
    
    this.fireMouseOver(this.el._);
    this.fireMouseOut(this.el._);
    this.fireClick(this.el._);
    
    this.assertEqual(['test-class'], add_class_args);
    this.assertEqual(['test-class'], remove_class_args);
    this.assertEqual(1, stop_event_args.length);
    this.assertEqual("click", stop_event_args[0].type);
  },
  
  testW3CEventProperties: function() {
    var e = null;
    
    this.el.on('click', function(ev) { e = ev; });
    this.fireClick(this.el._);
    
    this.assertSame(this.el, e.target, "testing target");
    this.assertEqual(1, e.which)
  },
  
  testStoppinEventByReturnFalse: function() {
    var e1, e2; e1 = e2 = false;
    
    this.el.on('click', function(e) { e1 = e; return false; });
    this.el.on('click', function(e) { e2 = e; });
    
    this.fireClick(this.el._);
    
    this.assert(e1);
    this.assert(e2);
    
    this.assert(e1.stopped);
  }
});