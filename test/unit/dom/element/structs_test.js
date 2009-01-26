/**
 * The Element class structures related module functionality test
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var ElementStructsTest = TestCase.create({
  name: 'ElementStructsTest',
  
  setUp: function() {
    this.el = new Element('div');
  },
  
  testParent: function() {
    
  },
  
  testRemove: function() {
    document.body.appendChild(this.el);
    this.assertSame(document.body, this.el.parentNode);
    this.assertCalled(document.body, 'removeChild', function() {
      this.assertSame(this.el, this.el.remove());
    }, this);
  }
  
});