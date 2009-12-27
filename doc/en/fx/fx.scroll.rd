= Intro

Fx.Scroll is a smooth scrolling visual effect for elements with the 'overflow' style.


### Fx.Scroll#start

== Semantic
  start(Object {x:N, y:N}) -> Fx self

== Description
  Starts the element scrolling effect, you can specify only one direction if you need.

== Example
  var fx = new Fx.Scroll('element');
  
  fx.start({x: 100});
  fx.start({y: 200});
  fx.start({x: 100, y: 200});