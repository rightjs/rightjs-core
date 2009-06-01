= Intro

Fx.Fade is the basic opacity visual effect. It is a bidirectional effect and
it can work both ways in and out. And it can work automatically (by default)
deciding the direction depends on the element state.

### Fx.Fade#start

== Semantic
  start([String how]) -> Fx.Fade self

== Description
  Starts the effect. Might take the following arguments
  
    * 'in'
    * 'out'
    * 'toggle' (default)
  
== Example
  new Fx.Fade(element).start();
  
  new Fx.Fade(element).start('in');
  new Fx.Fade(element).start('out');