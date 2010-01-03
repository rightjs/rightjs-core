# Опции

`Options` - это совместно используемый модуль для обработки передаваемых в
объекты опций.

В целом это просто метод `setOptions` который получает переданные 
пользователем опции, смешивает их с опциями по умолчанию и устанавливает
внутреннюю переменную `options`.

    var Steake = new Class({
      include: Options,
      
      // опции по умолчанию
      Options: {
        cooked: 'well done',
        sauce:  'pepper',
        wedges: 'salad',
        garner: 'cheeps'
      }
      
      initialize: function(options) {
        this.setOptions(options);
      }
    });
  
    // без пользовательских опций, объект будет использовать
    // те что идут по умолчанию
    var stake = new Stake();
    stake.options == Stake.Options;
    
    // если указать какие-либо из опций то они будут
    // смешаны с остальными
    var stake = new Stake({
      cooked: 'rare',
      sauce:  'chilly'
    });
  
    stake.options == {
      cooked: 'rare',
      sauce:  'chilly',
      wedges: 'salad',
      garner: 'cheeps'
    };

## Опции по умолчанию

Опции по умолчанию могут быть расположенны в любом месте, на уровне класса,
на уровне объекта или в любом из родительских классов. Модуль будет
просматривать их снизу вверх и использует первое найденное.

    var Klass = new Class({
      include: Options,
    
      Options: {....}
    });
  
    // или на уровне класса
    var Klass = new Class({
      include: Options,
      extend: {
        Options: {....}
      }
    });
  
    // или в родительском классе
    var Klass1 = new Class({
      include: Options,
    
      extend: {
        Options: {....}
      }
    });
  
    var Klass2 = new Class(Klass1, {
      initialize: function(options) {
        this.setOptions(options);
      }
    });

Опции по умолчанию должны быть названы как объект или как константа, т.е.
`'OPTIONS'` либо `'Options'`

    var Klass = new Class({
      include: Options,
    
      OPTIONS: {.....},
    
      // либо
      Options: {.....}
    });

### #setOptions

    setOptions(Object options) -> Object self instance

Устанавливает опции

    var object = new ClassWithOptions();
    
    object.setOptions({a: 1});
    
    object.options == {a: 1};


### #cutOptions
  
    cutOptions(arguments) -> Array of arguments without options

Отрезает хэш опций с конца списка аргументов, пересылает его в метод 
{#setOptions} и возвращает оставшиеся аргументы в виде массива.

    var Klass = new Class({
      include: Options,
    
      /**
       * данный конструктор может получать любое число аргументов
       * с хэшем опций на конце
       */
      initialize: function() {
        var args = this.cutOptions(arguments);
      }
    });
  
    var o = new Klass(1, {opts:1});
    var o = new Klass(1, 2, {opts:1});
    var o = new Klass(1, 2, 3, {opts:1});
  
