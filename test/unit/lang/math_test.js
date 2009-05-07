/**
 * The Math unit test-case
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var MathTest = TestCase.create({
  name: 'MathTest',
  
  testRandomOriginal: function() {
    var fine = true;
    for (var i=0; i < 100; i++) {
      var rand = Math.random();
      fine = fine && rand > 0 && rand < 1;
    }
    this.assert(fine);
  },
  
  testRandomIntegerWithMax: function() {
    var rands = [];
    for (var i=0; i < 100; i++) {
      var rand = Math.random(2);
      rands[rand] = rand;
    }
    this.assertEqual([0, 1, 2], rands);
  },
  
  testRandomIntegerWithMinMax: function() {
    var rands = [null, null];
    for (var i=0; i < 100; i++) {
      var rand = Math.random(2,6);
      rands[rand] = rand;
    }
    this.assertEqual([null,null,2,3,4,5,6], rands);
  }
});