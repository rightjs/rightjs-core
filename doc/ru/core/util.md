# Утилитарные функции

RightJS имеет небольшую коллекцию независимых функций для обработки наиболее
часто встречающихся в практике JavaScript программирования операций.
Большинство этих функций можно встретить в таких библиотеках как
frameworks like [Prototype](http://prototypejs.org) или
[Mootools](http://mootools.net), в RightJS, для более простого освоения, 
большинство названий и функциональности сохранены в оригинальном виде.

### $

    $(String element_id) -> Element
    $(Element element)   -> Element

Находит элемент по его ID или расширяет уже существующий элемент

    $('some-id');
    $(element);


### $$

    $$(String css_rule) -> Array of elements

Находит все элементы на странице, которые соответствуют указанному правилу.
Данный метод поддерживает все стандартные CSS3 конструкции на всех браузерах.

__ВНИМАНИЕ__: этот метод возвращает пустой список, если ничего не было найдено

    $$('div > span.foo');


### $w

    $w(String string) -> Array of strings

Разбивает строку на список слов по пробелам

    $w('one two    three'); // -> ['one', 'two', 'three']


### $A

    $A(Iterable it) -> Array

Конвертирует список любого типа, в объект типа {Array}

    function() {
      var args = $A(arguments);
      var first = args.shift();
    };


### $E

    $E(String tag_name[, Object options]) -> Element new

Сокращение для 'new Element'

    var div = $E('div', {id: 'some-id'});


### $ext

    $ext(Object first, Object second[, boolean dont_overwrite]) -> Object first

Копирует данные из второго объекта в первый.

Если третий аттрибут эквивалентен `true`, то данный метод будет пропускать
все ключи уже существующие в первом объекте

    var o = {1:1};
    $ext(o, {2:2}); // -> {1:1, 2:2}
    
    $ext(o, {2:4, 3:3}, true); // -> {1:1, 2:2, 3:3}


### $try

    $try(Function function[, Function function, ...]) -> mixed result

Запускает все функции переданные как аргументы и возвращает результат
работы той функции которая _первая_ не вызовет никаких исключений

    var result = $try(
      function() { throw 'error'; },
      function() { return 1; },
      function() { return 2; }
    );
    
    result // -> 1


### $eval

    $eval(String code) -> void

Исполняет полученный в виде строки код на языке JavaScript в контексте 
текущего окна

    $eval('var foo = "bar";');
    
    window['foo']; // -> 'bar'


### $break

    $break() -> void

Принудительно останавливает итерации в случае использования итераций с
функциями обратного вызова

    [1,2,3,4].walk(function(value, i) {
      if (i > 1) $break();
      return i * 2;
    });
    
    // [2,4,3,4]


### $alias

    $alias(Object object, Object aliases) -> Object the first

Создает псевдонимы для свойств объекта

    var object = {
      foo: function() {};
    };
    
    $alias(object, {
      bar: 'foo'
    });
    
    // теперь 'foo' и 'bar' указывают на одну и ту же функцию


### defined

    defined(mixed value) -> boolean check result

Проверяет если данное значение не равно `undefined`

    var object = {
      foo: 'foo'
    };
    
    defined(object.foo); // -> true
    defined(object.bar); // -> false


### isHash

    isHash(mixed value) -> boolean check result

Проверяет если полученное значение является плоским объектом JavaScript

    isHash([1,2,3]);      // -> false
    isHash('foo bar');    // -> false
    isHash({foo: 'bar'}); // -> true



### isFunction

    isFunction(mixed value) -> boolean check result

Проверяет если полученное значение является функцией

    isFunction('boo');         // -> false
    isFunction(function() {}); // -> true



### isString

    isString(mixed value) -> boolean check result

Проверяет если полученное значение является строкой

    isString([]); // -> false
    isString({}); // -> false
    isString(''); // -> true


### isArray

    isArray(mixed value) -> boolean check result

Проверяет если полученное значение является объектом типа {Array}

    isArray({}); // -> false
    isArray(''); // -> false
    isArray([]); // -> true


### isNumber

    isNumber(mixed value) -> boolean check result

Проверяет если полученное значение является цифрой

    isNumber('1'); //  -> false
    isNumber(111); //  -> true
    isNumber(1.1); //  -> true
  


### isElement

    isElement(mixed value) -> boolean check result

Проверяет если полученное значение является элементом страницы

    isElement(document.createTextNode('boo')); // -> false
    isElement(document.createElement('div'));  // -> true


### isNode

    isNode(mixed value) -> boolean check result

Проверяет если полученное значение является DOM узлом (TextNode или HTMLElement)

    isNode(document.createTextNode('boo')); // -> true
    isNode(document.createElement('div'));  // -> true
    
    isNode('foo'); // -> false

