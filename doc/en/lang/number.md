# Number

RightJS extends the `Number` unit in order to make it to support the {Math}
module methods in more natural, object-oriented way. Plus it adds the Ruby
style handy loop methods too.


### #abs

    abs() -> number absolute value

Returns the absolute value of the number

    -1..abs(); // -> 1
    22..abs(); // -> 22



### #ceil

    ceil() -> number

Returns the smallest integer bigger than or equal to the current number

    2.2.ceil(); // -> 3


### #floor

    floor() -> number

Returns the biggest integer smaller than or equal to the current number

    2.2.floor(); // -> 2


### #round

    round([Integer base]) -> number

Returns the closest integer number from the current number. You also
can specify how many numbers after the decimal pointer should be left

    2.2.round();    // -> 2
    8.8.round();    // -> 8
    
    4.444.round(1); // -> 4.4
    4.444.round(2); // -> 4.44
    4.444.round(3); // -> 4.444


### #times

    times(Function lambda[, Object scope]) -> number self

Call the given lambda function the number of times equal to the current 
number
    
    var numbers = [];
    4..times(function(i) {
      numbers.push(i);
    });
    
    numbers; // -> [0,1,2,3]



### #upto

    upto(number stop, Function lambda[, Object scope]) -> number self

Iterates the given lambda function from the current number up to the given 
stop number

    var numbers = [];
    
    4..upto(8, function(i) {
      numbers.push(i);
    });
    
    numbers; // -> [4,5,6,7,8]



### #downto

    downto(number end, Function lambda[, Object scope]) -> number self

Iterates the given lambda function from the current number down to the given 
stop number

    var numbers = [];
    
    8..downto(4, function(i) {
      numbers.push(i);
    });
    
    numbers; // [8,7,6,5,4]
