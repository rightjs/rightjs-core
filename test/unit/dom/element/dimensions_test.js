/**
 * The Element.Dimensions module tests
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var ElementDimensionsTest = TestCase.create({
  name: 'ElementDimensionsTest',
  
  beforeAll: function() {
    // makes the window scroll down
    this.spoof = new Element('div', {
      style: 'height: 2000px'
    }).insertTo(document.body, 'top');
    
    window.scrollTo(0, 100);
  },
  
  setUp: function() {
    /**
     * NOTE: document.body has margin and padding set to '5px 10px'
     *       so you'll have +10 and +20 offset for your elements
     */
    this.div = new Element('div', {
      style: {
        width:   '200px',
        height:  '100px',
        margin:  '20px 50px',
        padding: '20px 50px',
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
  
  testDocReference: function() {
    this.assertSame($(document), this.div.doc());
  },
  
  testWinReference: function() {
    this.assertSame($(window), this.div.win());
  },
  
  testSize: function() {
    this.assertEqual({x: 400, y: 240}, this.div.sizes());
  },
  
  testPosition: function() {
    var pos = this.div.position();
    
    this.assertEqual(70, pos.x);
    this.assertEqual(30, pos.y);
  },
  
  testPositionWithRelatives: function() {
    // testing position of relatively positioned element
    var rel = new Element('div', {
      style: {
        position: 'relative',
        top:    '10px',
        left:   '20px',
        width:  '10px',
        height: '10px'
      }
    }).insertTo(this.div, 'top');
    
    var pos = rel.position();
    this.assertEqual(190, pos.x);
    this.assertEqual(110, pos.y);
    
    // testing position of an absolutely positioned element
    var abs = new Element('div', {
      style: {
        position: 'absolute',
        top:    '10px',
        left:   '20px',
        width:  '10px',
        height: '10px'
      }
    }).insertTo(this.div);
    
    var pos = abs.position();
    this.assertEqual(20, pos.x);
    this.assertEqual(10, pos.y);
    
    // testing an element inside a relative positions space
    abs.insertTo(rel);
    var pos = abs.position();
    this.assertEqual(210, pos.x);
    this.assertEqual(120, pos.y);
    
    
    // testing with two nested relative position spaces
    var sub = new Element('div', {
      style: {
        margin: '10px 20px',
        width:  '10px',
        height: '10px'
      }
    }).insertTo(abs);
    
    var pos = sub.position();
    this.assertEqual(230, pos.x);
    this.assertEqual(130, pos.y);
  },
  
  testScrolls: function() {
    this.assertEqual({x:0, y:0}, this.div.scrolls());
  },
  
  testDimensions: function() {
    var dims = this.div.dimensions();
    this.assertEqual(400, dims.width);
    this.assertEqual(240, dims.height);
    this.assertEqual(0, dims.scrollLeft);
    this.assertEqual(0, dims.scrollTop);
    this.assertEqual(30, dims.top);
    this.assertEqual(70, dims.left);
  },
  
  testOverlaps: function() {
    var dims = this.div.dimensions();
    
    this.assert(this.div.overlaps({x: dims.left + 1, y: dims.top + 1}));
    
    this.assertFalse(this.div.overlaps({x: dims.left - 1, y: dims.top + 1}));
    this.assertFalse(this.div.overlaps({x: dims.left + 1, y: dims.top - 1}));
    this.assertFalse(this.div.overlaps({x: dims.left + 1, y: dims.top + dims.height + 1}));
    this.assertFalse(this.div.overlaps({x: dims.left + dims.width + 1, y: dims.top + 1}));
  },
  
  testSetWidth: function() {
    this.assertSame(this.div, this.div.setWidth(600));
    this.assertEqual(600, this.div._.offsetWidth);
    
    this.assertEqual(240, this.div._.offsetHeight);
  },
  
  testSetHeight: function() {
    this.assertSame(this.div, this.div.setHeight(600));
    this.assertEqual(600, this.div._.offsetHeight);
    
    this.assertEqual(400, this.div._.offsetWidth);
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
    
    this.div.insertTo(document.body).moveTo({x: 80, y: 80});
    this.assertEqual({x: 80, y: 80}, this.div.position());
  }
});