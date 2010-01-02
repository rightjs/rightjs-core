# Объекты

Класс {Object} в RightJS имеет несколько дополнительных стандартных методов
для обработки часто встречающихся операций с объектами

### .keys

    Object.keys(Object object) -> Array keys

Возвращает список ключей объекта

    Object.keys({'a':1, 'b':2, 'c':3})
    
    // -> ['a', 'b', 'c']


### .values

    Object.values(Object object) -> Array values

Возвращает список значений объекта

    Object.values({'a':1, 'b':2, 'c':3})
    
    // -> [1, 2, 3]
  

### .empty

    Object.empty(Object object) -> boolean

Проверяет если данный объект имеет какие-либо значения

    Object.empty({'a':1}) // -> false
    Object.empty({})      // -> true

### .without

    Object.without(Object object, String key[, keys..]) -> Object new

Создает новый объект имеющий те же значения что и оригинальный, за
исключением указанных ключей

    var object = {'a': 1, 'b': 2, 'c': 3};
    Object.without(object, 'b');
    
    // -> {'a': 1, 'c': 3}

### .only

    Object.only(Object object, String key[, keys...]) -> Object new

Создает новый объект, копируя _только_ указанные ключи.

    var object = {'a': 1, 'b': 2, 'c': 3};
    Object.only(object, 'b', 'c');
    
    // -> {'b': 2, 'c': 3}

### .merge

    Object.merge(Object o1, Object o2[, objects..]) -> Object new

Объединяет несколько в объектов в один

    Object.merge({'a': 1, 'b': 2}, {'c': 3});
    
    // -> {'a': 1, 'b': 2, 'c': 3}

### .toQueryString

    Object.toQueryString(Object object) -> String

Конвертирует данный объект в строку пригодную для вставки в url-адрес.

    Object.toQueryString({a:'a', b:'b', c:'%#?'}));
    
    // -> 'a=a&b=b&c=%25%23%3F'
