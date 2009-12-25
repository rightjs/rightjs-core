/**
 * the Event unit tests
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var EventTest = TestCase.create({
  name: 'EventTest',
  
  testDefaultExtending: function() {
    var mock_event = {mock: 'event'};
    
    this.assertSame(mock_event, Event.ext(mock_event));
    
    for (var key in Event.Methods) {
      this.assertSame(Event.Methods[key], mock_event[key]);
    }
  },
  
  testCustomEvent: function() {
    var event = new Event('custom', {
      foo: 'foo',
      bar: 'bar'
    });
    
    this.assertInstanceOf(Event.Custom, event);
    this.assertEqual('custom', event.type);
    this.assertEqual('foo', event.foo);
    this.assertEqual('bar', event.bar);
  },
  
  testMouseEventW3CExtending: function() {
    var ev = null;
    var element = $E('div').insertTo(document.body).onClick(function(e) { ev = e; });
    this.fireClick(element);
    
    this.assertEqual(1, ev.which);
    this.assertSame(element, ev.target);
    this.assert(ev.pageX !== undefined);
    this.assert(ev.pageY !== undefined);
  },
  
  testOver: function() {
    var event = {
      pageX: 10,
      pageY: 10,
      over:  Event.Methods.over
    };
    
    this.assert(event.over({
      dimensions: function() {
        return {
          left: 0,
          top: 0,
          width: 20,
          height: 20
        };
      }
    }));
    
    this.assertFalse(event.over({
      dimensions: function() {
        return {
          left: 20
        }
      }
    }));
    
    this.assertFalse(event.over({
      dimensions: function() {
        return {
          top: 20
        }
      }
    }));
  }
});