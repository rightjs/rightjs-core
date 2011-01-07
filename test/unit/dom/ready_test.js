/**
 * the dom-ready module unit tests
 *
 * Copyright (C) 2009-2011 Nikolay Nemshilov
 */
var doc_ready_called = false;

$(document).onReady(function() { doc_ready_called = true});


var DomReadyTest = TestCase.create({
  name: 'DomReadyTest',

  testObserverExtensions: function() {
    this.assertNotNull('onReady' in $(document));
  },

  testLoadEventHandling: function() {
    var called;

    $(document).onReady(function() { called = true;});

    $(document).fire('ready');

    this.assert(called);
  },

  testLoadCaptured: function() {
    this.assert(doc_ready_called);
  },

  testReadyAlias: function() {
    this.assertNotNull('onReady' in $(document));
  }
});
