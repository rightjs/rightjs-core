/**
 * The Element.Dimensions module tests
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
ElementDimensionsTest = TestCase.create({
  name: 'ElementDimensionsTest',
  
  beforeAll: function() {
    // makes the window scroll down
    this.spoof = new Element('div', {
      style: 'height: 2000px'
    }).insertTo(document.body);
    
    window.scrollTo(0, 100);
  },
  
  setUp: function() {
    this.div = new Element('div', {
      style: {
        width:   '200px',
        height:  '100px',
        margin:  '50px',
        padding: '50px',
        border:  '50px solid transparent'
      }
    }).insertTo(this.spoof, 'before');
    
    // screws with the manual position calculation
    this.p = new Element('p').insertTo(this.spoof, 'before').insert(this.div);
  },
  
  tearDown: function() {
    this.p.remove();
  },
  
  afterAll: function() {
    this.spoof.remove();
    window.scrollTo(0,0);
  },
  
  testSize: function() {
    this.assertEqual({x: 400, y: 300}, this.div.sizes());
  },
  
  testPosition: function() {
    var pos = this.div.position();
    this.assert(pos.x > 50 && pos.x < 70 && pos.y > 50 && pos.y < 100);
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
    this.assert(dims.top > 50);
    this.assert(dims.left > 50);
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
  
  testResize: function() {
    this.assertSame(this.div, this.div.resize(500, 600));
    this.assertEqual({x: 500, y: 600}, this.div.sizes());
    
    this.assertSame(this.div, this.div.resize({x: 444, y: 666}));
    this.assertEqual({x: 444, y: 666}, this.div.sizes());
  },
  
  testMoveTo: function() {
    this.div.setStyle('position: absolute; margin: 0');
    this.assertSame(this.div, this.div.moveTo(40, 40));
    this.assertEqual({x: 40, y: 40}, this.div.position());
  }
});