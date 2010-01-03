# Fx Element Extensions

There are several shortcuts to initiate visual effects right out
of dom-elements.


### #morph

    morph(Object style[, Object fx_options]) -> Element self

Runs the {Fx.Morph} effect on the element

    $(element).morph({
      width: '200px',
      height: '400px'
    });

### #highlight

    highlight([String color[, String end_color[, Object fx_options]]]) -> Element self
    highlight([String color[, Object fx_options]]) -> Element self
    highlight([Object fx_options])                 -> Element self

Runs the {Fx.Highlight} effect on the element

    $(element).highlight();
    
    $(element).highlight('blue');
    $(element).highlight({onFinish: function() {}});

### #fade

    fade([String how[, Object options]]) -> Element self
    fade([Object options])               -> Element self

Runs the {Fx.Fade} effect on the element

    $(element).fade();
    
    $(element).fade('out');
    $(element).fade('in', {onFinish: function() {}});

### #slide

    slide([String how[, Object fx_options]]) -> Element self
    slide([Object fx_options])               -> Element self

Runs the {Fx.Slide} effect on the element

    $(element).slide();
    
    $(element).slide('out');
    $(element).slide({onFinish: function() {}});


### #scroll

    scroll(Object {x:N, y:N}[, Object options]) -> Element self

Smoothly scrolls to the given position

    $(element).scroll({x: 100});
    $(element).scroll({y: 200});
    $(element).scroll({x: 10, y: 20});
    
    $(element).scroll({x: 100}, {duration: 'long'});
    