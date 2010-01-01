# Числа

RightJS расширяет класс `Number` для того чтобы работать с методами модуля
{Math} в более естественном, объектно-ориентированном виде. Так же было
добавлено несколько методов для работы с итерациями в стиле языка Ruby


### #abs

    abs() -> number absolute value

Возвращает абсолютное значение числа

    -1..abs(); // -> 1
    22..abs(); // -> 22



### #ceil

    ceil() -> number

Возвращает ближайшее меньшее целое

    2.2.ceil(); // -> 3


### #floor

    floor() -> number

Возвращает ближайшее большее целое

    2.2.floor(); // -> 2


### #round

    round([Integer base]) -> number

Округляет значение до ближайшего целого. Опционально можно так же указать
до скольки знаков после запятой необходимо округлять значение

    2.2.round();    // -> 2
    8.8.round();    // -> 8
    
    4.444.round(1); // -> 4.4
    4.444.round(2); // -> 4.44
    4.444.round(3); // -> 4.444


### #times

    times(Function lambda[, Object scope]) -> number self

Вызывает указанную функцию число раз, равное текущему числу
    
    var numbers = [];
    4..times(function(i) {
      numbers.push(i);
    });
    
    numbers; // -> [0,1,2,3]



### #upto

    upto(number stop, Function lambda[, Object scope]) -> number self

Производит итерации с использованием указанной функции, от текущего числа
вверх до указанного числа

    var numbers = [];
    
    4..upto(8, function(i) {
      numbers.push(i);
    });
    
    numbers; // -> [4,5,6,7,8]



### #downto

    downto(number end, Function lambda[, Object scope]) -> number self

Производит итерации с использованием указанной функции, от текущего числа
вниз до указанного числа

    var numbers = [];
    
    8..downto(4, function(i) {
      numbers.push(i);
    });
    
    numbers; // [8,7,6,5,4]
