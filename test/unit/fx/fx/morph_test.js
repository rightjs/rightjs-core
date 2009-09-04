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
    
    this.assertEqual({}, this.fx.startStyle);
    this.assertEqual({}, this.fx.endStyle);
    
    this.fx.start({
      height: '100px',
      color: '#FFF'
    });
    
    this.assertEqual({height: [100, 'px'], color: [255,255,255]}, this.fx.endStyle);
    this.assertEqual({height: [0,   'px'], color: [0,0,0]}, this.fx.startStyle);
    
    this.fx.start({
      position: 'relative',
      left: '-100px'
    });
    
    this.assertEqual({left: [-100, 'px']}, this.fx.endStyle);
    this.assertEqual({left: [0, 'px']}, this.fx.startStyle);
  },
  
  testNamedColorsRecognition: function() {
    this.el.style.color = 'black';
    this.fx.start({
      color: 'yellow'
    });
    
    this.assertEqual({color: [0,0,0]}, this.fx.startStyle);
    this.assertEqual({color: [255, 255, 0]}, this.fx.endStyle);
  },
  
  testDashedKeysHandling: function() {
    this.el.style.backgroundColor = '#FFF';
    this.fx.start({'background-color': '#DDD'});
    
    this.assertEqual({backgroundColor: [255, 255, 255]}, this.fx.startStyle);
    this.assertEqual({backgroundColor: [221, 221, 221]}, this.fx.endStyle);
  },
  
  testBorderSettingUp: function() {
    this.fx.start({border: '10px solid green'});
    
    this.assertEqual('0px', this.el.getStyle('borderTopWidth'));
    this.assertEqual('solid', this.el.getStyle('borderTopStyle'));
  }
})