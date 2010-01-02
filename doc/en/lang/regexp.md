# RegExp

### .escape

    RegExp.escape(String string) -> String new

Escapes all the command chars in the string so it could be safely used as a 
part of a regular expression

    RegExp.escape('[{!}]'); // -> "\[\{\!\}\]"