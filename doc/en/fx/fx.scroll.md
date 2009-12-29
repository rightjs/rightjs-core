# Fx.Scroll

Fx.Scroll is a smooth scrolling visual effect for elements with the 'overflow'
style.


### #start

    start(Object {x:N, y:N}) -> Fx self

Starts the element scrolling effect, you can specify one direction only if you
need.

    var fx = new Fx.Scroll('element');
    
    fx.start({x: 100});
    fx.start({y: 200});
    fx.start({x: 100, y: 200});
