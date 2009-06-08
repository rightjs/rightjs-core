/**
 * the dom-ready module unit tests
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var DomReadyTest = TestCase.create({
  name: 'DomReadyTest',
  
  testObserverExtensions: function() {
    this.assertNotNull(window.onReady);
    this.assertNotNull(document.onReady);
  },
  
  testReadyEventHandling: function() {
    var one, two;
    
    window.onReady(function() { one = 1;});
    document.onReady(function() { two = 2;});
    
    window.ready();
    document.ready();
    
    this.assertEqual(1, one);
    this.assertEqual(2, two);
  }
})