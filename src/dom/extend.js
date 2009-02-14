/**
 * This module handling the dom module related extesions
 *
 */


//
// Genarating Element fast class level methods which mirror the Element instance
// level methods, but getting executed without actual element extending
//

var stub_this_calls = function(string) {
  return string.replace(/this\.([a-z0-9_]+)\((?:.*)\)/img, function(match) {
    var name = match.substr(5).split('(')[0], end = match.substr(match.indexOf('(')+1);
    
    if (isFunction(Element.Methods[name])) {
      match = "Element."+name+"(this"+(end.match(/^\s*\)/) ? '' : ', ')+stub_this_calls(end);
    }
    
    return match;
  }
  
  // this[bla_bla_bla] like hacks handling
  ).replace(/this\[(?:.+?)\]\((?:.*)\)/img, function(match) {
    var els = match.split(/\[(?:.+)\]\(/im), end = els[1];
    
    return "Element"+match.substr(4, match.length - end.length - 4)+
        "this" + (end.match(/^\s*\)/) ? '' : ', ')+stub_this_calls(end);
  });
};

for (var key in Element.Methods) {
//$w('toggle toggleClass getStyle getOwnStyle getViewStyle _cleanStyle').each(function(key) {
  
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
