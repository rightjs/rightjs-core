/**
 * The Fx unit tests
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var FxTest = TestCase.create({
  name: 'FxTest',

  testInstanceDefaults: function() {
    var fx = new Fx();

    this.assertEqual(Fx.Options.fps, fx.options.fps);
    this.assertEqual('normal',       fx.options.duration);
    this.assertEqual('default',      fx.options.transition);
  },

  testInstanceWithOptions: function() {
    var el = $E('div');
    var fx = new Fx(el, {
      fps: 20,
      duration: 500,
      transition: 'Exp'
    });

    this.assertSame(el, fx.element);

    this.assertEqual(20, fx.options.fps);
    this.assertEqual(500, fx.options.duration);
    this.assertEqual('Exp', fx.options.transition);
  },

  testTransitions: function() {
    for (var name in Fx.Transitions) {
      for (var i=0; i <= 1; i+= 0.02)
        this.assert(Fx.Transitions[name](i) <= 1, "Assert '"+name+"' for "+i);
    }
  }
})
