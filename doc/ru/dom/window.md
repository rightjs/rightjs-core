# Окно

Объект окона `window` в RightJS имеет несколько методов для удобной,
кросс-браузерной работы с размерами окон и полосами прокрутки.


### #sizes

    sizes() -> Object {x: NN , y: NN }

Возвращает внутренние размеры данного окна

    window.sizes();

### #scrolls

    scrolls() -> Object {x: NN , y: NN }

Возвращает параметры скроллинга для данного окна

    window.scrolls();


### #scrollTo

    scrollTo(number left, number top) -> window self
    scrollTo(Object {x: ..., y:...})  -> window self
    scrollTo(Element element)         -> window self
    scrollTo(String element_id)       -> window self

Смещает прокрутку окна в указанную позицию или к указанному элементу

    window.scrollTo(123, 123);
    window.scrollTo({x: 123, y: 123});
    window.scrollTo($('element'));
    window.scrollTo('element-id');

