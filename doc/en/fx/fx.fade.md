# Fx.Fade

Fx.Fade is a basic opacity visual effect. It is a bidirectional effect and
can work both ways in and out. By default it will determine the direction
depends on the element current state.

### #start

    start([String how]) -> Fx.Fade self

Starts the effect. Might take the following arguments
  
* 'in'
* 'out'
* 'toggle'

'toggle' is the default value

    new Fx.Fade(element).start();
    
    new Fx.Fade(element).start('in');
    new Fx.Fade(element).start('out');