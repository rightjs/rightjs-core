# Xhr

`Xhr` - это базовый класс для работы с асинхронными запросами в RightJS.

## Опции

Класс `Xhr` поддерживает следующий список опций 

Имя          | Умолчание | Описание                                         |
-------------|-----------|--------------------------------------------------|
method       | 'post'    | метод запроса get/post/put/delete                |
encoding     | 'utf-8'   | используемая кодировка                           |
async        | true      | маркер если запрос должен быть асинхронным       |
evalScripts  | false     | если нужно выполнить скрипты из текста ответа    |
evalResponse | false     | если нужно исполнить ответ как скрипт            |
evalJSON     | true      | если нужно обрабатывать ответы типа JSON         |
secureJSON   | true      | если необходимо проверять JSON перед исполнением |
urlEncoded   | true      | если нужно кодировать отправляемую информацию    |
spinner      | null      | ссылка на элемент спиннера                       |
spinnerFx    | 'fade'    | имя визуального эффекта для работы со спиннером  |
params       | null      | параметры по умолчанию                           |

Любые из перечисленных опций могут быть использованы в любом месте где
создается запрос. Так же вы можете переназначить их глобально используя
переменную {Xhr.Options}.


## Спиннеры

Класс {Xhr} в RightJS имеет встроенную функциональность для управления
спиннерами. Вы можете указать сам элемент по ссылке или просто передать его
ID на странице

    Xhr.Options.spinner = $('spinner');
    
    // теперь элемент спиннера будет появлятся когда запрос отправляется
    // и автоматически скрываться когда будет получен ответ
    new Xhr('/foo/bar').send();
    
    // вы можете так же указать отдельный спиннер для отдельного запроса
    new Xhr('/foo/bar', {
      spinner: 'custom-spinner'
    }).send();


## Данные для отправки

Вы можете отправлять любые строковые данные с Xhr запросами. Можно
указывать их в виде url-строки, либо обычным хэшем.

Существует несколько уровней где вы можете указать данные для отправки. Вы
можете указать глобальные данные которые будут отправляться с каждым запросом.

    Xhr.Options.params = 'myapp=true';
    
    // отправляет 'myapp=true' с любым последующим запросом.
    Xhr.load('/foo/bar');
    
    new Xhr('/foo/bar').send();

Вы можете указать данные для какого-то отдельного объекта запроса.

    var xhr = new Xhr('/foo/bar', {
      params: {myapp: true}
    });
  
    xhr.send(); // сервер увидит данные 'myapp=true'

И наконец вы можете указать данные для каждой отдельно взятой отправки 
с методом {#send}.

    var xhr = new Xhr('/foo/bar').send('myapp=true');

__ВНИМАНИЕ:__ Если вы указываете данные на нескольких уровнях одновременно,
все они будут объединены перед отправкой в единый кусок данных.


## События

Класс Xhr наследован от совместно используемого класса {Observer}, что 
означает, что вы можете использовать все стандартные методы подключения
слушателей событий.

Класс Xhr поддерживает следующий список событий

Имя      | Описание                                                      |
---------|---------------------------------------------------------------|
create   | после того как XmlHTTPRequest объект был создан               |
request  | после того как запрос был отправлен                           |
complete | когда запрос был полнстью завершен (с любым результатом)      |
success  | когда запрос был _успешно_ завершен                           |
failure  | когда запрос был завершен _с ошибкой_                         |
cancel   | когда запрос был завершен _принудительно_                     |

__ВНИМАНИЕ:__ каждый слушатель событий будет получать два аргумента, ссылку на
текущий объект Xhr и ссылку на оригинальный XmlHTTPRequest запрос

Вы так же можете подключить слушателей к данным событиям глобально используя
методы уровня класса для `Xhr`

    Xhr.onCreate(function() {...});
    Xhr.onFailure(function() {...});
    
В этом случае `Xhr` будет оповещать укзанных слушателей при _каждом_
отправляемом запросе.


## Работа с JSON

Если опция `evalJSON` установлена в `true` (по умолчанию), то Xhr будет
автоматически пытаться извлечь данные из ответов с типом контента json. В
случае успеха данные будут установлены в переменную `responseJSON`

    Xhr.load('/some.json', {
      onSuccess: function(request) {
        var json = request.responseJSON;
      
        // ....
      }
    });
    
## Короткие имена для доступа к ответам

Для доступа к ответам сервера, вы можете использовать стандартные имена
`responseText`, `responseXML` и `responseJSON`, или воспользоваться 
сокращениями

* this.text -> this.responseText
* this.xml  -> this.responseXML
* this.json -> this.responseJSON
    

### .Options

    Xhr.Options -> Object

Опции по умолчанию для класса Xhr. См. раздел выше

    Xhr.load('/some/url'); // -> 'post' request
  
    Xhr.Options.method = 'get';
    
    Xhr.load('/some/url'); // -> 'get' request


### .load

    Xhr.load(String url[, Object options]) -> Xhr new

Сокращение для `new Xhr(url, options).send();`. Просто создает объект
запроса и тут же его отсылает
  
__ВНИМАНИЕ:__ создает `GET` запрос по умолчанию

    Xhr.load('/some/url', {
      onSuccess: function(request) {
        // делаем что-то
      }
    });
  
### #initialize

    initialize(String url[, Object options]) -> Xhr new

Базовый конструктор

    var xhr = new Xhr('/some/url');
    var xhr = new Xhr('/some/url', {
      method: 'get',
      onSuccess: some_success_handler
    });

### #setHeader

    setHeader(String name, String value) -> Xhr self

Устанавливает дополнительные хидеры для запроса

    var xhr = new Xhr('/some/url');
    xhr.setHeader('Content-type', 'application/x-www-form-urlencoded');

### #getHeader

    getHeader(String name) -> String value

Считывает хидеры из ответа

    var xhr = new Xhr('/foo/bar');
    xhr.send();
    // ...
    xhr.getHeader('Content-type');

### #successful

    successful() -> boolean

Проверяет если запрос был завершен _успешно_

    var xhr = new Xhr('/foo/bar', {
      onComplete: function(request) {
        if (request.successful()) {
          // do something
        }
      }
    }).send();


### #send

    send([String params])  -> Xhr self
    send([Object params])  -> Xhr self
    send([Form   element]) -> Xhr self

Отправляет запрос на сервер

    var xhr = new Xhr('/foo/bar');
    xhr.send();
    
    // или с данными
    xhr.send('foo=bar&moo=boo');
    
    // или с данными в виде хэша
    xhr.send({foo: 'bar'});


### #update

    update(Element element[, mixed params])   -> Xhr self
    update(String element_id[, mixed params]) -> Xhr self
  
Отправляет запрос на сервер и обновляет содержимое указанного элемента текстом
ответа

    var xhr = new Xhr('/foo/bar');
    
    xhr.update(element);
    xhr.update('element-id');
    xhr.udpate(element, 'foo=bar');
    xhr.udpate(element, {foo: 'bar'});
  

### #cancel

    cancel() -> Xhr self

Принудительно отменяет/останавливает запрос

    var xhr = new Xhr('/foo/bar');
    xhr.send();
  
    xhr.cancel();
  
