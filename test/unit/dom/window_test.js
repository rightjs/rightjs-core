/**
 * The window extensions tests
 *
 * @copyright 2009-2010 Nikolay V. Nemshilov aka St.
 */
var WindowTest = TestCase.create({
  name: 'WindowTest',
  
  beforeAll: function() {
    this.__pos = $(window).scrolls();
    
    this.stretcher = $E('div').insertTo(document.body).setStyle({
      width: '10px', height: '2000px'
    });
  },
  
  afterAll: function() {
    $(window).scrollTo(this.__pos);
    this.stretcher.remove();
  },
  
  testInstance: function() {
    var win = new Window(window);
    
    this.assert(win instanceof RightJS.Window);
    this.assertSame(window, win._);
    
    this.assertSame(win, $(window));
  },
  
  testSizes: function() {
    var width  = window.innerWidth  || document.documentElement.clientWidth;
    var height = window.innerHeight || document.documentElement.clientHeight;
    var sizes = $(window).sizes();
    
    this.assertEqual(width, sizes.x);
    this.assertEqual(height, sizes.y);
  },
  
  testScrolls: function() {
    if (Browser.Konqueror) return;
    
    window.scrollTo(0, 40);
    
    var scrolls = $(window).scrolls();
    
    this.assertEqual(0, scrolls.x);
    this.assertEqual(40, scrolls.y);
  },
  
  testScrollTo: function() {
    if (Browser.Konqueror) return;
    
    this.assertSame($(window), $(window).scrollTo(0, 60));
    
    this.assertEqual(60, $(window).scrolls().y);
  },
  
  testScrollToWithHash: function() {
    if (Browser.Konqueror) return;
    
    this.assertSame($(window), $(window).scrollTo({x: 0, y: 80}));
    
    this.assertEqual(80, $(window).scrolls().y);
  },
  
  testScrollToElement: function() {
    if (Browser.Konqueror) return;
    
    var el = $E('div').setStyle({
      position: 'absolute',
      left: '0px', top: '120px'
    }).insertTo(document.body);
    
    $(window).scrollTo(el);
    
    if (!Browser.WebKit)
      this.assertEqual(el.position().y, $(window).scrolls().y);
    
    el.remove();
  },
  
  testShortcuts: function() {
    this.assertNotNull($(window).onBlur, "test onBlur");
    this.assertNotNull($(window).onFocus, "test onFocus");
    this.assertNotNull($(window).onScroll, "test onScroll");
    this.assertNotNull($(window).onResize, "test onResize");
  }
});