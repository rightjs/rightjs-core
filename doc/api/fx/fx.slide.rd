= Intro

Fx.Slide is the basic visual effect to work with the elements sliding. It is
a bidirectional effect and it can work both ways in and out. And it can work
automatically deciding the direction depends on the element state.

== Directions
By default the effect will slide the element in/out from/to the top edge of
the element. But the effect can work from any direction, you can specify the
<tt>'direction'</tt> key along with the constructor options or you can
define the default value for all the cases at the 
<tt>Fx.Slide.Options.direction</tt> variable. It can be one of the following.

 * 'top' (default)
 * 'left'
 * 'right'
 * 'bottom'

### Fx.Slide#start

== Semantic
  start([String how]) -> Fx.Slide self

== Description
  Starts the effect. Might take the following arguments

    * 'in'
    * 'out'
    * 'toggle' (default)

== Example
  new Fx.Slide(element).start();

  new Fx.Slide(element).start('in');
  new Fx.Slide(element).start('out');