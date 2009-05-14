/**
 * The Element.Dimensions module tests
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
ElementDimensionsTest = TestCase.create({
  name: 'ElementDimensionsTest',
  
  setUp: function() {
    this.div = new Element('div', {
      style: {
        width:   '200px',
        height:  '100px',
        padding: '50px',
        border:  '50px solid transparent'
      }
    });
    
    document.body.appendChild(this.div);
  },
  
  tearDown: function() {
    document.body.removeChild(this.div);
  },
  
  testSize: function() {
    this.assertEqual({x: 400, y: 300}, this.div.sizes());
  },
  
  testPosition: function() {
    var pos = this.div.position();
    this.assert(pos.x > 0 && pos.y > 0);
  },
  
  testScrolls: function() {
    this.assertEqual({x:0, y:0}, this.div.scrolls());
  },
  
  testDimensions: function() {
    var dims = this.div.dimensions();
    this.assertEqual(400, dims.width);
    this.assertEqual(300, dims.height);
    this.assertEqual(0, dims.scrollLeft);
    this.assertEqual(0, dims.scrollTop);
    this.assert(dims.top > 0);
    this.assert(dims.left > 0);
  },
  
  testSetWidth: function() {
    this.assertSame(this.div, this.div.setWidth(600));
    this.assertEqual(600, this.div.offsetWidth);
    
    this.assertEqual(300, this.div.offsetHeight);
  },
  
  testSetHeight: function() {
    this.assertSame(this.div, this.div.setHeight(600));
    this.assertEqual(600, this.div.offsetHeight);
    
    this.assertEqual(400, this.div.offsetWidth);
  },
  
  testSetSize: function() {
    this.assertSame(this.div, this.div.setSize(500, 600));
    this.assertEqual({x: 500, y: 600}, this.div.sizes());
    
    this.assertSame(this.div, this.div.setSize({x: 444, y: 666}));
    this.assertEqual({x: 444, y: 666}, this.div.sizes());
  },
  
  testSetPosition: function() {
    this.assertSame(this.div, this.div.setPosition(40, 40));
    this.assertEqual({x: 40, y: 40}, this.div.position());
  }
});