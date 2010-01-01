# Массивы

RightJS расширяет функциональность класс Array в нескольких направлениях.
Во-первых он добавляет стандартные для JavaScript 1.6 методы, такие как
{#map}, {#filter}, и т.п. для тех браузеров которые их не поддерживают. Таким
образом вы можете использовать преимущества данных методов не волнуясь о том
поддерживает ли браузер их или еще нет.

Во-вторых RightJS позволяет упрощенное обращение с обработкой элементов
массивов, просто указывая имя метода или атрибута который должен быть
обработан, возможно с дополнительными аргументами. Например:

    var elements = $$('some css rule');

    elements.each('hide');
    elements.each('addClass', 'marked');
    elements.each('observe', 'click', function() {});

    var ids = elements.map('id');
    var classes = elements.map('className').map('split', /\s+/).flatten().uniq();

    var visible_elements = elements.filter('visible');
    var marked_eleemnts  = elements.filter('hasClass', 'marked');

И в третьих RightJS добавляет несколько дополнительных методов, таких как
{#compact}, {#uniq}, {#merge} и т.п., являющихся стандартными в других языках
программирования. В большинстве своем это методы из языка Ruby.


## Работа с обратными вызовами

Каждый раз когда вы вызываете методы объектов типа Array используя функции
обратного вызова, эта функция, при каждой итерации, будет получать следующие
три аргумента

* текущий элемент
* индекс этого элемента
* ссылка на объект самого массива

Исключение составляют случае когда вы вызываете методы элементов списка по
имени. В этом случае методы получат только те аргументы которые вы укажете
в вызове. Например:

    [...].each('foo', 1, 2, 3);

В данном случае для каждого элемента данного массива будет вызван метод
`'foo'` с аргументами `1,2,3`
 


### #indexOf

    indexOf(mixed value) -> Integer

Возвращает левый индекс данного элемента в массиве. Возвращает -1 если элемент
не в списке.


### #lastIndexOf

    lastIndexOf(mixed value) -> Integer

Возвращает правый индекс данного элемента в массива. Возвращает -1 если
элемент не в списке


### #first

    first()                                  -> mixed
    first([Function lambda[, Object scope]]) -> mixed
    first([String name[, argument, ...]])    -> mixed

Возвращает первый элемент из массива или `undefined` если массив пуст.

Если указана функция обратного вызова, то метод вернет первый элемент
прошедший проверку в данной функции

    [1,2,3,4].first() // -> 1
    
    [1,2,3,4].first(function(i) { return i > 1; }) // -> 2
    
    ['bar', 'foo', 'moo'].first('match', 'oo') // -> 'foo'


### #last

    last()                                  -> mixed
    last([Function lambda[, Object scope]]) -> mixed
    last([String name[, argument, ...]])    -> mixed

Возвращает последний элемент в массиве или `undefined` если список пуст

Если указана функция обратного вызова, то метод вернет последний элемент
прошедший проверку в данной функции

    [1,2,3,4].last() // -> 4
    
    [1,2,3,4].last(function(i) { return i < 4; }) // -> 3
    
    ['foo', 'moo', 'bar'].first('match', 'oo') // -> 'moo'


### #random

    random() -> mixed

Возвращает случайный элемент из массива или `undefined` если список пуст

### #size

    size() -> Integer
  
Возвращает размер списка

    [1,2,3].size(); // -> 3

### #clean

    clean() -> Array self

Удаляет все элементы из массива без потери ссылки на объект самого массива


### #empty

    empty() -> boolean

Проверяет если данный массив имеет не нулевую длинну

### #clone

    clone() -> new Array

Создает новый массив содержащий все те же элементы что и оригинальный

### #each

    each(Function lambda[, Object scope]) -> Array self
    each(String name[, argument, ...])    -> Array self

Вызывает данную функцию с каждым элементом в массиве, опционально в указанном
контексте

    var elements = some_html_elements_list;
    
    elements.each(function(element, i) {
      if (i % 2 == 0) {
        element.hide();
      } else {
        element.show();
      }
    });
  
    // вызовет метод toggle() на каждом элементе
    elements.each('toggle'); 
    
    // добавит класс 'marked' для каждого элемента
    elements.each('addClass', 'marked'); 


### #map

    map(Function lambda[, Object scope]) -> Array new
    map(String name[, argument, ...])    -> Array new

Создает массив результатов вызова данной функции на каждом элементе в списке

    var strings = ['anny', 'banny', 'manny'];
    
    strings.map(function(string, i) {
      return (i+1)+'. '+string;
    });
    
    // -> ['1. anny', '2. banny', '3. manny'];
    
    strings.map('capitalize');
    
    // -> ['Anny', 'Banny', 'Manny'];
    
    strings.map('replace', 'nn', 'b');
    
    // -> ['aby', 'baby', 'maby'];
  

### #filter

    filter(Function lambda[, Object scope]) -> Array new
    filter(String name[, argument, ...])    -> Array new

Создает новый массив содержащий только те элементы оригинального массива,
которые прошли проверку в даной функции

    var strings = ['anny', 'manny', 'banny', 'bob'];
    
    strings.filter(function(string, i) {
      return string.length > (i+1);
    });
    // -> ['anny', 'manny', 'banny'];
    
    strings.filter('match', /[a-z]ann/);
    // -> ['manny', 'banny']


### #walk

    walk(Function lambda[, Object scope]) -> Array self
    walk(String name[, argument, ...])    -> Array self

Заменяет каждый элемент в массиве результатом работы данной функции

    var names = ['anny', 'manny', 'banny', 'bob'];
    
    names.walk(function(name, i) {
      return (i+1)+'. '+name;
    });
    
    // -> ['1. anny', '2. manny', '3. banny', '4. bob'];
    
    names.walk('split', '. ');
    
    // [['1', 'anny'], ['2', 'manny'], ['3', 'banny'], ['4', 'bob']];
    
    names.walk('last').walk('capitalize');
    
    // ['Anny', 'Manny', 'Banny', 'Bob'];


### #merge

    merge(Array list[, Array list, ...]) -> Array new

Создает новый массив содержащий все элементы текущего массива и элементы из
полученных списков которые в нем не присутствуют
  
    [0,1,2,3].merge([2,3,4], [3,4,5], [1,5,6]);
    
    // -> [0,1,2,3,4,5,6];
  

### #flatten

    flatten() -> Array new

Конвертирует многомерный массив в одномерный

    [0,1,[2,3,[4,5,[6,7],8],9]].flatten();
    
    // -> [0,1,2,3,4,5,6,7,8,9];


### #compact

    compact() -> Array new

Создает новый массив содержащий все не `null` или `undefined` элементы
из оригинального массива

    [null, 0, undefined, 1, 2, 3, null].compact();
    
    // -> [0, 1, 2, 3];


### #uniq

    uniq() -> Array new

Создает новый массив содержащий только уникальные элемент из оригинала

    [0,1,1,2,0,1,2,3,3].uniq();
    
    // -> [0,1,2,3];



### #includes

    includes(mixed value[, mixed value,...]) -> boolean

Проверяет если данное значение присутствует в данном массиве. Если было
указано несколько значений, данный метод проверит, если _все_ из них
присутствуют в массиве.

    [0,1,2,3].includes(0);   // true
    [0,1,2,3].includes(4);   // false
    [0,1,2,3].includes(1,2); // true
    [0,1,2,3].includes(2,4); // false


### #without

    without(mixed value[, mixed value, ...]) -> Array new
  
Создает новый массив _без_ указанных значений

    [0,1,2,3].without(1,3);
    
    // -> [0,2];


### #shuffle

    shuffle() -> Array new

Сортирует элементы массива в случайном порядке

    [0,1,2,3,4].shuffle();
    
    // -> [3, 4, 0, 1, 2]
  
### #sortBy

    sortBy(Function lambda[, scope])      -> Array new
    sortBy(String attr_name[, arguments]) -> Array new

Сортирует элементы данного массива по результатам работы указанной функции

    [{t:3}, {t:2}, {t:1}].sortBy(function(item) {
      return item.t;
    });
    
    // -> [{t:1}, {t:2}, {t:3}]
    
    [{t:3}, {t:2}, {t:1}].sortBy('t');
    
    // -> [{t:1}, {t:2}, {t:3}]
  
### #every

    every()                                -> boolean
    every(Function lambda[, Object scope]) -> boolean
    every(String name[, argument, ...])    -> boolean

Проверяет если _все_ элементы данного массива проходят проверку в указанной
функции.

Если никакой функции не было указано, тогда все значения будут проверены
как булевы

    [1,2,3,4].every() // -> true
    [0,1,2,3].every() // -> false
    
    [1,2,3].every(function(i) { return i > 0}) // -> true
    [0,1,2].every(function(i) { return i > 0}) // -> false
    
    ['moo', 'foo', 'boo'].every('match', 'oo') // -> true
    ['moo', 'foo', 'bar'].every('match', 'oo') // -> false
  

### #some

    some()                                -> boolean
    some(Function lambda[, Object scope]) -> boolean
    some(String name[, argument, ...])    -> boolean

Проверяет если _какой-либо_ элемент данного массива проходит проверку в
указанной функции

Если никакой функции не было указано, тогда все значения будут проверены
как булевы

    [0,false,1].some()    // -> true
    [0,false,null].some() // -> false
    
    [0,1,2].some(function(i) { return i == 0; }) // -> true
    [1,2,3].some(function(i) { return i == 0; }) // -> false
    
    ['foo', 'bar'].some('match', 'bar') // -> true
    ['foo', 'boo'].some('match', 'bar') // -> false

