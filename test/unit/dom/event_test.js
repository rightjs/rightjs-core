/**
 * the Event unit tests
 *
 
 */
var EventTest = TestCase.create({
  name: 'EventTest',
  
  testReInstanceEvent: function() {
    var mock_event = {mock: 'event'};
    
    this.assertCalled(Event, 'ext', function() {
      var event = new Event(mock_event);
    });
    
    this.assertSame(mock_event, new Event(mock_event));
  },
  
  testDefaultExtending: function() {
    var mock_event = {mock: 'event'};
    
    this.assertCalled([
      [Event.Base,  'ext']  // should apply the basic extensions
    ], function() {
      this.assertSame(mock_event, Event.ext(mock_event));
    }, this);
    
    // should not apply the keyboard or mouse extensions by default
    this.assertNotCalled([
      [Event.Keyboard, 'ext'],
      [Event.Mouse, 'ext']
    ], function() {
      Event.ext({mock: 'event'});
    });
  },
  
  testMouseEventsExtending: function() {
    var mock_event = { mock: 'event', type: 'click' };
    
    this.assertCalled([
      [Event.Base,  'ext'],
      [Event.Mouse, 'ext']
    ], function() {
      this.assertSame(mock_event, Event.ext(mock_event));
    }, this);
    
    // should not call the mouse extentions on the keyboard events
    this.assertNotCalled(Event.Keyboard, 'ext', function() {
      Event.ext({ mock: 'event', type: 'click' });
    });
  },
  
  testKeyboardEventsExtending: function() {
    var mock_event = { mock: 'event', keyCode: Event.KEYS.ENTER };
    
    this.assertCalled([
      [Event.Base,     'ext'],
      [Event.Keyboard, 'ext']
    ], function() {
      this.assertSame(mock_event, Event.ext(mock_event));
    }, this);
    
    // should not call the mouse extentions on the keyboard events
    this.assertNotCalled(Event.Mouse, 'ext', function() {
      Event.ext({ mock: 'event', keyCode: Event.KEYS.ENTER });
    });
  },
  
  testMouseEventInstance: function() {
    for (var i=0; i < Event.Mouse.prototype.NAMES.length; i++) {
      var event_name = Event.Mouse.prototype.NAMES[i];
      
      this.assertCalled([
        [Event.Base,  'ext'], // should apply the basic extensions
        [Event.Mouse, 'ext']  // should call the mouse extentions
      ], function() {
        this.event = new Event(event_name);
      }, this);
      
      if (this.util.Browser.IE) {
        if (event_name == 'rightclick') {
          event_name = 'contextmenu';
        }
        event_name = 'on'+event_name;
      }
      
      this.assertEqual(event_name, this.event.type);
    }
  },
  
  testKeyboardEventInstance: function() {
    for (var i=0; i < Event.Keyboard.prototype.NAMES.length; i++) {
      var event_name = Event.Keyboard.prototype.NAMES[i];
      
      this.assertCalled([
        [Event.Base,     'ext'], // should apply the basic extensions
        [Event.Keyboard, 'ext']  // should call the keyboard extensions
      ], function() {
        this.event = new Event(event_name);
      }, this);
    }
  },
  
  testWrongEventTypeInstance: function() {
    this.assertThrows(String, function() {
      var event = new Event('undefined type');
    });
  },
  
  testInstanceWithOptions: function() {
    var event = new Event('click', {
      altKey: true,
      ctrlKey: true,
      shiftKey: true
    });
    
    this.assert(event.altKey);
    this.assert(event.ctrlKey);
    this.assert(event.shiftKey);
  }
});