# События

Для того чтобы предоставить возможность кросс-браузерной работы с событиями,
RightJS добавляет несколько стандартных расширений.


## События в Internet Explorer

Вместо того чтобы создавать некий дополнительный интерфейс объединяющий
различные версии объектов событий в различных браузерах RightJS просто,
заменяет и создает стандартные W3C атрибуты для объектов событий, так что
на каком бы браузере ваш код не обрабатывался, вы можете работать с событиями
так, как если бы вы работали с браузером следующим стандартам.

Список создаваемых атрибутов:

* `which` - номер нажатой кнопки мыши (1,2,3)
* `target` - ссылка на элемент вызвавший событие
* `relatedTarget` - ссылка на зависимый элемент для событий mouseover,mouesout
* `pageX`, `pageY` - абсолютная позиция курсора
 
### .ext

    Event.ext(Event event) -> Event extended

Подключает расширения для объекта событий. На случай необходимости сделать это
в принудительно.
  
    $('element').attachEvent('onclick', function(event) {
      Event.ext(event);
      
      event.stop();
    });


### .addMethods

    Event.addMethods(Object methods[, boolean dont_rewrite])

Регистрирует дополнительные методы для объектов событий.

    Event.addMethods({
      myMethod: function() {....}
    });
    
    $('my_element').onClick(function(event) {
      event.myMethod()
    });


### #stop

    stop() -> Event self

Останавливает событие предотвращая дальнейшее его распространение

    $('element').onContextmenu(function(e) {
      e.stop();
      $('context-menu').moveTo(e.position()).show();
    });


### #preventDefault

    preventDefault() -> void

Отключает обработку события по умолчанию
  

### #stopPropagation

    stopPropagation() -> void

Предотвращает дальнейшее распространение события


### #position

    position() -> {x: NNN, y: NNN}

Возвращает хэш с позицией события

    $('element').onMouseover(function(event) {
      $('nice-looking-title').show().moveTo(event.position());
    });


