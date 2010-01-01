# Элементы форм

Все элементы форм, такие как поля ввода, чекбоксы и пр. имеют в RightJS 
несколько дополнительных методов для того чтобы сделать работу с ни ми более
комфортной и вписывающуюся в общую концепцию библиотеки.

## События

В дополнение к обычным dom-событиям, для полей ввода, существует ряд
дополнительных событий:

* disable
* enable
* focus
* blur
* change

Эти события обрабатываются точно так же как и все прочие, для них существуют
сокращения вроде onFocus, onBlur и вы можете подключать их любым стандартным
способом.

### .addMethods

    addMethods(Object methods[, boolean dont_rewrite])

Регистрирует дополнительные методы для элементов форм

    Form.Element.addMethods({
      myMethod: function() {....}
    });
    
    $('my_input').myMethod();


### #getValue

    getValue() -> mixed value

Унифицированный метод для получения текущего значения данного поля ввода

    $('input').getValue();
    $('select').getValue();
    $('textarea').getValue();
    $('multi-select').getValue();


### #setValue

    setValue(mixed value) -> Element self

Унифицированный метод для установки значения поля ввода

    $('input').setValue('text');
    $('select').setValue(1);
    $('textarea').setValue('text');
    $('multi-select').setValue([1,2,3]);


### #disable

    disable() -> Element self

Блокирует элемент запрещая любые изменения в нем

    $('element').disable();


### #enable

    enable() -> Element self

Разблокирует заблокированный элемент

    $('input').enable();


### #focus

    focus() -> Element self

Передает фокус в данный элемент

    $('input').focus();


### #select

    select() -> Element self

Передает фокус в данный элемент и выделяет его содержимое

    $('input').select();


### #blur

    blur() -> Element self

Убирает фокус с данного элемента

    $('input').blur();


