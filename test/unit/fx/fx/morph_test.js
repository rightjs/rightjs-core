/**
 * The Fx.Style unit tests
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var FxMorphTest = TestCase.create({
  name: 'FxMorphTest',
  
  setup: function() {
    this.el = $E('div').insertTo(document.body);
    this.fx = new Fx.Morph(this.el);
    this.fx.startTimer = function() { return this; };
  },
  
  tearDown: function() {
    this.el.remove();
  },
  
  testStylesCalculation: function() {
    this.fx.start();
    
    this.assertEqual({}, this.fx.before);
    this.assertEqual({}, this.fx.after);
    
    this.fx.start({
      height: '100px',
      color: '#FFF'
    });
    
    this.assertEqual([0], this.fx.before.height);
    this.assertEqual([0,0,0], this.fx.before.color);
    
    this.assertEqual([100], this.fx.after.height);
    this.assertEqual([255,255,255], this.fx.after.color);
    
    this.fx.start({
      position: 'relative',
      left: '-100px'
    });
    
    this.assertEqual([-100], this.fx.after.left);
    this.assertEqual([0], this.fx.before.left);
  },
  
  testNamedColorsRecognition: function() {
    this.el.style.color = 'black';
    this.fx.start({
      color: 'yellow'
    });
    
    this.assertEqual([0,0,0], this.fx.before.color);
    this.assertEqual([255, 255, 0], this.fx.after.color);
  },
  
  testDashedKeysHandling: function() {
    this.el.style.backgroundColor = '#FFF';
    this.fx.start({'background-color': '#DDD'});
    
    this.assertEqual([255, 255, 255], this.fx.before.backgroundColor);
    this.assertEqual([221, 221, 221], this.fx.after.backgroundColor);
  },
  
  testBorderSettingUp: function() {
    this.fx.start({border: '10px solid green'});
    
    this.assertEqual('0px', this.el.getStyle('borderTopWidth'));
    this.assertEqual('solid', this.el.getStyle('borderTopStyle'));
  }
})