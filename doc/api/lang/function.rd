= Intro

Along with the other basic native units, RightJS extends the Function unit to provide some pretty much standard functionality like binding, working with timeouts etc.

### Function#bind

== Semantic
  bind(Object scope[, argument,...]) -> Function new

== Description
  Binds the function to be executed in a different context. Additionally can take optional curry arguments

== Example
  var object = {
    attr: 'value'
  };
  var func = function(arg1, arg2) {
    return this.attr + ': '+arg1 + ': '+ arg2;
  };
  
  var bind = func.bind(object, 'argument1');
  
  var result = bind('argument2');
  
  // -> 'value: argument1: argument2'


### Function#bindAsEventListener

== Semantic
  bindAsEventListener(Object scope[, argument, ...]) -> Function new

== Description
  Binds the function to the given scope the way that it was handled the first argument as an event

== Example
  var object = {
    attr: 'value'
  };
  var func = function(event, arg1, arg2) {
    return this.attr +' > '+ event.eventName +' > '+ arg1 +' > '+ arg2;
  };
  
  var observer = new Observer();
  observer.observe('foo', func.bindAsEventListener('argument1', 'argument2'));
  observer.fire('foo');
  
  // -> 'value > foo > argument1 > argument2'



### Function#curry

== Semantic
  curry(mixed value[, mixed value, ...]) -> Function new

== Description
  Standard functional approach currying feature

== Example
  var multiplier = function(x, y) {
    return x * y
  };
  var double = multiplier.curry(2);
  
  double(2); // 4
  double(4); // 8
  double(8); // 16



### Function#delay

== Semantic
  delay(Integer timeout) -> Integer timeout marker

== Description
  Schedules a delayed execution for the function.

== Example
  var func = function() {
    alert('boo');
  };
  
  var timeout = func.delay(2000);
  
  // should see the boo in 2 seconds
  // you can cancel the delayed execution
  
  window.clearTimeout(timeout);



### Function#periodical

== Semantic
  periodical(Integer timeout) -> Integer timeout marker

== Description
  Makes the function be periodically executed with the given timeout

== Example
  var func = function() {
    // check something
  };
  
  var marker = func.periodical(4000);
  
  // now the function will get executed every 4 seconds
  // to stop it just pass it to the standard clearInterval method
  
  window.clearInterval(marker);


