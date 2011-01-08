/**
 * The artificaial events bubbling feature test
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var EventBubblingTest = TestCase.create({
  name: 'EventBubblingTest',

  testBubbling: function() {
    var e1 = new Element('div', {id: 'div-1'});
    var e2 = new Element('div', {id: 'div-2'});
    var e3 = new Element('div', {id: 'div-3'});

    e1.insert(e2.insert(e3));

    var event_1   = null;
    var event_2   = null;
    var event_3   = null;
    var target_1  = null;
    var target_2  = null;
    var target_3  = null;
    var current_1 = null;
    var current_2 = null;
    var current_3 = null;

    e1.on('click', function(event) { event_1 = event; target_1 = event.target; current_1 = event.currentTarget; });
    e2.on('click', function(event) { event_2 = event; target_2 = event.target; current_2 = event.currentTarget; });
    e3.on('click', function(event) { event_3 = event; target_3 = event.target; current_3 = event.currentTarget; });

    e3.fire('click');

    this.assertNotNull(event_3, "checking that the event was fired");
    this.assertInstanceOf(RightJS.Event, event_3, "checking that the event was wrapped");

    this.assert(
      event_1 === event_2 && event_2 === event_3,
      "checking that it was the same event object all the time"
    );

    // checking we had correct target element in all three cases
    this.assertSame(e3, target_1);
    this.assertSame(e3, target_2);
    this.assertSame(e3, target_3);

    // checking that the 'currentTarget' stayed the same during the bubble
    this.assertSame(e3, current_1);
    this.assertSame(e3, current_2);
    this.assertSame(e3, current_3);
  },

  testStopBubbling: function() {
    var e1 = new Element('div', {id: 'div-1'});
    var e2 = new Element('div', {id: 'div-2'});
    var e3 = new Element('div', {id: 'div-3'});

    e1.insert(e2.insert(e3));

    var event_1   = null;
    var event_2   = null;
    var event_3   = null;
    var event_4   = null;

    e1.on('click', function(event) { event_1 = event; });
    e2.on('click', function(event) { event_2 = event; event.stop(); });
    e2.on('click', function(event) { event_3 = event; });
    e3.on('click', function(event) { event_4 = event; });

    e3.fire('click');

    this.assertNull(event_1);

    this.assertNotNull(event_2);
    this.assertNotNull(event_3);
    this.assertNotNull(event_4);
  },

  testBubblingOff: function() {
    var e1 = new Element('div', {id: 'div-1'});
    var e2 = new Element('div', {id: 'div-2'});
    var e3 = new Element('div', {id: 'div-3'});

    e1.insert(e2.insert(e3));

    var event_1   = null;
    var event_2   = null;
    var event_3   = null;

    e1.on('click', function(event) { event_1 = event; });
    e2.on('click', function(event) { event_2 = event; });
    e3.on('click', function(event) { event_3 = event; });

    e3.fire('click', {bubbles: false});

    this.assertNull(event_1);
    this.assertNull(event_2);

    this.assertNotNull(event_3);
  }
});
