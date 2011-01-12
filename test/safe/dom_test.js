/**
 * The dom features test
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var doc_ready = false, win_ready = false;
RightJS.$(document).onReady(function() { doc_ready = true;  });

var DomTest = TestCase.create({
  name: 'DomTest',

  beforeAll: function() {
    this.el = document.createElement('div');
    this.el.id = 'test-div';
    this.el.innerHTML = '' +
      '<div class="one">'+
        '<div class="two">two</div>'+
        '<div class="three">three</div>'+
        '<div class="four">four</div>'+
      '</div>';

    document.body.appendChild(this.el);
  },

  afterAll: function() {
    document.body.removeChild(this.el);
  },

  testExtendingAnElement: function() {
    var el = document.createElement('div');

    this.assertFalse('set' in el);

    this.assert(RightJS.$(el) instanceof RightJS.Element);

    this.assert('set' in RightJS.$(el));
  },

  testFindById: function() {
    var el = RightJS.$('test-div');

    this.assert(el instanceof RightJS.Element);
    this.assertSame(this.el, el._, "checking if we found the same element");
  },

  testFindByCss: function() {
    var els = RightJS.$$('#test-div div.one div');

    this.assert(els instanceof RightJS.Array);
    this.assertEqual(3, els.length);
    this.assertEqual(['two', 'three', 'four'], [].concat(els.map('_').map('innerHTML')));
  },

  testEvents: function() {
    var el = RightJS.$(this.el);

    this.assert('onClick' in el);

    var ev = null;
    el.onClick(function(e) { ev = e; });

    this.fireClick(this.el);

    this.assertNotNull(ev);
    this.assert('stop' in ev);
  },

  testDocumentAccess: function() {
    var doc = RightJS.$(document);

    this.assert(doc instanceof RightJS.Document);
  },

  testWindowAccess: function() {
    var win = RightJS.$(window);

    this.assert(win instanceof RightJS.Window);
  },

  testDocumentReady: function() {
    this.assert(doc_ready);
  }
});
