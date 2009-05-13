= Intro

Generally in JavaScript numbers tends to be treated as types, creating the 
old-school differentiation between objects and types. But in really all the 
numbers are objects too and if you assign a number to a variable you can take 
advantages out of it objective nature. For this purpose RightJS extends the 
Number class with some additional handy methods.

### Number#abs

== Semantic
  abs() -> number absolute value

== Description
  Returns an absolute value of the number

== Example
  (-1).abs(); // 1
  (22).abs(); // 22



### Number#ceil

== Semantic
  ceil() -> number

== Description
  Returns the smallest integer bigger than or equal to the current number

== Example
  (2.2).ceil(); // 3




### Number#floor

== Semantic
  floor() -> number

== Description
  Returns the biggest integer smaller than or equal to the current number

== Example
  (2.2).floor(); // 2



### Number#round

== Semantic
  round() -> number

== Description
  Returns the closest integer number fro the current number

== Example
  (2.2).round(); // 2
  (8.8).round(); // 8




### Number#times

== Semantic
  times(Function lambda[, Object scope]) -> number self

== Description
  Call the given lambda function the number of times equal to the current 
  number

== Example
  var numbers = [];
  (4).times(function(i) {
    numbers.push(i);
  });
  
  numbers; // [0,1,2,3]




### Number#upto

== Semantic
  upto(number stop, Function lambda[, Object scope]) -> number self

== Description
  Iterates the given lambda function from the current number up to the given 
  stop number

== Example
  var numbers = [];
  
  (4).upto(8, function(i) {
    numbers.push(i);
  });
  
  numbers; // [4,5,6,7,8]



### Number#downto

== Semantic
  downto(number end, Function lambda[, Object scope]) -> number self

== Description
  Iterates the given lambda function from the current number down to the given 
  stop number

== Example
  var numbers = [];
  
  (8).downto(4, function(i) {
    numbers.push(i);
  });
  
  numbers; // [8,7,6,5,4]
