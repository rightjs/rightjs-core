# Эффект подсветки

Fx.Highlight - это стандартный эффект подсветки элемента.

## Цвет подсветки

По умолчанию данный эффект будет использовать светло-желтый цвет подсветки,
но вы можете указать другой цвет подсветки по умолчанию, изменив переменную
`Fx.Highlight.Options.color`.


### #start

    start([String highlight_color[, String end_color]]) -> Fx self

Запускает данный эффект, опционально можно указать начальный и конечный
цвета подсветки

    var fx = new Fx.Highlight('element');
    
    fx.start();
    fx.start('blue');
    fx.start('blue', 'pink');