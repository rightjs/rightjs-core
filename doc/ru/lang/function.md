# Функции

RightJS класс функций `Function` несколькими дополнительными стандартными
методами из функциональной парадигмы, а так же добавляет пару методов для
более удобной работы с задержками и периодическими вызовами.

### #bind

    bind(Object scope[, argument,...]) -> Function new

Создает новую функцию которая будет вызывать оригинальную в указанном
контексте, опционально с указанными аргументами
  
    var object = {
      attr: 'value'
    };
    var func = function(arg1, arg2) {
      return this.attr + ': '+arg1 + ': '+ arg2;
    };
    
    var bind = func.bind(object, 'argument1');
    
    var result = bind('argument2');
    
    // -> 'value: argument1: argument2'


### #bindAsEventListener

    bindAsEventListener(Object scope[, argument, ...]) -> Function new

Создает новую функцию которая будет вызывать оригинальную в указанном
контексте, но при этом сохраняет позицию первого аргумента для верной
обработки событий

    var object = {
      attr: 'value'
    };
    var func = function(event, arg1, arg2) {
      return this.attr +' > '+ event.eventName +' > '+ arg1 +' > '+ arg2;
    };
    
    var observer = new Observer();
    observer.on('foo', func.bindAsEventListener('argument1', 'argument2'));
    observer.fire('foo');
  
    // -> 'value > foo > argument1 > argument2'


### #curry

    curry(mixed value[, mixed value, ...]) -> Function new

Стандартная для ФП функция левого карринга

    var multiplier = function(x, y) {
      return x * y
    };
    var double = multiplier.curry(2);
    
    double(2); // 4
    double(4); // 8
    double(8); // 16
  

### #rcurry

    rcurry(mixed value[, value, ...]) -> Function new

Стандартная для ФП функция правого карринга

    var callback = function() { return $A(arguments); };
    
    var with_one = callback.rcurry(1);
    var with_two = callback.rcurry(1,2);
    
    with_one(1);     // -> [1,1]
    with_one(1,2);   // -> [1,2,1]
    
    with_two(1);     // -> [1,1,2]
    with_two(1,2,3); // -> [1,2,3,1,2]


### #delay

    delay(Integer timeout) -> Number timeout marker

Создает отсроченный вызов данной функции
  
__ВНИМАНИЕ__: данный метод возвращает объект указателя на задержку, к которому
был добавлен дополнительный метод `cancel()` вызывав который можно отменить
отсроченный вызов функции.

    var func = function() {
      alert('boo');
    };
    
    var timeout = func.delay(2000);
    
    // должны увидеть "бу" через две секунды
    
    // вы можете отменить вызов стандарно
    window.clearTimeout(timeout);
    
    // или вот так
    timeout.cancel();


### #periodical

    periodical(Integer timeout) -> Number timeout marker

Заставляет скрипт вызывать данную функцию через указанные промежутки времени

__ВНИМАНИЕ__: данный метод возвращает указатель на таймер, к которому был
добавлен дополнительный метод `stop()` вызывав который можно остановить
периодические вызовы функции.

    var func = function() {
      // делаем что-то
    };
    
    var marker = func.periodical(4000);
    
    // теперь наша функция будет делать "что-то" каждые 4-секунды
    
    // вы можете остановить вызовы стандартно
    window.clearInterval(marker);
    
    // или используя дополнительный метод
    marker.stop();


### #chain

    chain(Function func[, value, ...]) -> Function new

Создает новую функцию которая назначит исполнение указанной функции после
исполнения оригинальной функции, возможно с предустановленными аргументами
    
    var f1 = function(list, num) { list.push(num); };
    var f2 = function(list, num) { list.push(num); };
    var f3 = function(list, num) { list.push(num); };
    
    var list = []; // <- will track the calls
    
    var f = f1.chain(f2, list, 2).chain(f3, list, 3);
    
    f(list, 1); // calls the first function
    
    list // -> [1, 2, 3]

