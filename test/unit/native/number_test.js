/**
 * The Number class extentions unit-test
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var NumberTest = TestCase.create({
  name: 'NumberTest',
  
  testTimes: function() {
    var four = $N(4), times = 0;
    
    this.assertSame(four, four.times(function() { times ++; }));
    this.assertEqual(4, times);
  },
  
  testTimesWithScope: function() {
    this.list = [];
    
    $N(4).times(function(i) {
      this.list.push(i);
    }, this);
    
    this.assertEqual([0,1,2,3], this.list);
  },
  
  testAbs: function() {
    this.assert($N(-4).abs() == 4);
  },
  
  testRound: function() {
    this.assert($N(4.4).round() == 4);
    this.assert($N(4.6).round() == 5);
  },
  
  testCeil: function() {
    this.assert($N(4.4).ceil() == 5);
  },
  
  testFloor: function() {
    this.assert($N(4.6).floor() == 4);
  }
});