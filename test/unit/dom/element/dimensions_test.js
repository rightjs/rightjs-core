/**
 * The Element.Dimensions module tests
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var ElementDimensionsTest = TestCase.create({
  name: 'ElementDimensionsTest',
  
  E: function(tag, options) {
    // creating an element in the scope of the working frame
    var element = new Element(tag, options);
    element._ = this.doc.createElement(tag);
    if (options && options.style) {
      for (var key in options.style) {
        element._.style[key] = options.style[key];
      }
    }
    
    return element;
  },
  
  beforeAll: function() {
    var id = 'dimensions_checks_iframe';
    
    this.frame_block = $E('div').insertTo(document.body)
      .update('<iframe name="'+id+'" id="'+id+
        '" width="1" height="0" frameborder="0" src="about:blank"></iframe>'
    );
    
    var win = this.win = window.frames[id],
        doc = this.doc = win.document;
    
    doc.open();
    doc.write('<!DOCTYPE html><html><body><style>'+
      'html{margin:0;           padding:0}'+
      'body{margin:  5px 10px;  padding: 5px 10px;}'+
      'body{*margin:10px 20px; *padding: 0;}'+
    '</style></body></html>');
    doc.close();
    
    // makes the window scroll down
    this.spoof = this.E('div', {
      style: 'height: 2000px'
    }).insertTo(doc.body, 'top');
    
    win.scrollTo(0, 100);
  },
  
  afterAll: function() {
//    this.spoof.remove();
//    this.frame_block.remove();
  },
  
  setUp: function() {
    /**
     * NOTE: document.body has margin and padding set to '5px 10px'
     *       so you'll have +10 and +20 offset for your elements
     */
    this.div = this.E('div', {
      style: {
        width:   '200px',
        height:  '100px',
        margin:  '20px 50px',
        padding: '20px 50px',
        border:  '50px solid transparent'
      }
    }).insertTo(this.spoof, 'before');
    
    // screws with the manual position calculation
    this.p = this.E('p').insertTo(this.spoof, 'before').insert(this.div);
  },
  
  tearDown: function() {
    this.div.remove();
    this.p.remove();
  },
  
  testDocReference: function() {
    this.assertSame($(this.doc), this.div.doc());
  },
  
  testWinReference: function() {
    this.assertSame($(this.win), this.div.win());
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
    var rel = this.E('div', {
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
    var abs = this.E('div', {
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
    var sub = this.E('div', {
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
    
    this.div.insertTo(this.doc.body).moveTo({x: 80, y: 80});
    this.assertEqual({x: 80, y: 80}, this.div.position());
  }
});