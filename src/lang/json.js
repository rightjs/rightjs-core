if (!window.JSON) {
  window.JSON = (function() {
    var
    // see the original JSON decoder implementation for descriptions http://www.json.org/json2.js
    cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    specials = {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"' : '\\"', '\\': '\\\\'},
    quotables = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;


    // quotes the string
    function quote(string) {
      return string.replace(quotables, function(chr) {
        return specials[chr] || '\\u' + ('0000' + chr.charCodeAt(0).toString(16)).slice(-4);
      });
    }

    // adds the leading zero symbol
    function zerofy(num) {
      return (num < 10 ? '0' : '')+num;
    }

    return {
      stringify: function(value) {
        switch(typeof(value)) {
          case 'boolean': return String(value);
          case 'number':  return String(value+0);
          case 'string':  return '"'+ quote(value) + '"';
          case 'object':
            if (value === null) {
              return 'null';
            } else if (isArray(value)) {
              return '['+$A(value).map(JSON.stringify).join(',')+']';

            } else if (to_s.call(value) === '[object Date]') {
              return '"' + value.getUTCFullYear() + '-' +
                zerofy(value.getUTCMonth() + 1)   + '-' +
                zerofy(value.getUTCDate())        + 'T' +
                zerofy(value.getUTCHours())       + ':' +
                zerofy(value.getUTCMinutes())     + ':' +
                zerofy(value.getUTCSeconds())     + '.' +
                zerofy(value.getMilliseconds())   + 'Z' +
              '"';

            } else {
              var result = [], key;
              for (key in value) {
                result.push('"'+key+'":'+JSON.stringify(value[key]));
              }
              return '{'+result.join(',')+'}';
            }
        }
      },

      parse: function(string) {
        if (isString(string) && string) {
          // getting back the UTF-8 symbols
          string = string.replace(cx, function (a) {
            return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
          });

          // checking the JSON string consistency
          if (/^[\],:{}\s]*$/.test(string.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
            .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
            .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
              return new Function('return '+string)();
            }
        }

        throw "JSON parse error: "+string;
      }
    };
  })();
}