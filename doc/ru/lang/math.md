# Математический модуль

Мы перегружаем метод {.random}, так чтобы он был более комфортен в работе
и предоставлял дополнительную функциональность

### .random

    Math.random()                           -> Float random between 0 and 1
    Math.random(Integer end)                -> Integer random between 0 and the end number
    Math.random(Integer start, Integer end) -> Integer random between the start and end

Оригинальный метод был перегружен для возможности указания рамок.

    Math.random();    // случайный Float   от 0 до 1
    Math.random(10);  // случайный Integer от 0 до 10
    Math.random(1,4); // случайный Integer от 1 до 4

