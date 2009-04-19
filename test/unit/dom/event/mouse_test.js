var EventMouseTest = TestCase.create({
  name: 'EventMouseTest',
  
  testExt: function() {
    var mock_event = {mock: 'event'};
    
    this.assertSame(mock_event, Event.Mouse.ext(mock_event));
    
    this.assertNotNull(mock_event.isLeftClick);
    this.assertNotNull(mock_event.isRightClick);
  }
})