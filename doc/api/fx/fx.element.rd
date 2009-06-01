= Intro

RightJS along with the visual effects package provides some handy shortcuts
to run the effects directly from the html-element instances.

### morph

== Semantic
  morph(Object style[, Object fx_options]) -> Element self

== Description
  Runs the Fx.Morph effect on the element

== Example
  $(element).morph({
    width: '200px',
    height: '400px'
  });
  
  $(element).morph('class-name');
  $(element).morph('class1 class2', {onFinish: function() {}});

### highlight

== Semantic
  highlight([String color[, String end_color[, Object fx_options]]]) -> Element self
  highlight([String color[, Object fx_options]]) -> Element self
  highlight([Object fx_options])                 -> Element self

== Description
  Runs the Fx.Highlight effect on the element

== Example
  $(element).highlight();
  
  $(element).highlight('blue');
  $(element).highlight({onFinish: function() {}});

### fade

== Semantic
  fade([String how[, Object options]]) -> Element self
  fade([Object options])               -> Element self

== Description
  Runs the Fx.Fade effect on the element

== Example
  $(element).fade();
  
  $(element).fade('out');
  $(element).fade('in', {onFinish: function() {}});

### slide

== Semantic
  slide([String how[, Object fx_options]]) -> Element self
  slide([Object fx_options])               -> Element self

== Description
  Runs the Fx.Slide effect on the element

== Example
  $(element).slide();
  
  $(element).slide('out');
  $(element).slide({onFinish: function() {}});
