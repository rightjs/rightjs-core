# Documentation Formatting Rules

We use the [Markdown](http://en.wikipedia.org/wiki/Markdown) formatting
system to maintain the api-documentation over here.


## Files organization

All the files should have the `.md` extensions and be named after the classes
they describe. The all the classes should be in directories accordingly to the
directories structure in the `src/` directory.

And finally every translation should have it's own copy of the entire docs
structure in a separated folder.

Default, English documentation is in the `en/` directory.


## Method descriptions

When you describe a unit, keep it's basic description in the following order

1. H1 header with the unit name
2. Basic description of the unit
3. List of the methods in the following format (the order doesn't matter)
   
   --------------------------------------
   ## #methodName (or '.methodName' for class level methods)
   
       method(semantic) -> result
   
   Method description in here
   
       some(example, code)
   
   --------------------------------------


## Methods cross-references

Use the RDoc style units cross-references like that {Klass}, {Klass#method} or
{Klass.method} so we could link them together later.


--
When it doubts empty the magazine.
