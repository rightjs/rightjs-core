# Куки

`Cookie` - это объектно-ориентированный интерфейс для работы с куками. Вы
можете работать с ним как через интерфейс уровня класса

    Cookie.set('name', 'value');
    Cookie.set('name', 'value', {duration: 10});
    
    Cookie.get('name');
    
    Cookie.remove('name');

А так же можете работать с его объектами

    var cookie = new Cookie('name');
    var cookie = new Cookie('name', {duration: 4});
    
    cookie.set('value');
    
    cookie.remove();

## Опции

Вы можете использовать следующие опции

Название | описание                                             |
---------|------------------------------------------------------|
duration | количество дней которое кука должна храниться        |
domain   | доменное имя                                         |
path     | путь                                                 |
secure   | маркер указывающий если кука должна быть защищенной  |
 
 
## Кодирование/декодирование значений

Вы можете безопасно сохранять любые строки через интерфейс `Cookie`, все они
будут прозрачно трансформированы в обе стороны автоматически

    Cookie.set('name', '%"&=*"');
    
    Cookie.get('name'); // -> '%"&=*"'

Если вы подключите модуль [JSON](/goods/json) то данный интерфейс так же
позволит вам прозрачно сохранять и доставать JSON экспортируемые объекты,
такие  как массивы, хэши, булевы значения, и т.п.


### .set

    Cookie.set(String name, String value[, Object options]) -> Cookie

Устанавливает куку

    Cookie.set('name', 'value');
    Cookie.set('name', 'value', {duration: 4});

### .get

    Cookie.get(String name) -> String value or null

Считывает куку. Возвращает `null` если ничего не установлено

    Cookie.set('name', 'value');
    
    Cookie.get('name'); // -> 'value'

### .remove

    Cookie.remove(String name) -> Cookie 

Удаляет куку по имени

    Cookie.set('name', 'value');
    
    Cookie.remove('name');
    
    Cookie.get('name'); // -> null


### #initialize

    initialize(String name[, Object options])

Базовый конструктор

    var cookie = new Cookie('name');
    var cookie = new Cookie('name', {duration: 2});


### #set

    set(String value) -> Cookie self
  
Устанавливает куку

    var cookie = new Cookie('name');
  
    cookie.set('value');
    
    cookie.get(); // -> 'value'


### #get

    get() -> String value or null
  
Считывает куку

    var cookie = new Cookie('name');
    
    cookie.set('value');
    
    cookie.get(); // -> 'value'


### #remove

    remove() -> Cookie self

Удаляет куку

    var cookie = new Cookie('name');
    cookie.set('value');
    cookie.get(); // -> 'value'
    
    cookie.remove();
    
    cookie.get(); // -> null
