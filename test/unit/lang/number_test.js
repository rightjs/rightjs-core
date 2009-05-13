/**
 * The Number class extentions unit-test
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var NumberTest = TestCase.create({
  name: 'NumberTest',
  
  testTimes: function() {
    var four = 4, times = 0;
    
    this.assertSame(four, four.times(function() { times ++; }));
    this.assertEqual(4, times);
  },
  
  testTimesWithScope: function() {
    this.list = [];
    
    (4).times(function(i) {
      this.list.push(i);
    }, this);
    
    this.assertEqual([0,1,2,3], this.list);
  },
  
  testUpto: function() {
    this.list = [];
    
    (2).upto(8, function(i) {
      this.list.push(i);
    }, this);
    
    this.assertEqual([2,3,4,5,6,7,8], this.list);
  },
  
  testDownto: function() {
    this.list = [];
    
    (8).downto(4, function(i) {
      this.list.push(i);
    }, this);
    
    this.assertEqual([8,7,6,5,4], this.list);
  },
  
  testAbs: function() {
    this.assert((-4).abs() == 4);
  },
  
  testRound: function() {
    this.assert((4.4).round() == 4);
    this.assert((4.6).round() == 5);
  },
  
  testCeil: function() {
    this.assert((4.4).ceil() == 5);
  },
  
  testFloor: function() {
    this.assert((4.6).floor() == 4);
  }
});