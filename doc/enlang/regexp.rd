### RegExp.escape

== Semantic
  RegExp.escape(String string) -> String new

== Description
  Escapes all the command chars in the string so it could be safely used as a 
  regular expression

== Example
  RegExp.escape('[{!}]'); // -> "\[\{\!\}\]"