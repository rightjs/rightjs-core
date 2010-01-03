# Fx.Slide

Fx.Slide is a basic visual effect to work with the elements sliding. It is
a bidirectional effect, and can work both ways in and out. It also can work in
a toggle mode deciding the direction depending on the element current style.

## Directions

By default this effect will slide the element in/out from/to the top edge of
the element. But, the effect can work with any direction, which you can specify
using the `'direction'` key along with the constructor options. Or you can
define the default value for all the cases at the `Fx.Slide.Options.direction`
variable, which can be one of the following.

* 'top' (default)
* 'left'
* 'right'
* 'bottom'

### #start

    start([String how]) -> Fx.Slide self

Starts the effect. Might take an argument like in/out/toggle

    new Fx.Slide(element).start();
    
    new Fx.Slide(element).start('in');
    new Fx.Slide(element).start('out');