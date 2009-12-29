# Documentation Formatting Rules

We use the [Markdown](http://en.wikipedia.org/wiki/Markdown) formatting
system to maintain the api-documentation over here.


## Files organization

All the files should have the `.md` extensions and be named after the classes
they describe. All the classes should be in directories accordingly to the
folders structure in the `src/` directory.

And finally every translation should have it's own copy of the entire docs
structure in a separated folder.

Default, English documentation goes to the `en/` directory.


## Method descriptions

When you describe an unit, keep it's description in the following order

1. H1 header with the unit name
2. Basic description of the unit
3. List of the methods in the following format (the order doesn't matter)
   
   --------------------------------------
   ### #methodName (or '.methodName' for class level methods)
   
       method(semantic) -> result
   
   Method description in here
   
       some(example, code)
   
   --------------------------------------


## Units cross-references

Use the RDoc style unit cross-references like that {Klass}, {Klass#method} or
{Klass.method} so we could link them together later.


## Headers usage

In the documentation we use three types of headers in the following way

* H1 (#) for the very first header as a whole document header
* H2 (##) is used as a plain text documentation chapters
* H3 (###) is used as a method description header


--
When in doubts, empty the magazine.
