/**
 * The dom features test
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
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
    
    this.assertSame(el, RightJS.$(el));
    
    this.assert('set' in el);
  },
  
  testFindById: function() {
    var el = RightJS.$('test-div');
    
    this.assertSame(this.el, el, "checking if we found the same element");
    this.assert('set' in el, "check if it was extended");
  },
  
  testFindByCss: function() {
    var els = RightJS.$$('#test-div div.one div');
    
    this.assert(els instanceof RightJS.Array);
    this.assertEqual(3, els.length);
    this.assertEqual(['two', 'three', 'four'], [].concat(els.map('innerHTML')));
  }
});