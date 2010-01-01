# Расширения элементов для модуля Fx

Существует несколько сокращений для более удобной работы с визуальными
эффектами непосредственно с элементов страницы.


### morph

    morph(Object style[, Object fx_options]) -> Element self

Запускает {Fx.Morph} визуальный эффект

    $(element).morph({
      width: '200px',
      height: '400px'
    });

### highlight

    highlight([String color[, String end_color[, Object fx_options]]]) -> Element self
    highlight([String color[, Object fx_options]]) -> Element self
    highlight([Object fx_options])                 -> Element self

Вызывает {Fx.Highlight} визуальный эффект

    $(element).highlight();
    
    $(element).highlight('blue');
    $(element).highlight({onFinish: function() {}});

### fade

    fade([String how[, Object options]]) -> Element self
    fade([Object options])               -> Element self

Вызывает {Fx.Fade} визуальный эффект

    $(element).fade();
    
    $(element).fade('out');
    $(element).fade('in', {onFinish: function() {}});

### slide

    slide([String how[, Object fx_options]]) -> Element self
    slide([Object fx_options])               -> Element self

Вызывает {Fx.Slide} визуальный эффект

    $(element).slide();
    
    $(element).slide('out');
    $(element).slide({onFinish: function() {}});


### scroll

    scroll(Object {x:N, y:N}[, Object options]) -> Element self

Плавно прокручивает полосы прокрутки в указанную позицию

    $(element).scroll({x: 100});
    $(element).scroll({y: 200});
    $(element).scroll({x: 10, y: 20});
    
    $(element).scroll({x: 100}, {duration: 'long'});
    