/**
 * The Element.Dimensions module tests
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
ElementDimensionsTest = TestCase.create({
  name: 'ElementDimensionsTest',
  
  setUp: function() {
    this.div = document.createElement('div');
    this.div.style.width = '200px';
    this.div.style.height = '100px';
    this.div.style.padding = '50px';
    this.div.style.border  = '50px solid transparent';
    
    document.body.appendChild(this.div);
  },
  
  tearDown: function() {
    document.body.removeChild(this.div);
  },
  
  testWidth: function() {
    this.assertEqual(400, Element.width(this.div));
    this.assertNull(this.div['width']);
    this.assertEqual(400, $(this.div).width());
  },
  
  testHeight: function() {
    this.assertEqual(300, Element.height(this.div));
    this.assertNull(this.div['height']);
    this.assertEqual(300, $(this.div).height());
  },
  
  testTop: function() {
    this.assert(Element.top(this.div) > 0);
    this.assertNull(this.div['top']);
    this.assert($(this.div).top() > 0);
  },
  
  testLeft: function() {
    this.assert(Element.left(this.div) > 0);
    this.assertNull(this.div['left']);
    this.assert($(this.div).left() > 0);
  },
  
  testSize: function() {
    this.assertEqual({x: 400, y: 300}, Element.size(this.div));
    this.assertNull(this.div['size']);
    this.assertEqual({x: 400, y: 300}, $(this.div).size());
  },
  
  testPosition: function() {
    var pos = Element.position(this.div);
    this.assert(pos.x > 0 && pos.y > 0);
    this.assertNull(this.div['position']);
    var pos = $(this.div).position();
    this.assert(pos.x > 0 && pos.y > 0);
  },
  
  testScrolls: function() {
    this.assertEqual({x:0, y:0}, Element.scrolls(this.div));
    this.assertNull(this.div['scrolls']);
    this.assertEqual({x:0, y:0}, $(this.div).scrolls());
  },
  
  testDimensions: function() {
    var dims = Element.dimensions(this.div);
    this.assertEqual(400, dims.width);
    this.assertEqual(300, dims.height);
    this.assertEqual(0, dims.scrollLeft);
    this.assertEqual(0, dims.scrollTop);
    this.assert(dims.top > 0);
    this.assert(dims.left > 0);
  },
  
  testSetWidth: function() {
    this.assertSame(this.div, Element.setWidth(this.div, 500));
    this.assertEqual(500, Element.width(this.div));
    this.assertNull(this.div['setWidth']);
    
    this.assertSame(this.div, $(this.div).setWidth(600));
    this.assertEqual(600, this.div.width());
    
    this.assertEqual(300, this.div.height());
  },
  
  testSetHeight: function() {
    this.assertSame(this.div, Element.setHeight(this.div, 500));
    this.assertEqual(500, Element.height(this.div));
    this.assertNull(this.div['setHeight']);
    
    this.assertSame(this.div, $(this.div).setHeight(600));
    this.assertEqual(600, this.div.height());
    
    this.assertEqual(400, this.div.width());
  },
  
  testSetSize: function() {
    this.assertSame(this.div, Element.setSize(this.div, 600, 500));
    this.assertEqual({x: 600, y: 500}, Element.size(this.div));
    this.assertNull(this.div['setSize']);
    
    this.assertSame(this.div, $(this.div).setSize(500, 600));
    this.assertEqual({x: 500, y: 600}, this.div.size());
    
    this.assertSame(this.div, this.div.setSize({x: 444, y: 666}));
    this.assertEqual({x: 444, y: 666}, this.div.size());
  },
  
  testSetPosition: function() {
    this.assertSame(this.div, Element.setPosition(this.div, 40, 40));
    this.assertEqual({x: 40, y: 40}, Element.position(this.div));
    this.assertNull(this.div['setPosition']);
  }
});