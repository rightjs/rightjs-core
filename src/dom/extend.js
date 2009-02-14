/**
 * This module handling the dom module related extesions
 *
 */


//
// Genarating Element fast class level methods which mirror the Element instance
// level methods, but getting executed without actual element extending
//

var stub_this_calls = function(string) {
  return string.replace(/this\.([a-z0-9_]+)(\.(call|apply))?\((?:.*)\)/img, function(match) {
    var name = match.substr(5).split(/\.|\(/)[0], end = match.substr(match.indexOf('(')+1);
    
    if (isFunction(Element.Methods[name])) {
      match = "Element."+ name +
        (match.match(new RegExp("this."+name+"(\.(call|apply))?\()"))[1] || '')+
        "(this"+(end.match(/^\s*\)/) ? '' : ', ')+stub_this_calls(end);
    }
    
    return match;
  }
  
  // this[bla_bla_bla] like hacks handling
  ).replace(/this\[(?:.+?)\]\((?:.*)\)/img, function(match) {
    var els = match.split(/\[(?:.+)\]\(/im), end = els[1];
    
    return "Element"+match.substr(4, match.length - end.length - 4)+
        "this" + (end.match(/^\s*\)/) ? '' : ', ')+stub_this_calls(end);
  }
  
  // some custom case replacements
  ).replace(/this\.insertions/g, 'Element.Methods.insertions');
};

for (var key in Element.Methods) {
//$w('subNodes hide toggle').each(function(key) {
  
  if (isFunction(Element.Methods[key])) {
    
    eval("var func = "+stub_this_calls(Element.Methods[key].toString()));
    
    //alert(func);
    
    Element[key] = (function(method) {
      return function() {
        var args = $A(arguments), element = args.shift();

        return method.apply(element, args);
      };
    })(func);
  }
  
//})
}
