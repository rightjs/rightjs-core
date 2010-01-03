# Fx.Highlight

Fx.Highlight is a standard elements highlighting visual effect.

## Default Color

By default the highlighting color is yellow, but you can specify your own
default color by assigning the `Fx.Highlight.Options.color` variable.


### #start

    start([String highlight_color[, String end_color]]) -> Fx self

Starts the element highlighting effect, might take the highlight and final
color arguments

    var fx = new Fx.Highlight('element');
    
    fx.start();
    fx.start('blue');
    fx.start('blue', 'pink');