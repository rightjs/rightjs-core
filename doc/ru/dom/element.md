# Элемент

Класс для DOM-элементов в RigthJS называется `Element`, он определяет базовый
интерфейс и является ответственным за обработку большинства dom-операций


## Дополнительные методы

Если вы используете собственные методы RightJS для навигации по элементам
страниц, то все расширения становятся доступны сразу.

Исключение составляют случаи когда вы принимаете элемент извне контекста
RightJS, например назначаете обработчик события внутри атрибута, или вам
необходимо обработать элемент найденный другим скриптом. В таких случаях,
для того чтобы, все расширения работали правильно, необходимо вызвать на
этих элементах функцию `$()` хотя бы один раз.


## Мутирующие методы и последовательности вызовов

Все мутирующие методы в RightJS возвращают ссылку на объект которому они
принадлежат, поэтому используя RightJS вы всегда можете создавать удобные
и легко читаемые последовательности вызовов.

    $('some-element').on("click", function() {})
      .setStyle({fontSize: '200%'})
      .addClass('marked').update('with text')
      .toggle().set('title', 'some-title') ...;


## Методы поиска

Элементы страницы в RightJS имеют достаточно обширный список методов для
удобной навигации по соседним с ними элементам, например: {#parents},
{#siblings}, и т.д. Все эти методы могут быть использованы непосредственно,
как есть, а могут принимать дополнительный аргумент-правило, соответственно
которому результаты поиска будут отфильтрованы.

    var element = $('some-element');
    
    element.siblings();      // все соседние элементы
    element.siblings('div'); // только 'DIV' соседние элементы

__ВНИМАНИЕ__: RightJS не имеет специального интерфейса для обработки списков
элементов, вместо этого он позволяет работать со списками типа {Array},
указывая только имя того метода/атрибута, который необходимо обработать

    $('some-list').select('li')
      .filter('hasClass', 'marked')
      .each('onClick', function() {...});


## Обработка событий

Элементы в RightJS имеют стандартный интерфейс для обработки событий
определяемый модулем {Observer}, поэтому вы можете обрабатывать все события
единообразно.

    $('some-element').on('click', function() {
      call_that_function();
    });
  
    $('another-element').on({
      click:     click_handler,
      mouseover: mouseover_handler,
      mouseout:  mouseout_handler
    });
    
    $('that-element').on('click', [
      function1, function2, function3
    ]);

Так же существуют сокращения для всех стандартных DOM-событий, и вы можете
использовать вызов методов по имени

    $('element').onClick('addClass', 'marked');

Вы так же можете запускать любые события вручную, если это необходимо

    element.onClick('addClass', 'clicked');
    element.onKeypress('radioClass', 'typing');
  
    element.fire('click',    { button: 3 });
    element.fire('keypress', { keyCode: 12 });
    
## Нестандартные события

В RightJS, на уровне интерфейса, нет никакой разницы между стандартными
и нестандартными событиями. Поэтому вы можете работать со своими собственными
событиями точно так же как и с событиями DOM.

    element.on('my-event', function() {....});
    element.fire('my-event');


### .addMethods

    Element.addMethods(Object methods[, boolean dont_rewrite])

Регистрирует дополнительные методы для элементов страницы

__УСТАРЕВШЕЕ__: пожалуйста используйте метод {.include}


### .include

    Element.include(Object methods[, boolean dont_rewrite])

Регистрирует дополнительные методы для элементов страницы

    Element.include({
      myMethod: function() {....}
    });

    $('my_element').myMethod();


### #initialize

    initialize(String tag_name[, Object options]) -> Element new

Стандартный конструктор. Получает два аргумента, имя тэга и набор опций.
Опции в основном являют собой атрибуты нового элемента, а так же вы можете
использовать следующие ключи:
  
* 'html'    - исходный код HTML для установки в innerHTML
* 'class'   - css-класс нового элемента
* 'style'   - хэш или строка со стилями
* 'observe' - хэш с обработчиками событий

Все ключи будут обработаны в одном потоке.

    var element = new Element('div');
    var element = new Element('p', {
      id: 'some-paragraph',
      'class': 'come class',
      style: {
        padding: '10pt'
      },
      observe: {
        mouseover: function() { ... }
      }
    });


### #set

    set(String name, String value) -> Element self
    set(Object properties_hash)    -> Element self

Устанавливает атрибут(ы) элемента

    $('element').set('title', 'some title');
  
    $('element').set({
      title: 'some title',
      id:    'some-id'
    });


### #get

    get(String name) -> String value or null if empty

Считывает значение атрибута элемента

    // <div id="div" title="some title"></div>
  
    $('div').get('title'); // -> 'some title'


### #has

    has(String name) -> boolean

Проверяет если данный элемент имеет не пустой атрибут с таким именем

    // <div id="div" title="some title"></div>
  
    $('div').has('title'); // -> true
    $('div').has('rel');   // -> false


### #erase

    erase(String name) -> Element self

Стирает данный атрибут элемента

    // <div id="div" title="some title"></div>
    
    $('div').has('title');   // -> true
    
    $('div').erase('title');
    
    $('div').has('title');   // -> false


### #hidden

    hidden() -> boolean

Проверяет если элемент имеет стиль 'display' равный 'none'
  
__ВНИМАНИЕ:__ Проверяет оба, собственный стиль элемента и вычисленный из
значений каскадных стилей.

    /*
      <style type="text/css">
        #second { display: none }
      </style>
      
      <div id="first" style="display: none"></div>
      <div id="second"></div>
      <div id="third"></div>
    */
   
    $('first').hidden();  // -> true
    $('second').hidden(); // -> true
    $('third').hidden();  // -> false


### #visible

    visible() -> boolean

Проверяет если элемент видим. См. {#hidden} для дополнительной информации.

    $('some-element').visible();


### #hide

    hide([String effect[, Object options]]) -> Element self

Скрывает элемент. Если указано имя существующего визуального эффекта, то этот
эффект будет использован для скрытия элемента.

    $('some-element').hide();
    
    $('some-element').hide('slide');
    $('some-element').hide('slide', {duration: 'long'});


### #show

    show([String effect[, Object options]]) -> Element self

Показывает элемент. Если указано имя существующего визуального эффекта, то
этот эффект будет использован для показа элемента

    $('some-element').show();
  
    $('some-element').show('slide');
    $('some-element').show('slide', {duration: 'long'});


### #toggle

    toggle([String effect[, Object options]]) -> Element self

Переключает состояние видимости элемента (показывает скрытый, скрывает
видимый). Если указано имя существующего визуального эффекта, то он будет
использован для изменения состояния элемента.

    $('some-element').toggle();
    
    $('some-element').toggle('slide');
    $('some-element').toggle('slide', {duration: 'long'});


### #radio

    radio([String effect[, Object options]]) -> Element self

Скрывает все соседние элементы и показывает данный элемент. Если указано
имя существующего визуального эффекта, то он будет использован для
_показа_ данного элемента

    $('some-element').radio();
    
    $('some-element').radio('slide');
    $('some-element').radio('slide', {duration: 'long'});

### #parent

    parent([String css_rule]) -> Element parent or null

Возвращает ссылку на родительский элемент. Если указано css-правило, то этот
метод вернет первый родительский элемент подпадающий под данное правило

    /*
      <div id="one">
        <div id="two">
          <div id="three"></div>
        </div>
      </div>
    */
    
    $('three').parent();       // -> div#two
    $('three').parent('#one'); // -> div#one


### #parents

    parents([String css_rule]) -> Array of elements

Возвращает список _всех_ родительских элементов снизу вверх. Если указано
правило css, то список будет отфильтрован соответствующим образом

    /*
      <div id="one">
        <div id="two">
          <div id="three"></div>
        </div>
      </div>
    */
    
    $('three').parents();       // -> [div#two, div#one]
    $('three').parents('#one'); // -> [div#one]


### #subNodes

    subNodes([String css_rule]) -> Array of elements

Возвращает список под-элементов первого уровня. Опционально отфильтрованный
согласно указанному правилу.

    /*
      <div id="one">
        <div id="two"></div>
        <div id="three"></div>
      </div>
    */
  
    $('one').subNodes();       // -> [div#two, div#three]
    $('one').subNodes('#two'); // -> [div#two]


### #siblings
  
    siblings([String css_rule]) -> Array of eleemnts

Возвращает список соседних по уровню элементов. Опционально отфильтрованный
согласно указанному правилу.

    /*
      <div>
        <div id="one"></div>
        <div id="two"></div>
        <div id="three"></div>
      </div>
    */
  
    $('two').siblings();       // -> [div#one, div#three]
    $('two').siblings('#one'); // -> [div#one]


### #nextSiblings

    nextSiblings([String css_rule]) -> Array of elements

Возвращает список элементов находящихся на одном уровне с данным элементом
и следующих после него. Опционально отфильтрованный согласно указанному правилу.

    /*
      <div>
        <div id="some"></div>
        <div id="one"></div>
        <div id="two"></div>
        <div id="three"></div>
      </div>
    */
    
    $('one').nextSiblings();         // -> [div#two, div#three]
    $('one').nextSiblings('#three'); // -> [div#three]


### #prevSiblings

    prevSiblings([String css_rule]) -> Array of elements

Возвращает список элементов одного с данным элементом уровня, находящихся до
него. Опционально отфильтрованный согласно указанному правилу.

    /*
      <div>
        <div id="one"></div>
        <div id="two"></div>
        <div id="three"></div>
        <div id="some"></div>
      </div>
    */
    
    $('three').nextSiblings();       // -> [div#two, div#one]
    $('three').nextSiblings('#one'); // -> [div#one]


### #next

    next([String css_rule]) -> Element or null

Возвращает следующий за данным элементом соседний элемент. Если
было указано css-правило, то вернет первый элемент подпадающий под него.

    /*
      <div>
        <div id="one"></div>
        <div id="two"></div>
        <div id="three"></div>
      </div>
    */
    
    $('one').next();         // -> div#two
    $('one').next('#three'); // -> div#three


### #prev

    prev([String css_rule]) -> Element or null

Возвращает предыдущий элемент одного с данным элементом уровня. Если
было указано css-правило, то вернет первый элемент подпадающий под него.

    /*
      <div>
        <div id="one"></div>
        <div id="two"></div>
        <div id="three"></div>
      </div>
    */
    
    $('three').prev();       // -> div#two
    $('three').prev('#one'); // -> div#one


### #first

    first(String css_rule) -> Element or null

Возвращает первый элемент во внутренней структуре данного элемента подпадающий
под указанное css-правило.

    /*
      <div id="one">
        <div id="two">
          <div id="three"></div>
        </div>
      </div>
    */
    
    $('one').first('div');    // -> div#two
    $('one').first('#three'); // -> div#three


### #select

    select(String css_rule) -> Array of elements

Возвращает список всех внутренних элементов данного элемента подпадающих
под указанное правило.

    /*
      <div id="one">
        <div id="two">
          <div id="three"></div>
        </div>
      </div>
    */
    
    $('one').select('div');    // -> [div#two, div#three]
    $('one').select('#three'); // -> [div#three]


### #match

    match(String css_rule) -> boolean

Проверяет если данный элемент подпадает под указанное css-правило

    // <div id="some-element"></div>
    
    $('some-element').match('div');  // -> true
    $('some-element').match('span'); // -> false


### #remove

    remove() -> Element self

Удаляет элемент из структуры элементов

    $('some-element').remove();


### #insert

    insert(mixed content[, String position]) -> Element self

Вставляет полученный контент в данный элемент.

В качестве контента может выступать одно из следующих
  
* dom-элемент
* строка с HTML кодом (скрипты будут выполнены)
* Список dom-элементов
* хэш вида {position: content}

В качестве позиции может выступать одно из следующих
  top/bottom/before/after/instead

По умолчанию используется вставка в конец, `bottom`.

    var element = $('some-element');
    
    element.insert(new Element('div', {html: 'new-div'}));
    
    element.insert(new Element('div'), 'top');
    
    element.insert([element1, element2, element3], 'before');
    
    element.insert({
      before: element1,
      after:  element2,
      top:    element3
    });


### #insertTo

    insertTo(Element destination[, String position]) -> Element self

Вставляет данный элемент в указанный, опционально в указанную позицию.

    var element1 = $('element1');
    var element2 = $('element2');
    
    element1.insertTo(element2, 'top');
    
    element2.firstChild === element1;


### #replace

    replace(mixed content) -> Element self

Заменяет данный элемент, полученным контентом.

    // <div id="one"><div id="two"></div></div>
    
    $('two').replace('boo boo boo');
    $('one').innerHTML == 'boo boo boo';


### #update

    update(mixed content) -> Element self

Заменяет внутреннее содержимое элемента, указанным контетом

__ВНИМАНИЕ__: в случае строкового контента, данный метод исполнит
все скрипты _после_ того как обновит содержимое элемента

    // <div id="one">foo bar</div>
    
    $('one').update('something else');
    
    $('one').innerHTML == 'something else';


### #wrap

    wrap(Element wrapper) -> Element self

Оборачивает текущий элемент, полученным

    // <div id="one"><div id="two"></div></div>
    
    $('two').wrap(new Element('div', {id: 'three'}));
    
    $('one').innerHTML == '<div id="three"><div id="two"></div></div>';


### #clean

    clean() -> Element self

Удаляет все содержимое данного элемента

    $('element').clean();


### #empty

    empty() -> boolean

Проверяет если данный элемент не содержит никаких внутренних структур

    $('element').empty();



### #setStyle

    setStyle(String key, String value) -> Element self
    setStyle(Object styles)            -> Element self
    setStyle(String styles_def)        -> Element self

Устанавливает стиль элемента

    $('element').setStyle('display', 'block');
    
    $('element').setStyle({
      display: 'block',
      border:  '1px solid gray'
    });
  
    $('element').setStyle('display:block;color:red');


### #getStyle

    getStyle(String name) -> String value or null

Считывает стиль элемента по имени. Поддерживает оба верблюжий стиль и стиль
с черточками.
  
__ВНИМАНИЕ__: Проверяет оба, собственные стили элемента и вычисленные стили. 

    $('element').hide();
    
    $('element').getStyle('dispaly'); // -> 'none'


### #hasClass

    hasClass(String class) -> boolean

Проверяет если данный элемент имеет указанный css-класс

    var element = $('element');
    
    element.className = 'foo bar';
    
    element.hasClass('foo'); // -> true
    element.hasClass('bar'); // -> true
    element.hasClass('boo'); // -> false


### #setClass

    setClass(String name) -> Element self

Устанавливает указанный css-класс для данного элемента

    element.className = 'foo bar';
    
    element.setClass('boo');
    
    element.className; // -> 'boo'



### #addClass

    addClass(String name) -> Element self

Добавляет указанный css-класс в список классов данного элемента

    element.className = 'foo';
    
    element.addClass('bar');
    
    element.className; // -> 'foo bar'



### #removeClass

    removeClass(String name) -> Element self

Удаляет указанный css-класс из списка классов данного элемента

    element.className = 'foo bar';
    
    element.removeClass('bar');
    
    element.className; // -> 'foo'


### #toggleClass

    toggleClass(String name) -> Element self

Переключает наличие данного css-класса в списке классов данного элемента.
(добавляет если отсутствует и удаляет если присутствует)

    element.className = 'foo';
    
    element.toggleClass('bar')
    element.className; // -> 'foo bar';
    
    element.toggleClass('bar')
    element.className; // -> 'foo';


### #radioClass

    radioClass(String name) -> Element self

Удаляет указанный css-класс со всех соседних элементов и добавляет его к
текущему элементу

    $('element').radioClass('boo');


### #observe

    observe(String eventName, Function listener)             -> Element self
    observe(String eventName, String method[, argument,...]) -> Element self
    observe(String eventName, Array list_list_of_callbacks)  -> Element self
    observe(Object event_listeners_hash)                     -> Element self

Назначет обработчик событий

__УСТАРЕВШЕЕ__: пожалуйста используйте более короткий метод {#on}

    $('element').observe('click', function() {
      // сделать что-либо по этому поводу
    });
    
    $('element').observe('click', 'addClass', 'clicked');
    
    $('element').observe('click', [function1, function2]);
    
    $('element').observe({
      click: function1,
      dblclick: function2
    });


### #on

    on(String eventName, Function listener)             -> Element self
    on(String eventName, String method[, argument,...]) -> Element self
    on(String eventName, Array list_list_of_callbacks)  -> Element self
    on(Object event_listeners_hash)                     -> Element self

Назначает обработчик событий для данного элемента

    $('element').on('click', function() {
      // сделать что-либо по этому поводу
    });
    
    $('element').on('click', 'addClass', 'clicked');

    $('element').on('click', [function1, function2]);
  
    $('element').on({
      click: function1,
      dblclick: function2
    });


### #observes

    observes(Function listener)              -> boolean
    observes(String name, Function listener) -> boolean

Проверяет если данная функция слушает события данного элемента. Вы можете
делать проверку глобально, или по какому-либо конкретному типу событий.

    var func = function() {};
    
    element.on('click', func);
    
    element.observes(func);              // -> true
    element.observes('mouseover', func); // -> false


### #listeners

    listeners()            -> Array of functions
    listeners(String name) -> Array of functions

Возвращает список обработичков событий данного элемента. Возможно 
отфильтрованный по типу события.

    var func = function() {};
    
    element.on('click', func);
    
    element.listeners();            // -> [func]
    element.listeners('click');     // -> [func]
    element.listeners('mouseover'); // -> []



### #stopObserving

    stopObserving(String name)           -> Element self
    stopObserving(Function listener)     -> Element self
    stopObserving(String name, listener) -> Element self

Отключает указанный обработчик событий от данного элемента

    var listener = function() {};
    
    $('element').on('click', listener);
    
    $('element').stopObserving('click');
    
    $('element').stopObserving(listner);
    
    $('element').stopObserving('click', listner);


### #sizes

    sizes() -> Object {x: NN , y: NN}

Возвращает размеры элемента в виде хэша

    var width  = $('element').sizes().x;
    var height = $('element').sizes().y;


### #position

    position() -> Object {x: NN , y: NN }

Возвращает абсолютную позицию данного элемента в виде хэша

    var top  = $('element').position().y;
    var left = $('element').position().x;



### #scrolls

    scrolls() -> Object {x: NN , y: NN }

Возвращает хэш с позициями прокрутки для данного элемента

    var scroll_top  = $('element').scrolls().y;
    var scroll_left = $('element').scrolls().x;


### #dimensions

    dimensions() -> Object

Возвращает все геометрические размеры элемента в одном хэше, включает в
себя следующие ключи `width`, `height`, `top`, `left`, `scrollLeft` и 
`scrollTop`.

    $('element').dimensions();


### #setWidth

    setWidth(number pixels) -> Element self

Устанавливает ширину элемента.

__ВНИМАНИЕ__: данный метод автоматически подстраивает значение ширины под
существующие стили границ и отступов, так чтобы конечный результат был в 
точности равен указанному.

    var element = new Element('div', {
      style: {
        border: '10px solid gray',
        padding: '10px'
      }
    });
    
    element.setWidth(100);
    
    element.offsetWidth; // -> 100
    element.style.width; // -> 80px



### #setHeight

    setHeight(number pixels) -> Element self

Устанавливает высоту элемента.

__ВНИМАНИЕ__: данный метод автоматически подстраивает значение высоты под
существующие стили границ и отступов, так чтобы конечный результат был в 
точности равен указанному.

    var element = new Element('div', {
      style: {
        border: '10px solid gray',
        padding: '10px'
      }
    });
  
    element.setWidth(100);
    
    element.offsetWidth; // -> 100
    element.style.width; // -> 80px

### #resize

    resize(number width, number height) -> Element self
    resize({x: number, y: number})      -> Element self

Устанавливает размеры элемента
  
__ВНИМАНИЕ__: данный метод автоматически подстраивает размеры под
существующие стили границ и отступов, так чтобы конечный результат был в 
точности равен указанному.


    var element = new Element('div', {
      style: {
        border: '10px solid gray',
        padding: '10px'
      }
    });
    
    element.resize(100, 100);
    
    element.offsetHeight; // -> 100
    element.offsetWidth;  // -> 100
    element.style.width;  // -> 80px
    element.style.height; // -> 80px


### #moveTo

    moveTo(number left, number top) -> Element self
    moveTo({x: number, y: number})  -> Element self

Перемещает элемент в указанную позицию

    element.moveTo(100, 100);
    element.moveTo({x: 100, y: 100});


### #scrollTo

    scrollTo(number left, number top) -> Element self
    scrollTo({x: number, y: number})  -> Element self

Устанавливает указанную позицию скроллинга для элемента

    element.scrollTo(100, 100);
    element.scrollTo({x: 100, y: 100});

### #scrollThere

    scrollThere() -> Element self

Смещает прокрутку текущего окна к данному элементу

    element.scrollThere();


### #load

    load(String url[, Object options]) -> Element self

Загружает контент с указанного адреса и обновляет свойство innerHTML данного
элемента текстом из результатов запроса.

Данный метод может получает любые стандартные опции класса {Xhr}.
  
__ВНИМАНИЕ:__ создает `GET` запрос по умолчанию.

    element.load('/something');
    
    element.load('/something', {
      method:  'post',
      spinner: 'spinner-id'
    });

