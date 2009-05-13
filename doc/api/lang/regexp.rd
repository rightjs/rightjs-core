### RegExp.escape

== Semantic
  RegExp.escape(String string) -> String new

== Description
  Escapes all the command chars in the string so it could be safely used in a 
  regular expression

== Example
  RegExp.escape('[{!}]'); // -> "\[\{\!\}\]"