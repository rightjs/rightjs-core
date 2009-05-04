/**
 * This module handling the dom module related extesions
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */


//
// Genarating Element fast class level methods which mirror the Element instance
// level methods, but getting executed without actual element extending
//
(function() {
  
  $ext(Element.prototype, Element.Methods);
  
  var stub_this_calls = function(string) {
    return string.replace(/this\.([a-z0-9_]+)(\.(call|apply))?\((?:(.|\n)*)\)/img, function(match) {
      var name = match.substr(5).split(/\.|\(/)[0], end = stub_this_calls(match.substr(match.indexOf('(')+1));

      if (isFunction(Element.Methods[name])) {
        match = "Element."+ name +
          (match.match(new RegExp("this."+name+"(\.(call|apply))?\()"))[1] || '')+
          "(this"+(end.match(/^\s*\)/) ? '' : ', ')+end;
      } else {
        // attaching the processed end to make sure everything is handled
        match = match.substr(0, match.indexOf('(')+1) + end;
      }

      return match;
    }

    // handling hacks like this[bla_bla_bla]
    ).replace(/this\[(?:.+?)\]\((?:(.|\n)*)\)/img, function(match) {
      var els = match.split(/\[(?:.+)\]\(/im), end = els[1];

      return "Element"+match.substr(4, match.length - end.length - 4)+
          "this" + (end.match(/^\s*\)/) ? '' : ', ')+stub_this_calls(end);
    }

    // some custom case replacements
    ).replace(/this\.insertions/g, 'Element.Methods.insertions'
    ).replace(/this\._oO/g, 'Element.Methods._oO');
  };

  for (var key in Element.Methods) {
    if (isFunction(Element.Methods[key])) {
//      console.log(key);
//      console.log(Element.Methods[key].toString());
//      console.log(stub_this_calls(Element.Methods[key].toString()));
      eval("var func = "+stub_this_calls(Element.Methods[key].toString()));
      
      
      Element[key] = (function(method) {
        return function() {
          var args = $A(arguments), element = args.shift();

          return method.apply(element, args);
        };
      })(func);
    }
  }
  
})();
