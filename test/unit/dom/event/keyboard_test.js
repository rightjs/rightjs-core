var EventKeyboardTest = TestCase.create({
  name: 'EventKeyboardTest',
  
  testExt: function() {
    var mock_event = { mock: 'event' };
    
    this.assertSame(mock_event, Event.Keyboard.ext(mock_event));
    
    this.assertNotNull(mock_event.isBackspace);
    this.assertNotNull(mock_event.isTab);
    this.assertNotNull(mock_event.isEnter);
    this.assertNotNull(mock_event.isEscape);
    this.assertNotNull(mock_event.isSpace);
    this.assertNotNull(mock_event.isPageUp);
    this.assertNotNull(mock_event.isPageDown);
    this.assertNotNull(mock_event.isEnd);
    this.assertNotNull(mock_event.isHome);
    this.assertNotNull(mock_event.isLeft);
    this.assertNotNull(mock_event.isUp);
    this.assertNotNull(mock_event.isRight);
    this.assertNotNull(mock_event.isDown);
    this.assertNotNull(mock_event.isInsert);
    this.assertNotNull(mock_event.isDelete);
  }
})