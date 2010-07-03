/**
 * the dom-ready module unit tests
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var win_ready_called = doc_ready_called = false;

$(window).onReady(function() { win_ready_called = true});
$(document).onReady(function() { doc_ready_called = true});


var DomReadyTest = TestCase.create({
  name: 'DomReadyTest',
  
  testObserverExtensions: function() {
    this.assertNotNull('onReady' in $(window));
    this.assertNotNull('onReady' in $(document));
  },
  
  testReadyEventHandling: function() {
    var one, two;
    
    $(window).onReady(function() { one = 1;});
    $(document).onReady(function() { two = 2;});
    
    $(window).fire('ready');
    $(document).fire('ready');
    
    this.assertEqual(1, one);
    this.assertEqual(2, two);
  },
  
  testReadyCaptured: function() {
    this.assert(win_ready_called);
    this.assert(doc_ready_called);
  }
});