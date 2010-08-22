/**
 * the dom-load module unit tests
 *
 * Copyright (C) 2009 Nikolay Nemshilov
 */
var win_load_called = false, doc_load_called = false;

$(window).onLoad(function() { win_load_called = true});
$(document).onLoad(function() { doc_load_called = true});


var DomReadyTest = TestCase.create({
  name: 'DomReadyTest',
  
  testObserverExtensions: function() {
    this.assertNotNull('onLoad' in $(window));
    this.assertNotNull('onLoad' in $(document));
  },
  
  testLoadEventHandling: function() {
    var one, two;
    
    $(window).onLoad(function() { one = 1;});
    $(document).onLoad(function() { two = 2;});
    
    $(window).fire('load');
    $(document).fire('load');
    
    this.assertEqual(1, one);
    this.assertEqual(2, two);
  },
  
  testLoadCaptured: function() {
    this.assert(win_load_called);
    this.assert(doc_load_called);
  },
  
  testReadyAlias: function() {
    this.assertNotNull('onReady' in $(window));
    this.assertNotNull('onReady' in $(document));
  }
});