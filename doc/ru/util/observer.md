# Наблюдатель

`Observer` - это совместно используемый модуль для организации шаблона 
"наблюдатель". Он использован во многих местах библиотеки и предоставляет
общий интерфейс и принципы работы для всех случаев где необходима обработка
событий.

## Использование

В целом `Observer` это просто класс. Вы можете создавать от него объекты,
а так же использовать его как родительский класс для других классов.

    var observer = new Observer();
    observer.on('something', function() {....});
    //....
    observer.fire('something');
    
    var MyObserver = new Class(Observer, {
      // ....
    });
    var my_observer = new MyObserver();

Если вы не имеете возможности использовать `Observer` как родительский класс,
то вы можете воспользоваться методом {.create} который позволяет добавить
поведение наблюдателя практически для любого объекта.

    var Klass = new Class(AnotherKlass, {
      initialize: function() {
        Observer.create(this);
      }
    });
    
    var klass = new Klass();
    klass.on('something', function() {....});
    
    
    // или даже так
    var object = {....};
    Observer.create(object);
    
    object.on('something', function() {.....});

## Сокращения

Класс `Observer` позволяет генерировать удобные в использовании сокращения,
для поддерживаемых событий. Для этого вам необходимо указать список событий
в переменной `EVENTS` (без разницы, уровня класса или уровня объекта).

RightJS найдет эту переменную и автоматически сгенерирует список сокращений.

    var Klass = new Class(Observer, {
      EVENTS: $w('start stop')
    });
    
    var klass = new Klass();
    klass.onStart(.....);
    klass.start();

__ВНИМАНИЕ:__ если ваш класс имеет методы пересекающиеся со списком 
сокращений, то скрипт просто их пропустит.


## Вызов по имени

Класс `Observer` следует базовой конвенции вызовов по имени, широко
используемой в данной библиотеке. Это означает что вам не обязательно каждый
раз создавать анонимную функцию. Если все что вам нужно просто вызвать метод
самого объекта, то вы можете просто указать его имя. Опционально с набором
аргументов.

    var Kid = new Class(Observer, {
      callMommy: function(message) {
        alert(message);
      }
    });
    
    var kid = new Kid();
    
    kid.on('troubles', 'callMommy', 'Mommy!');
    
    // запускаем событие
    kid.fire('troubles');
  
    // класс автоматически вызовет метод 'callMommy' с сообщением 'Mommy!'



### .create

    Observer.create(Object object[, Array events_list]) -> Object observable

Статичный создатель для конвертации любых объектов в наблюдатели

    var object = {....};

    Observer.create(object);

    object.observe('something', function() {.....});


### .createShortcuts

    Observer.createShortcuts(Observer object, Array names) -> Object

Создает список сокращенных методов для событий

    var observer = new Observer();
    
    Observer.createShortcuts(observer, ['start', 'stop']);
    
    observer.onStart(function() {});
    observer.stop();

### #initialize

    initialize([Object options])

Базовый конструктор. Может получать совместно с любыми другими опциями,
функции обратного вызова для ваших событий используя ключи вида
'onSomething'.

__ВНИМАНИЕ__: если вы создаете подкласс наблюдателя, то не забывайте вызывать
this.$super(options) внутри вашего конструктора

    var observer = new Observer();
    var observer = new Observer({
      onStart: function() {},
      onFinish: 'clear'
    });
  
### #observe

    observe(String name, Function callback[, arguments])  -> Observer self
    observe(String name, String method_name[, arguments]) -> Observer self
    observe(String name, Array callbacks[, arguments])    -> Observer self
    observe(Object hash)                                  -> Observer self

Регистрирует слушателя события

__УСТАРЕВШЕЕ__: используйте более короткий метод {#on}

    var observer = new Observer();
    
    observer.observe('something', function() {...});
    
    // или по имени
    observer.observe('something', 'observer_method_name', arg1, arg2);
    
    // или несколько списком
    observer.observe('something', [func1, func2, func3, ...]);
    
    // или несколько хэшем
    observer.observe({
      one: function() {},
      two: 'something'
    })
  

### #on

    on(String name, Function callback[, arguments])  -> Observer self
    on(String name, String method_name[, arguments]) -> Observer self
    on(String name, Array callbacks[, arguments])    -> Observer self
    on(Object hash)                                  -> Observer self

Binds an event listener to the observer

    var observer = new Observer();
    
    observer.on('something', function() {...});
    
    // или по имени
    observer.on('something', 'observer_method_name', arg1, arg2);
    
    // или несколько списком
    observer.on('something', [func1, func2, func3, ...]);
    
    // или несколько хэшем
    observer.on({
      one: function() {},
      two: 'something'
    });
    
  

### #observes

    observes(String name)                    -> boolean
    observes(Function callback)              -> boolean
    observes(String name, Function callback) -> boolean

Проверяет если данная функция слушает какое либо событие

    var observer = new Observer();
    var callback = function() {};
    
    observer.on('event', callback);
    
    observer.observes('event');             // -> true
    observer.observes(callback);            // -> true
    observer.observes('event', callback);   // -> true
    
    observer.observes('another_event');     // -> false
    observer.observes(another_calback);     // -> false
    observer.observes('another', callback); // -> false
  

### #stopObserving

    stopObserving(String name)                    -> Observer self
    stopObserving(Function callback)              -> Observer self
    stopObserving(String name, Function callback) -> Observer self

Отключает слушателя от объекта

    var observer = new Observer();
    var callback = function() {};
    
    observer.on('event', callback);
    
    observer.stopObserving('event');
    
    observer.observes('event');           // -> false
    observer.observes(callback);          // -> false
  

### #fire

    fire(String name[, arguments, ...]) -> Observer self

Инициирует событие

    var observer = new Observer();
    
    observer.on('something', function() {});
    
    observer.fire('something');
    
    // подключенная функция была вызвана
  

### #listeners

    listeners([String name]) -> Array of callbacks

Возвращает список подключенных слушателей

    var observer = new Observer();
    var callback = function() {};
    
    observer.on('something', callback);
    
    observer.listeners('something'); // -> [callback]
  
