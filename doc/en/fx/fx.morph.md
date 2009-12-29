# Fx.Morph

Fx.Morph is a basic dom-elements morphing visual effect. It can morph
an element from its current state to any end style.

You can specify several keys in your end style, all of them will be processed
simultaneously providing an excellent user experience.

__NOTE__: There's no need to preset the element styles manually before run the
effect, in most of the cases RightJS is smart enough to figure out the initial
styles.

### #start

    start(Object end_style)   -> Fx.Morph self

Starts the effect towards the given style

    new Fx.Morph('element-id').start({
      background: 'yellow',
      fontSize:   '20px'
    });
