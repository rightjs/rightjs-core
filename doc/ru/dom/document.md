# Документ

Объект `document` в RightJS расширен функциональностью из модуля {Observer}
и дополнительно обрабатывает событие `dom-ready`.

## Отслеживание загрузки документа

Событие конца загрузки документа в RightJS называется просто `ready` и вы
можете назначить его обработчик любым стандартным способом.

    document.onReady(function() {...});
    document.on('ready', function() {...});
    document.observe('ready', function() {...});

Это событие можно точно так же обрабатывать с объектом `window`.


### on

    on(String name, Function callback[, arguments, ...]) -> document self

Назначает обработчик события

    document.on('ready', function() {....});

### observe

    observe(String name, Function callback[, args[, ...]]) -> document self

Назначает обработчик события

__УСТАРЕВШЕЕ__: пожалуйста используйте более короткий метод {#on}

    document.observe('ready', function() {...});


### onReady

    onReady(Function callback[, arguments[, ....]]) -> document self

Сокращение для `on('ready', ...)`

    document.onReady(function() {....});

