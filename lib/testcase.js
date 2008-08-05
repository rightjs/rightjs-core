/**
 * TestCase - JavaScript testing framework, version 2.0.2
 * Copyright (C) 2007-2008 Nikolay V. Nemshilov aka St. <nemshilov-gmail-com>
 *
 * The library is freely distributable under the terms of an MIT-style license
 * For details, see the TestCase web site: http://testcase.rubyforge.net
 */


var TestCaseUtil = {
  create_class: function() {
    var superklass = null, params = this.to_a(arguments);
    if (typeof params[0] == 'function')
      superklass = params.shift();
    var klass = function() {
      return this.initialize ? this.initialize.apply(this, arguments) : this;
    }
    if (superklass) {
      var subclass = function() { };
      subclass.prototype = superklass.prototype;
      klass.prototype = new subclass;
      klass.superclass = superklass;
    }
    klass.prototype.constructor = klass;
    if (params[0])
      this.extend(klass.prototype, params[0]);
    return klass;
  },
  extend: function(object, properties, dont_overwrite) {
    for (key in properties)
      if (!(dont_overwrite && typeof object[key] != 'undefined'))
        object[key] = properties[key];
    return object;
  },
  extend_with_camelized_aliases: function(object, mixin) {
    var camelized_mixin = {};
    for (key in mixin) {
      var parts = key.split('_'), camelized = parts[0];
      for (var i=1; i < parts.length; i++)
        camelized += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);
      camelized_mixin[camelized] = mixin[key];
    }
    return TestCaseUtil.extend(object, camelized_mixin);
  },
  extend_fully_object_and_prototype: function(object, mixin) {
    TestCaseUtil.extend(object, mixin);
    TestCaseUtil.extend(object.prototype, mixin);
    TestCaseUtil.extend_with_camelized_aliases(object, mixin);
    return TestCaseUtil.extend_with_camelized_aliases(object.prototype, mixin);
  },
  equal: function(obj1, obj2) {
    return TestCaseUtil.to_s(obj1) == TestCaseUtil.to_s(obj2);
  },
  to_a: function(it) {
    var a = [];
    for (var i=0; i < it.length; i++)
      a.push(it[i]);
    return a;
  },
  to_s: function(object, one_level) {
    var value = this._try_to_s(object);
    if (value !== object) return value;
    var entries = this._get_object_stringified_entries(
      one_level ? this._one_level_to_s : this.to_s, object
    );
    return object instanceof Array ? '['+ entries.join(', ')+ ']' : '{' + entries.join(', ') + '}';
  },
  debug: function(object) {
    return this.to_s(object, true);
  },
  MAX_OBJECT_STRING_LENGTH: 80,
  to_pretty_s: function(object, offset) {
    if (object == null) { return 'null'; }
    else if (typeof object != 'object') {
      return this.to_s(object);
    } else {
      var offset = offset || 0;
      var object_s = this.to_s(object);
      if (object_s.length > this.MAX_OBJECT_STRING_LENGTH) {
        if (object instanceof Array) {
          var len = object.length;
        } else {
          var len = 0;
          for (var key in object) {
            len++;
          }
        }
        if (len > 1) {
          var entries = this._get_object_stringified_entries(
            this.to_pretty_s, object, offset + 1
          );
          var offset_s = '';
          for (var i=0; i < offset; i++) {
            offset_s += '  ';
          }
          object_s = object instanceof Array ? 
            "[" + entries.join(",\n "+ offset_s) + "\n"+offset_s+"]" : 
            "{" + entries.join(",\n "+ offset_s) + "\n"+offset_s+"}" ;
        }
      }
      return object_s;
    }
  },
  _get_object_stringified_entries: function(method, object, param) {
    var entries = [];
    if (object instanceof Array) {
      for (var i=0; i < object.length; i++) {
        entries.push(method.apply(this, [object[i], param]));
      }
    } else {
      for (var property in object) {
        entries.push(this.to_s(property) + ': ' + method.apply(this, [object[property], param]));
      }
    }
    return entries;
  },
  _one_level_to_s: function(object) {
    var value = this._try_to_s(object);
    if (value !== object) {
      return value;
    } else if (object instanceof Array) {
      return '[...]';
    } else {
      return '{...}';
    }
  },
  _try_to_s: function(object) {
    switch (typeof object) {
      case 'undefined':
      case 'unknown': return 'undefined';
      case 'string': return '"'+object+'"';
      case 'number': return ''+object;
      case 'function':
      case 'boolean': return object.toString();
    }
    if (object === null) return 'null';
    if (object.nodeType == 1)
      return '<'+object.tagName+
          (object.id ? ' id="'+object.id+'"':'')+
          (object.className ? ' class="'+object.className+'"':'')+
          (object.title ? ' title="'+object.title+'"':'')+
          (object.type ? ' type="'+object.type+'"':'')+
        '>'+object.innerHTML+'</'+object.tagName+'>';
    return object;
  },
  get_object_class_name: function(object) {
    if (object === null) { return 'Null'; }
    switch (typeof object) {
      case 'string':   return 'String';
      case 'boolean':  return 'Boolean';
      case 'number':   return 'Number';
      case 'function': return 'Function';
      case 'object':
        if (typeof object.constructor != 'undefined') {
          var match = object.constructor.toString().match(/function\s*(\w+)/);
          if (match && match.length == 2) {
            return match[1];
          }
          for (var key in self) {
            try {
              if (object instanceof self[key])
                return key;
            } catch (e) {}
          }
          if (object instanceof Array) {
            return 'Array';
          } else {
            return 'Object';
          }
        }
    }
    return 'Unknown';
  },
  get_class_name: function(klass) {
    if (klass === null) { return 'Null'; }
    switch (klass) {
      case String:   return 'String';
      case Boolean:  return 'Boolean';
      case Number:   return 'Number';
      case Function: return 'Function';
      case Array:    return 'Array';
      case Object:   return 'Object';
      default:
        for (var key in self) {
          if (klass == self[key])
            return key;
        }
    }
    return 'Unknown';
  },
  Browser: {
    IE:     !!(window.attachEvent && !window.opera),
    Opera:  !!window.opera,
    WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
    Gecko:  navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1,
    MobileSafari: !!navigator.userAgent.match(/Apple.*Mobile.*Safari/),
    Konqueror: navigator.userAgent.indexOf('Konqueror') != -1
  },
  $: function(element) {
    return typeof element == 'string' ? document.getElementById(element) : element;
  },
  $$: function(css_rule) {
    return this.Element.select(document, css_rule);
  }
};
/* ------------------------------------------------------------------- */

TestCaseUtil.Array = {
  include: function(list, item) {
    for (var i=0; i < list.length; i++)
      if (list[i] == item)
        return true;
    return false;
  },
  merge: function(list1, list2) {
    for (var i=0; i < list2.length; i++) {
      if (!this.include(list1, list2[i]))
        list1.push(list2[i]);
    }
    return list1;
  },
  without: function(list, item) {
    var new_list = [];
    for (var i=0; i < list.length; i++)
      if (list[i] != item)
        new_list.push(list[i]);
    return new_list;
  },
  uniq: function(list) {
    var new_list = [];
    for (var i=0; i < list.length; i++)
      if (!this.include(new_list, list[i]))
        new_list.push(list[i]);
    return new_list;
  },
  find: function(list, callback) {
    for (var i=0; i < list.length; i++)
      if (callback(list[i]))
        return list[i];
    return null;
  },
  each: function(list, callback) {
    for (var i=0; i < list.length; i++)
      callback(list[i]);
    return list;
  }
};
/* ------------------------------------------------------------------- */

TestCaseUtil.Event = {
  KEY_UP: 38, 
  observe: function(element, name, callback) {
    var element = TestCaseUtil.$(element);
    if (element.addEventListener) {
      element.addEventListener(name, callback, false);
    } else {
      element.attachEvent("on" + name, callback);
    }
    return element;
  },
  stop: function(event) {
    if (event.stopPropagation) {
      event.stopPropagation();
      event.preventDefault();
    } else {
      event.cancelBubble = true;
      event.returnValue = false;
    }
  },
  element: function(event) {
    var target = event.srcElement ? event.srcElement : event.target;
    return (!target || target.nodeType == 1) ? target : target.parentNode;
  },
  pointerX: function(event) {
    return this.pointer(event).x;
  },
  pointerY: function(event) {
    return this.pointer(event).y;
  },
  pointer: function(event) {
    return {
      x: event.pageX || (event.clientX +
        (document.documentElement.scrollLeft || document.body.scrollLeft)),
      y: event.pageY || (event.clientY +
        (document.documentElement.scrollTop || document.body.scrollTop))
    };
  }
};
/* ------------------------------------------------------------------- */

TestCaseUtil.Element = {
  visible: function(element) {
    return TestCaseUtil.$(element).style.display != 'none';
  },
  show: function(element) {
    TestCaseUtil.$(element).style.display = '';
  },
  hide: function(element) {
    TestCaseUtil.$(element).style.display = 'none';
  },
  toggle: function(element) {
    if (this.visible(element))
      this.hide(element);
    else
      this.show(element);
  },
  up: function(element, css_rule) {
    return this.Selector.match_atom(element, css_rule) ? element :
      (element.parentNode ? this.up(element.parentNode, css_rule) : null);
  },
  down: function(element, css_rule) {
    return this.Selector.find_first(element, css_rule);
  },
  select: function(element, css_rule) {
    return this.Selector.find_all(element, css_rule);
  },
  has_class_names: function(element, class_names) {
    for (var i=0; i < class_names.length; i++)
      if (!this.has_class_name(element, class_names[i]))
        return false;
    return true;
  },
  has_class_name: function(element, class_name) {
    var elementClassName = element.className;
    return (elementClassName && elementClassName.length > 0 && (elementClassName == class_name ||
      new RegExp("(^|\\s)" + class_name + "(\\s|$)").test(elementClassName)));
  },
  add_class_name: function(element, class_name) {
    if (!this.has_class_name(element, class_name))
      element.className += (element.className ? ' ' : '') + class_name;
    return element;
  },
  remove_class_name: function(element, class_name) {
    element.className = element.className.replace(
      new RegExp("(^|\\s+)" + class_name + "(\\s+|$)"), ' ').replace(/^\s+|\s+$/g, '');
    return element;
  },
  has_attributes: function(element, attrs) {
    for (key in attrs)
      if (attrs[key] != null && element[key] != attrs[key])
        return false;
    return true;
  }
};
/* ------------------------------------------------------------------- */

TestCaseUtil.Element.Selector = {
  find_first: function(element, css_rule) {
    var founds = this.find_all(element, css_rule);
    return founds.length ? founds[0] : null;
  },
  find_all: function(element, css_rule) {
    var founds = [], element = TestCaseUtil.$(element);
    if (typeof css_rule == 'string')
      css_rule = this._parse_rule(css_rule);
    if (css_rule[0] instanceof Array) {
      for (var i=0; i < css_rule.length; i++)
        TestCaseUtil.Array.merge(founds, this.find_all(element, css_rule[i]));
    } else {
      var css_atom = css_rule.shift();
      switch (css_atom.rel) {
        case '>': founds = this._find_immidiate_descendants(element, css_atom); break;
        case '+': founds = this._find_next_sibling(element, css_atom);          break;
        case '~': founds = this._find_late_siblings(element, css_atom);         break;
        default:  founds = this._find_descendants(element, css_atom);
      }
      if (css_rule.length > 0) { 
        var sub_founds = [];
        for (var i=0; i < founds.length; i++) {
          var css_rule_clone = [];
          for (var j=0; j < css_rule.length; j++)
            css_rule_clone.push(TestCaseUtil.extend({}, css_rule[j]));
          TestCaseUtil.Array.merge(sub_founds, this.find_all(founds[i], css_rule_clone));
        }
        founds = sub_founds;
      }
    }
    return founds;
  },
  _find_descendants: function(element, css_atom, immidiates_only) {
    var founds = [], child = element.firstChild;
    while (child) {
      if (child.nodeType == 1) {
        if (this._fully_match_atom(child, css_atom, element) && 
            !TestCaseUtil.Array.include(founds, child)) {
              founds.push(child);
        }
        if (!immidiates_only)
          TestCaseUtil.Array.merge(founds, this._find_descendants(child, css_atom));
      }
      child = child.nextSibling;
    }
    return founds;
  },
  _find_immidiate_descendants: function(element, css_atom) {
    return this._find_descendants(element, css_atom, true);
  },
  _find_next_sibling: function(element, css_atom) {
    var founds = [], node = element.nextSibling;
    while (node) {
      if (node.nodeType == 1) {
        if (this._fully_match_atom(node, css_atom, element) &&
            !TestCaseUtil.Array.include(founds, node))
              founds.push(node);
        break;
      }
      node = node.nextSibling;
    }
    return founds;
  },
  _find_late_siblings: function(element, css_atom) {
    var founds = [], node = element.nextSibling;
    while (node) {
      if (node.nodeType == 1) {
        if (this._fully_match_atom(node, css_atom, element) &&
           !TestCaseUtil.Array.include(founds, node))
             founds.push(node);
      }
      node = node.nextSibling;
    }
    return founds;
  },
  _fully_match_atom: function(element, css_atom, parent_node) {
    return this.match_atom(element, css_atom) &&
           this._match_pseudo(parent_node, element, css_atom.pseudo);
  },
  _match_pseudo: function(element, child, pseudo) {
    switch (pseudo) {
      case 'first-child': return this._is_first_child(element, child);
      case 'last-child':  return this._is_last_child(element, child);
      case 'only-child':  return this._is_only_child(element, child);
      default: return true;
    }
  },
  _is_first_child: function(element, child) {
    var node = element.firstChild;
    while (node) {
      if (node.nodeType == 1)
        return node == child;
      node = node.nextSibling;
    }
    return false;
  },
  _is_last_child: function(element, child) {
    var node = element.lastChild;
    while (node) {
      if (node.nodeType == 1)
        return node == child;
      node = node.previousSibling;
    }
    return false;
  },
  _is_only_child: function(element, child) {
    var found = null, node = element.firstChild;
    while (node) {
      if (node.nodeType == 1) {
        if (found)
          return false; 
        else
          found = node;
      } 
      node = node.nextSibling;
    }
    return found == child;
  },
  match_atom: function(element, css_atom) {
    if (typeof css_atom == 'string')
      css_atom = TestCaseUtil.Element.Selector._parse_atom(css_atom);
    return (css_atom.tag_name == '*' || element.tagName == css_atom.tag_name)
      && TestCaseUtil.Element.has_class_names(element, css_atom.class_names) 
      && TestCaseUtil.Element.Selector._match_css_attributes(element, css_atom.attrs)
      && (!css_atom.id || element.id == css_atom.id);
  },
  _match_css_attributes: function(element, attrs_def) {
    for (var i=0; i < attrs_def.length; i++) {
      var match = false;
      switch (attrs_def[i].type) {
        case '|=':
          match = (typeof element[attrs_def[i].name] == 'string') && (
            element[attrs_def[i].name] == attrs_def[i].value ||
            new RegExp("(^|\-)" + attrs_def[i].value + "(\-|$)").test(element[attrs_def[i].name])
          );
          break;
        case '~=':
          match = (typeof element[attrs_def[i].name] == 'string') && (
            element[attrs_def[i].name] == attrs_def[i].value ||
            new RegExp("(^|\\s)" + attrs_def[i].value + "(\\s|$)").test(element[attrs_def[i].name])
          );
          break;
        default:
          match = element[attrs_def[i].name] == attrs_def[i].value;
      }
      if (!match) return false;
    }
    return true;
  },
  _parse_rule: function(css_rule) {
    var rules = css_rule.split(',');
    var recognized_rules = [];
    for (var i=0; i < rules.length; i++) {
      var rule = rules[i].replace(/^\s+|\s+$/g, '');
      var match, separator_pos, recognized_rule = [];
      var relation = null;
      while ((match = rule.match(/(\s*([~>+ ])\s*)[^=]/))) {
        separator_pos = rule.indexOf(match[0]);
        recognized_rule.push({
          rule: rule.substring(0, separator_pos).replace(/^\s+|\s+$/g, ''),
          rel: relation
        });
        relation = match[2]; 
        rule = rule.substr(separator_pos+(match[1].length==1 ? 1 : match[1].length-1)).replace(/^\s+|\s+$/g, '');
      }
      recognized_rule.push({ rule: rule, rel: relation });
      for (var j=0; j < recognized_rule.length; j++)
        TestCaseUtil.extend(recognized_rule[j], this._parse_atom(recognized_rule[j].rule));
      recognized_rules.push(recognized_rule);
    }
    return recognized_rules;
  },
  _id_re: /#[^\[\.]*/,
  _attrs_re: /\[((?:[\w-]*:)?[\w-]+)\s*(?:([!^$*~|]?=)\s*((['"])([^\4]*?)\4|([^'"][^\]]*?)))?\]/, 
  _parse_atom: function(rule) {
    var atom = {
      tag_name: '*',      
      id: null,
      class_names: [],
      pseudo: null,
      attrs: []
    };
    var els = rule.split(':');
    if (els.length > 1) {
      atom.pseudo = els[1].toLowerCase();
      rule = els[0];
    }
    while ((attr_match = rule.match(this._attrs_re))) {
      atom.attrs.push({
        name: attr_match[1],
        type: attr_match[2],
        value: attr_match[5]
      });
      rule = rule.replace(attr_match[0], '');
    }
    if ((id_match = rule.match(this._id_re))) {
      atom.id = id_match[0].substr(1);
      rule = rule.replace(id_match[0], '');
    }
    atom.class_names = rule.split('.');
    atom.tag_name = atom.class_names.shift().toUpperCase();
    if (atom.tag_name == '')
      atom.tag_name = '*';
    return atom;
  }
};

/* ------------------------------------------------------------------- */

TestCaseUtil.Diff = {
  calc: function(obj1, obj2) {
    if (TestCaseUtil.get_object_class_name(obj1) != TestCaseUtil.get_object_class_name(obj2))
      throw "The given objects are instances of different classes";
    if (obj1 == null || obj2 == null) throw "One of the objects is null";
    if (obj1 == obj2) return [];
    switch (typeof obj1) {
      case 'string':   return TestCaseUtil.Diff._string_diff.apply(TestCaseUtil.Diff, [obj1, obj2]);
      case 'function': return TestCaseUtil.Diff._string_diff.apply(TestCaseUtil.Diff, [obj1.toString(), obj2.toString()]);
      case 'boolean':
      case 'number':   return obj1 == obj2 ? [] : [{del: obj1}, {ins: obj2}];
      default:         return TestCaseUtil.Diff[obj1 instanceof Array ? '_array_diff' : '_object_diff'].apply(TestCaseUtil.Diff, [obj1, obj2]);
    }
  },
  _string_diff: function(str1, str2) {
    return this.__compact(
      this.__calc_diff(str1.split("\n"), str2.split("\n")), 
      function (group, entry) { return group +"\n"+ entry; }
    );
  },
  _array_diff: function(list1, list2) {
    var diff = this.__calc_diff(list1, list2);
    for (var i=0; i < diff.length; i++) {
      var key = 'eql';
      if (typeof diff[i]['del'] != 'undefined') {
        key = 'del';
      } else if (typeof diff[i]['ins'] != 'undefined') {
        key = 'ins';
      }
    }
    return diff;
  },
  _object_diff: function(obj1, obj2) {
    var lists = [[], []], objects = [obj1, obj2];
    for (var i=0; i < 2; i++) {
      for (var key in objects[i]) {
        lists[i].push( key+"{:_key-sep_:}"+TestCaseUtil.to_s(objects[i][key]) );
      }
    }
    var diff = this.__calc_diff(lists[0], lists[1]);
    var collect = { eql: {}, ins: {}, del: {} };
    for (var i=0; i < diff.length; i++) {
      var key = 'eql';
      if (diff[i]['ins']) {
        key = 'ins';
      } else if (diff[i]['del']) {
        key = 'del';
      }
      var a_key = diff[i][key].split("{:_key-sep_:}")[0];
      collect[key][a_key] = (diff[i]['ins'] ? obj2 : obj1)[a_key];
    }
    var diff = [], keys = ['del', 'ins', 'eql'];
    for (var i=0; i < keys.length; i++) {
      if (!TestCaseUtil.equal(collect[keys[i]], {})) {
        var el = {}; el[keys[i]] = collect[keys[i]];
        diff.push(el);
      }
    }
    return diff;
  },
  __calc_diff: function(first, second) {
    var diff = [], start_k = 0;
    for (var i=0; i < first.length; i++) {
      var eql_found = false;
      var inses = [];
      for (var k=start_k; k < second.length; k++) {
        if (TestCaseUtil.equal(first[i], second[k])) {
          eql_found = second[k];
          start_k = k+1;
          break;
        } else {
          inses.push(second[k]);
        }
      }
      if (eql_found) {
        for (var j=0; j < inses.length; j++) {
          diff.push({ins: inses[j]});
        }
        diff.push({eql: eql_found});
      } else {
        diff.push({del: first[i]});
      }
    }
    for (var k=start_k; k < second.length; k++) {
      diff.push({ins: second[k]});
    }
    var only_eqls = true;
    for (var i=0; i < diff.length; i++) {
      if (diff[i]['del'] || diff[i]['ins']) {
        only_eqls = false;
        break;
      }
    }
    return only_eqls ? [] : diff;
  },
  __compact: function(diff, compactor) {
    if (diff.length == 0) { return diff; }
    var c_diff = [];
    var last_o = diff[0];
    for (var i=1; i < diff.length; i++) {
      var key = 'eql';
      if (typeof diff[i]['ins'] != 'undefined') {
        key = 'ins';
      } else if (typeof diff[i]['del'] != 'undefined') {
        key = 'del';
      }
      if (typeof last_o[key] != 'undefined') {
        last_o[key] = compactor(last_o[key], diff[i][key]);
      } else {
        c_diff.push(last_o);
        last_o = diff[i];
      }
    }
    c_diff.push(last_o);
    return c_diff;
  }
};
/* ------------------------------------------------------------------- */

TestCaseUtil.Cookie = {
  enabled: function() {
    document.cookie = "test_cookie=test";
    return document.cookie.indexOf("test_cookie=test")!=-1;
  },
  set: function(key, value, keep_days) {
    if (keep_days) {
      var date = new Date();date.setTime(date.getTime()+(100*24*60*60*1000));
    }
    document.cookie = key+"="+escape(value)+(keep_days ? ";  expires="+date.toGMTString() : "");
  },
  get: function(key) {
    var value = '', pairs = document.cookie.split(";");
    for (var i=0; i < pairs.length; i++) {
      var pair = pairs[i].split('=');
      if (pair.length == 2 && pair[0].replace(/^\s+|\s+$/g, '') == key)
        value = pair[1].replace(/^\s+|\s+$/g, '');
    }
    return unescape(value);
  }
};
/* ------------------------------------------------------------------- */

var TestCase = TestCaseUtil.create_class();
TestCaseUtil.extend(TestCase, {
  version: "2.0.2",
  create: function(defs) {
    var Test = TestCaseUtil.create_class();
    TestCaseUtil.extend(Test, TestCase);
    Test.prototype = new TestCase();
    Test.extend = function(entries) {
      TestCaseUtil.extend(this.prototype, entries);
      this.wire_custom_assertions(entries);
    };
    Test.extend(defs || {});
    return Test;
  }
});
TestCaseUtil.extend(TestCase.prototype, {
  name: null,
  title: null,
  size: 0,
  failed: 0,
  passed: 0,
  assertions: 0,
  initialize: function(title) {
    this.title = (this.name || "Unnamed Test") + (title ? ": "+title : "");
    this.size = 0;
    this.passed = 0;
    this.assertations = 0;
    for (key in this) {
      if (key.substring(0, 4) == "test") {
        this.size ++;
      }
    }
  }
});

/* ------------------------------------------------------------------- */

TestCase.Starter = {
  run: function(title) {
    var test = this._get_test_instance();
    this._register_test(test);
    test.passed = 0;
    test.failed = 0;
    test.assertions = 0;
    if (this.reporter && this.reporter.ui_builder && 
        this.reporter.ui_builder.test_is_skipped(test)) {
          test.skipped = true;
          this.reporter.ui_builder.create_summary_report(this.reporter.current_test_block, test);
          return test;
        }
    this._call_before_all(test);
    try {
      var test_names = this._get_test_methods(test);
      for (var i=0; i < test_names.length; i++) {
        var name = test_names[i];
        this._report_test_started(name);
        this._call_setup(test);
        test.manual_failure = null;
        var test_start_assertion_num = test.assertions;
        try {
          test[name]();
          if (test.manual_failure) 
            throw new TestCase.Exception(test.manual_failure);
          test.passed++;
          this._report_test_passed(name);
        } catch (e) {
          if (e instanceof TestCase.Exception) {
            test.failed++;
            this._report_failed(name, e, test.assertions - test_start_assertion_num + 1);
          } else {
            throw e;
          }
        } finally {
          this._call_teardown(test);
        }
      }
    } finally {
      this._call_after_all(test);
    }
    return test;
  },
  run_on_load: function() {
    var $this = this;
    TestCaseUtil.Event.observe(window, 'load', function() {
      $this.run();
    });
  },
  _get_test_instance: function(title) {
    if (typeof this == 'object') {
      var test = this;
    } else {
      var Test = this;
      var test = new Test(title);
    }
    return test;
  },
  _get_test_methods: function(test) {
    var test_method_names = [];
    for (key in test)
      if (key.substring(0, 4) == "test" && typeof test[key] == 'function')
        test_method_names.push(key);
    if (navigator.userAgent.indexOf("MSIE") != -1) { test_method_names.reverse(true); } 
    return test_method_names;
  },
  _call_setup: function(test) {
    if (test['setup']) test.setup.apply(test);
    else if (test['setUp']) test.setUp.apply(test);
  },
  _call_teardown: function(test) {
    if (test['teardown']) test.teardown.apply(test);
    else if (test['tearDown']) test.tearDown.apply(test);
  },
  _call_before_all: function(test) {
    if (test['before_all']) test.before_all.apply(test);
    else if (test['beforeAll']) test.beforeAll.apply(test);
  },
  _call_after_all: function(test) {
    if (test['after_all']) test.after_all.apply(test);
    else if (test['afterAll']) test.afterAll.apply(test);
  },
  _register_test: function(test) {
    if (this.reporter) { this.reporter.register(test); }
  },
  _report_test_started: function(test_name) {
    if (this.reporter) { this.reporter.test_started(test_name); }
  },
  _report_test_passed: function(test_name) {
    if (this.reporter) { this.reporter.test_passed(test_name); }
  },
  _report_failed: function(test_name, error, assertion_num) {
    if (this.reporter) {
      this.reporter.test_failed(test_name, error, assertion_num);
    } else {
      throw error; 
    }
  }
};
/* ------------------------------------------------------------------- */

TestCase.Mocking = {
  mock: function(object, name, mock) {
    if (!object[name]) throw "The object have no method '"+name+"' to mock it up";
    var o_mocks = TestCase.Mocking._get_mocks_of(object);
    o_mocks[name] = o_mocks[name] || object[name];
    return object[name] = mock;
  },
  undo_mock: function(object, name) {
    if (this._has_mock_for(object, name)) {
      var o_mocks = TestCase.Mocking._get_mocks_of(object);
      if (o_mocks[name]) {
        object[name] = o_mocks[name];
        o_mocks[name] = null;
      }
    }
    return object[name];
  },
  with_mock: function(object, name, mock, func, scope) {
    this.mock(object, name, mock);
    try {
      func.apply(scope);
    } finally {
      this.undo_mock(object, name);
    }
  },
  mock_effects: function() {
    this._run_if_mockable('mock_effects');
  },
  undo_effects_mock: function() {
    this._run_if_mockable('undo_effects_mock');
  },
  with_effects_mock: function(func, scope) {
    this.mock_effects();
    try {
      func.apply(scope);
    } finally {
      this.undo_effects_mock();
    }
  },
  mock_ajax: function(options) {
    this._run_if_mockable('mock_ajax', options);
  },
  undo_ajax_mock: function() {
    this._run_if_mockable('undo_ajax_mock');
  },
  with_ajax_mock: function(options, func, scope) {
    this.mock_ajax();
    try {
      func.apply(scope);
    } finally {
      this.undo_ajax_mock();
    }
  },
  __mock_ups: [],
  _get_mocks_of: function(object) {
    var o_mocks = null;
    var mockups = TestCase.Mocking.__mock_ups;
    for (var i=0; i < mockups.length; i++) {
      if (mockups[i]['object'] == object) {
        o_mocks = mockups[i];
        break;
      }
    }
    if (!o_mocks) {
      o_mocks = {
        'object': object, 'mocks': {}
      };
      TestCase.Mocking.__mock_ups.push(o_mocks);
    }
    return o_mocks['mocks'];
  },
  _has_mock_for: function(object, name) {
    var mockups = TestCase.Mocking.__mock_ups;
    for (var i=0; i < mockups.length; i++) {
      if (mockups[i]['object'] == object) {
        return typeof mockups[i]['mocks'][name] != 'undefined' && mockups[i]['mocks'][name] != null;
      }
    }
    return false;
  },
  _mockable_libs: ['Prototype', 'MooTools', 'jQuery'],
  _run_if_mockable: function() {
    var args = TestCaseUtil.to_a(arguments);
    var method_name = args.shift();
    if (method_name == 'mock_ajax') {
      this._raw_mockup_ajax.apply(this, args);
    } else if (method_name == 'undo_ajax_mock') {
      this._raw_undo_ajax_mockup();
    }
    for (var i=0; i < this._mockable_libs.length; i++) {
      if (self[this._mockable_libs[i]]) {
        return this[this._mockable_libs[i]][method_name].apply(this[this._mockable_libs[i]], args);
      }
    }
  },
  _raw_mockup_ajax: function(params) {
    if (TestCaseUtil.Browser.IE) {
      this.__ms_raw_ajax_mock(params);
    } else {
      this.__w3c_raw_ajax_mock(params);
    }
  },
  __w3c_raw_ajax_mock: function(params) {
    if (!(new XMLHttpRequest instanceof TestCase.Mocking.FakeXMLHttpRequest)) {
      this.mock(self, 'XMLHttpRequest', function() {
        return new TestCase.Mocking.FakeXMLHttpRequest(params);
      });
    }
  },
  __ms_raw_ajax_mock: function(params) {
    if (!(new ActiveXObject('Msxml2.XMLHTTP') instanceof TestCase.Mocking.FakeXMLHttpRequest)) {
      var _ = ActiveXObject;
      this.mock(self, 'ActiveXObject', function(param) {
        if (param.indexOf('XMLHTTP') != -1) {
          return new TestCase.Mocking.FakeXMLHttpRequest(params);
        } else {
          return  new _(param);
        }
      });
    }
  },
  _raw_undo_ajax_mockup: function() {
    if (TestCaseUtil.Browser.IE) {
      this.undo_mock(self, 'ActiveXObject');
    } else {
      this.undo_mock(self, 'XMLHttpRequest');
    }
  }
};

/* ------------------------------------------------------------------- */

TestCase.Mocking.FakeXMLHttpRequest = TestCaseUtil.create_class({
  onreadystatechange: null,
  readyState:         null,
  status:             null,
  statusText:         null,
  responseText:       null,
  responseXML:        null,
  fakeData:           null,
  initialize: function(options) {
    this.fakeData = TestCaseUtil.extend({
      status: 200,
      xml: null,
      text: '',
      headers: {}
    }, options || {});
    this.onreadystatechange = function() {};
    this.readyState = 0; 
  },
  __onSend: function() {
    this.readyState = 2; 
    this.status = this.fakeData.status;
    this.onreadystatechange();
    this.readyState = 3; 
    this.responseText = '';
    this.onreadystatechange();
    this.readyState = 4; 
    this.responseText = this.fakeData.text;
    this.responseXML = this.fakeData.xml;
    this.onreadystatechange();
  },
  open: function(method, url, async, user, password) {
    this.readyState = 1; 
  },
  send: function(body) {
    this.__onSend();
  },
  setRequestHeader: function(name, value) {
  },
  getResponseHeader: function(name) {
    for (var key in this.fakeData.headers) {
      if (key.toLowerCase() == name.toLowerCase())
        return this.fakeData.headers[key];
    }
    return null;
  },
  getAllResponseHeaders: function() {
    var headers = [];
    for (var key in this.fakeData.headers) {
      headers.push(key+": "+this.fakeData.headers[key]);
    }
    return headers.join("\n\n");
  },
  overrideMimeType: function(mimetype) {},
  addEventListener: function(type, listener, useCapture) {},
  removeEventListener: function(type, listener, useCapture) {},
  dispatchEvent: function(event) {},
  dispatchException: function(e) {
    throw e;
  },
  abort: function() {}
});
/* ------------------------------------------------------------------- */

TestCase.Mocking.Prototype = {
  hide_effects: ['Fade', 'SlideUp', 'BlindUp', 'SwitchOff'],
  show_effects: ['Appear', 'SlideDown', 'BlindDown', 'Grow'],
  mock_effects: function() {
    if (!self['Effect']) return false;
    for (var i=0; i < this.hide_effects.length; i++) {
      TestCase.mock(Effect, this.hide_effects[i], function(element, options) {
        Element.hide(element);
        if (options.afterFinish) options.afterFinish();
        return element;
      });
      TestCase.mock(Effect, this.show_effects[i], function(element, options) {
        Element.show(element);
        if (options.afterFinish) options.afterFinish();
        return element;
      });
    }
  },
  undo_effects_mock: function() {
    if (!self['Effect']) return false;
    for (var i=0; i < this.hide_effects.length; i++) {
      TestCase.undo_mock(Effect, this.hide_effects[i]);
      TestCase.undo_mock(Effect, this.show_effects[i]);
    }
  },
  mock_ajax: function(options) {
    if (!self['Ajax']) { return false; }
    TestCase.mock(Ajax, 'getTransport', function() {
      return new TestCase.Mocking.FakeXMLHttpRequest(options);
    });
  },
  undo_ajax_mock: function() {
    if (!self['Ajax']) { return false; }
    TestCase.undo_mock(Ajax, 'getTransport');
  }
};
/* ------------------------------------------------------------------- */

TestCase.Mocking.MooTools = {
  mock_effects: function() {
    if (!self['Fx']) { return false; }
    if (Fx['Tween']) {
      TestCase.mock(Fx.Tween.prototype, 'start', function(property, from, to) {
        this.onStart();
        this.set(property, from);
        if (to) {
          this.set(property, to);
        }
        this.onComplete();
      });
    }
    if (Fx['Morph']) {
      TestCase.mock(Fx.Morph.prototype, 'start', function(properties) {
        this.onStart();
        var from = {}, to = {};
        for (var key in properties) {
          if (properties[key] instanceof Array) {
            from[key] = properties[key][0];
            to[key] = properties[key][1];
          } else {
            from[key] = properties[key];
          }
        }
        this.set(from);
        if (!TestCaseUtil.equal(to, {})) {
          this.set(to);
        }
        this.onComplete();
      });
    }
  },
  undo_effects_mock: function() {
    if (!self['Fx']) { return false; }
    if (Fx['Tween']) TestCase.undo_mock(Fx.Tween.prototype, 'start');
    if (Fx['Morph']) TestCase.undo_mock(Fx.Morph.prototype, 'start');
  },
  mock_ajax: function(options) {
    if (!self['Request']) { return false; }
    var old_initialize = Request.prototype.initialize;
    TestCase.mock(Request.prototype, 'initialize', function() {
      old_initialize.apply(this, arguments);
      this.xhr = new TestCase.Mocking.FakeXMLHttpRequest(options);
    });
  },
  undo_ajax_mock: function() {
    if (!self['Request']) { return false; }
    TestCase.undo_mock(Request.prototype, 'initialize');
  }
};
/* ------------------------------------------------------------------- */

TestCase.Mocking.jQuery = {
  mock_effects: function() {
  },
  undo_effects_mock: function() {
  },
  mock_ajax: function(options) {
  },
  undo_ajax_mock: function() {
  }
};
/* ------------------------------------------------------------------- */

TestCase.Fires = {
  FIRES_DEFAULT_MOUSE_EVENT_OPTIONS: {
    pointerX:   0,
    pointerY:   0,
    button:     0,
    bubbles:    true,
    cancelable: true,
    altKey:     false,
    ctrlKey:    false,
    shiftKey:   false,
    metaKey:    false
  },
  FIRES_DEFAULT_KEYBOARD_EVENT_OPTIONS: {
    keyCode:    0,
    charCode:   0,
    bubbles:    true,
    cancelable: true,
    altKey:     false,
    ctrlKey:    false,
    shiftKey:   false,
    metaKey:    false
  },
  fire_mouse_event: function(element, eventName, options) {
    return this._fire_event(this._$(element),
      this._create_mouse_event(this._$(element), eventName, options)
    );
  },
  fire_key_event: function(element, eventName, keyCode, options) {
    return this._fire_event(this._$(element),
      this._create_key_event(this._$(element), eventName,
        TestCaseUtil.extend((options || {}), {keyCode: keyCode, charCode: keyCode})
      )
    );
  },
  fire_click: function(element, options) {
    return this.fire_mouse_event(element, 'click', options);
  },
  fire_middle_click: function(element, options) {
    return this.fire_mouse_event(element, 'middleclick', TestCaseUtil.extend({button: 1}, options || {}));
  },
  fire_right_click: function(element, options) {
    return this.fire_mouse_event(element, 'rightclick', TestCaseUtil.extend({button: 2}, options || {}));
  },
  fire_double_click: function(element, options) {
    return this.fire_mouse_event(element, 'dblclick', options);
  },
  fire_mouse_down: function(element, options) {
    return this.fire_mouse_event(element, 'mousedown', options);
  },
  fire_mouse_up: function(element, options) {
    return this.fire_mouse_event(element, 'mouseup', options);
  },
  fire_mouse_over: function(element, options) {
    return this.fire_mouse_event(element, 'mouseover', options);
  },
  fire_mouse_out: function(element, options) {
    return this.fire_mouse_event(element, 'mouseout', options);
  },
  fire_mouse_move: function(element, options) {
    return this.fire_mouse_event(element, 'mousemove', options);
  },
  fire_key_press: function(element, key, options) {
    return this.fire_key_event(element, 'keypress', key, options);
  },
  fire_key_down: function(element, key, options) {
    return this.fire_key_event(element, 'keydown', key, options);
  },
  fire_key_up: function(element, key, options) {
    return this.fire_key_event(element, 'keyup', key, options);
  },
  _$: function(element) {
    element = TestCaseUtil.$(element);
    if (element == document && document.createEvent && !element.dispatchEvent)
      element = document.documentElement;
    return element;
  },
  _fire_event: function(element, event) {
    if (document.createEvent) {
      element.dispatchEvent(event);
    } else {
      if (TestCaseUtil.Element.up(element, 'body')) { 
        if (event.eventType != 'onmiddleclick') 
          element.fireEvent(event.eventType, event);
      } else {
        this.fail("Please put your element on the page to fire an event on it in IE");
      }
    }
    return event;
  },
  _create_mouse_event: function(element, eventName, options) {
    return (document.createEvent ? this._create_w3c_mouse_event : this._create_ie_mouse_event).apply(
      this, [element, eventName, TestCaseUtil.extend(this.FIRES_DEFAULT_MOUSE_EVENT_OPTIONS, options || {})]);
  },
  _create_w3c_mouse_event: function(element, eventName, options) {
    var event = document.createEvent("MouseEvents");
    event.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
      eventName == 'dblclick' ? 2 : 1, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
      options.ctrlKey, options.altKey, options.shiftKey, options.metakey, options.button, element
    );
    event.eventName = eventName;
    return event;
  },
  _create_ie_mouse_event: function(element, eventName, options) {
    var event = this._create_ie_event(eventName, options);
    event.clientX = options.pointerX;
    event.clientY = options.pointerY;
    event.button = options.button == 1 ? 4 : options.button; 
    return event;
  },
  _create_key_event: function(element, eventName, options) {
    return (document.createEvent ? this._create_w3c_keyboard_event : this._create_ie_keyboard_event).apply(
      this, [eventName, TestCaseUtil.extend(this.FIRES_DEFAULT_KEYBOARD_EVENT_OPTIONS, options || {})]);
  },
  _create_w3c_keyboard_event: function(eventName, options) {
    return (TestCaseUtil.Browser.Gecko ? this._create_gecko_keyboard_event : (
        TestCaseUtil.Browser.WebKit ? this._create_webkit_keyboard_event : this._create_dom2_ui_event
      )).apply(this, [eventName, options]);
  },
  _create_gecko_keyboard_event: function(eventName, options) {
    var event = document.createEvent("KeyboardEvent");
    event.initKeyEvent(eventName,
      options.bubbles, options.cancelable, document.defaultView,
      options.ctrlKey, options.altKey, options.shiftKey, options.metakey,
      options.keyCode, options.charCode
    );
    event.eventName = eventName;
    return event;
  },
  _create_webkit_keyboard_event: function(eventName, options) {
    var event = document.createEvent("KeyboardEvent");
    event.initKeyboardEvent(eventName,
      options.bubbles, options.cancelable, document.defaultView,
      null, 0,
      options.ctrlKey, options.altKey, options.shiftKey, options.metakey
    );
    event.eventName = eventName;
    return event;
  },
  _create_dom2_ui_event: function(eventName, options) {
    var event = document.createEvent("UIEvent");
    event.initUIEvent(eventName, options.bubbles, options.cancelable, document.defaultView, 1);
    event.keyCode = options.keyCode;
    event.charCode = options.charCode;
    event.altKey = options.altKey;
    event.metaKey = options.metaKey;
    event.ctrlKey = options.ctrlKey;
    event.shiftKey = options.shiftKey;
    event.eventName = eventName;
    return event;
  },
  _create_ie_keyboard_event: function(eventName, options) {
    var event = this._create_ie_event(eventName, options);
    event.keyCode = options.keyCode;
    return event;
  },
  _create_ie_event: function(eventName, options) {
    var event = document.createEventObject();
    event.eventName = eventName == 'rightclick' ? 'contextmenu' : eventName;
    event.type = event.eventType = "on" + event.eventName;
    event.altKey = options.altKey;
    event.ctrlKey = options.ctrlKey;
    event.shiftKey = options.shiftKey;
    return event;
  }
};
/* ------------------------------------------------------------------- */

TestCase.Exception = TestCaseUtil.create_class(Error, {
  test: null,
  assertion: null,
  message: null,
  initialize: function(test, assertion, message) {
    this.test = test;
    this.assertion = assertion;
    this.message = message;
  },
  toString: function() {
    return "TestCase.Exception: "+this.message;
  }
});
TestCase.ProblemException = TestCaseUtil.create_class(TestCase.Exception, {
  problem: null,
  initialize: function(test, assertion, problem, message) {
    this.test = test;
    this.assertion = assertion;
    this.problem = problem;
    this.message = message;
  },
  toString: function() {
    return "TestCase.ProblemException: "+this.problem+(this.message ? " ("+this.message+")" : "");
  }
});
TestCase.WrongValueException = TestCaseUtil.create_class(TestCase.Exception, {
  expected: null,
  received: null,
  format: false,
  initialize: function(test, assertion, expected, received, message, format) {
    this.test = test;
    this.assertion = assertion;
    this.expected = expected;
    this.received = received;
    this.message = message;
    this.format = format;
  },
  toString: function() {
    return "TestCase.WrongValueException: "+this.expected+" -> "+this.received;
  }
});
/* ------------------------------------------------------------------- */

TestCase.Messaging = {
  fail: function(message) {
    this.manual_failure = message;
    throw new TestCase.Exception(this, this._last_assertion(), message);
  },
  debug: function(variable) {
    alert(TestCaseUtil.debug(variable));
  },
  throw_problem: function(error, message) {
    throw new TestCase.ProblemException(this, this._last_assertion(), error, message);
  },
  throw_unexp: function(expected, received, message, format) {
    throw new TestCase.WrongValueException(this, this._last_assertion(), expected, received, message, format);
  },
  _last_assertion: function() {
    return this['assert_'+this.last_assert_name];
  }
};

/* ------------------------------------------------------------------- */

TestCase.Assertions = {
  assert_true: function(value, message) {
    if (!value)
      this.throw_unexp(true, value, message);
  },
  assert_false: function(value, message) {
    if (value)
      this.throw_unexp(false, value, message);
  },
  assert_null: function(value, message) {
    if (value != null)
      this.throw_unexp(null, value, message);
  },
  assert_not_null: function(value, message) {
    if (value == null)
      this.throw_problem("The value is null", message);
  },
  assert_type_of: function(type, value, message) {
    if (typeof(value) != type)
      this.throw_unexp(type.toLowerCase(), typeof(value), message);
  },
  assert_instance_of: function(type, value, message) {
    if (!(value instanceof type))
      this.throw_unexp(TestCaseUtil.get_class_name(type), TestCaseUtil.get_object_class_name(value), message);
  },
  assert_equal: function(expected, testing, message) {
    if (!TestCaseUtil.equal(expected, testing))
      this.throw_unexp(expected, testing, message, true); 
  },
  assert_not_equal: function(expected, testing, message) {
    if (TestCaseUtil.equal(expected, testing))
      this.throw_problem("Received values are equal", message);
  },
  assert_same: function(expected, testing, message) {
    if (expected != testing)
      this.throw_problem("Values do not point to the same object", message);
  },
  assert_not_same: function(expected, testing, message) {
    if (expected == testing)
      this.throw_problem("Values point to the same object", message);
  },
  assert_match: function(pattern, string, message) {
    if( !string.match(pattern) )
      this.throw_problem("'"+string+"' doesn't match '"+pattern+"'", message);
  },
  assert_not_match: function(pattern, string, message) {
    if( string.match(pattern) )
      this.throw_problem("'"+string+"' match '"+pattern+"'", message);
  },
  assert_throws: function() {
    var params = this._assert_throw_params.apply(this, arguments);
    var catched = true;
    try { params.callback.apply(params.scope_element);
      catched = false;
    } catch (e) { catched = e; }
    if (!catched)
      this.throw_problem('No exception raised during the call', params.message);
    else if (params.exception_type) {
      if (!this._type_of(catched, params.exception_type))
        this.throw_unexp("Exception with type of: "+params.exception_type, catched, params.message);
    }
  },
  assert_nothing_thrown: function() {
    var params = this._assert_throw_params.apply(this, arguments);
    try { params.callback.apply(params.scope_element);
    } catch (e) {
      if (params.exception_type) {
        if (this._type_of(e, params.exception_type))
          this.throw_problem("Unexpected exception with type '"+params.exception_type+
            "' has been raised: \""+e.toString()+"\"", params.message);
      } else {
        this.throw_problem('Unexpected exception has been raised: "'+e.toString()+'"', params.message);
      }
    }
  },
  _assert_throw_params: function() {
    var params = typeof arguments[1] == 'function' ?
      { exception_type: arguments[0], callback: arguments[1]} :
      { callback: arguments[0]};
    params.message = null;
    for (var i=0; i < arguments.length; i++)
      if (arguments[i].scope)
        params.scope_element = arguments[i].scope;
    if (arguments.length > 1) {
      for (var i=arguments.length-1; i > 0; i--) {
        if (arguments[i] == params.callback) {
          break;
        } else if (typeof arguments[i] == 'string') {
          params.message = arguments[i];
        } else if (typeof params.scope_element == 'undefined') {
          params.scope_element = arguments[i];
        }
      }
    }
    return params;
  },
  _type_of: function(object, _type) { 
    switch(_type) {
      case 'number':
      case Number: return typeof object == 'number';
      case 'string':
      case String: return typeof object == 'string';
      default:     return object instanceof _type;
    }
  },
  assert_called: function() {
    var problems = [];
    this._execute_wrapped_call(arguments, problems,
      function(flag, call) {
        if (!flag) problems.push("Attribute '"+call[1]+"' was not called");
      }
    );
  },
  assert_not_called: function() {
    var problems = []; 
    this._execute_wrapped_call( arguments, problems,
      function(flag, call) {
        if (flag) problems.push("Attribute '"+call[1]+"' was unexpetedly called");
      }
    );
  },
  _execute_wrapped_call: function(args, problems, callback) {
    var params = this._assert_called_params.apply(this, args);
    try {
      var flags = [];
      for (var i=0; i < params.calls.length; i++) {
        flags[i] = false;
        this.mock(params.calls[i][0], params.calls[i][1], (function(flags, i, object, name) {
          var method = object[name];
          return function() {
            flags[i] = true;
            return method.apply(object, arguments);
          };
        })(flags, i, params.calls[i][0], params.calls[i][1]));
      }
      params.callback.apply(params['scope_element']);
      for (var i=0; i < flags.length; i++) {
        if (params.calls[i])
          callback.apply(this, [flags[i], params.calls[i]]);
      }
    } finally {
      for (var i=0; i < params.calls.length; i++) {
        this.undo_mock(params.calls[i][0], params.calls[i][1]);
      }
    }
    if (problems.length) {
      this.throw_problem(problems.join("\n"), params.message);
    }
  },
  _assert_called_params: function() {
    var params = { calls: [], callback: null, message: null };
    if (typeof arguments[1] == 'string') {
      params.calls = [[arguments[0], arguments[1]]];
      params.callback = arguments[2];
    } else if (arguments[0] instanceof Array) {
      if (arguments[0].length == 2 && typeof(arguments[0][1]) == 'string') {
        params.calls = [arguments[0]];
      } else {
        params.calls = arguments[0];
      }
      params.callback = arguments[1];
    }
    for (var i=0; i < arguments.length; i++)
      if (arguments[i].scope)
        params.scope_element = arguments[i].scope;
    if (arguments.length > 2) {
      for (var i=arguments.length-1; i > 0; i--) {
        if (arguments[i] == params.callback) {
          break;
        } else if (typeof arguments[i] == 'string') {
          params.message = arguments[i];
        } else if (typeof params.scope_element == 'undefined') {
          params.scope_element = arguments[i];
        }
      }
    }
    return params;
  },
  assert_exists: function(css_rule, message) {
    if (TestCaseUtil.$$(css_rule).length == 0)
      this.throw_problem("Cannot find any element like '"+css_rule+"'", message);
  },
  assert_not_exists: function(css_rule, message) {
    if (TestCaseUtil.$$(css_rule).length)
      this.throw_problem("Element '"+css_rule+"' presents on the page", message);
  },
  assert_has_child: function(element, css_rule, message) {
    if (!TestCaseUtil.Element.down(element, css_rule))
      this.throw_problem("Element has no child element like '"+css_rule+"'", message);
  },
  assert_has_no_child: function(element, css_rule, message) {
    if (TestCaseUtil.Element.down(element, css_rule))
      this.throw_problem("Element has child element '"+css_rule+"'", message);
  },
  assert_has_parent: function(element, css_rule, message) {
    if (!TestCaseUtil.Element.up(element, css_rule))
      this.throw_problem("Element has no parent element like '"+css_rule+"'", message);
  },
  assert_has_no_parent: function(element, css_rule, message) {
    if (TestCaseUtil.Element.up(element, css_rule))
      this.throw_problem("Element has parent element '"+css_rule+"'", message);
  },
  assert_visible: function(element_or_css_rule, message) {
    var elements = typeof element_or_css_rule == 'string' ?  TestCaseUtil.$$(element_or_css_rule) : [element_or_css_rule];
    if (!elements.length || !elements[0])
      this.throw_unexp("Element is visible", "Element is not found", message);
    else {
      for (var i=0; i < elements.length; i++) {
        var element_style = this.__get_element_style(elements[i]);
        var element_display = elements[i].style.display || element_style['display'];
        var element_visibility = elements[i].style.visibility || element_style['visibility'];
        if (element_display == 'none' || element_visibility == 'hidden')
          this.throw_problem("Element is not visible", message);
      }
    }
  },
  assert_hidden: function(element_or_css_rule, message) {
    var elements = typeof element_or_css_rule == 'string' ? TestCaseUtil.$$(element_or_css_rule) : [element_or_css_rule];
    if (!elements.length || !elements[0])
      this.throw_unexp("Element is hidden", "Element is not found", message);
    else {
      for (var i=0; i < elements.length; i++) {
        var element_style = this.__get_element_style(elements[i]);
        var element_display = elements[i].style.display || element_style['display'];
        var element_visibility = elements[i].style.visibility || element_style['visibility'];
        if (element_display != 'none' && element_visibility != 'hidden')
          this.throw_problem("Element is visible", message);
      }
    }
  },
  assert_has_class_name: function(element, class_name, message) {
    if (!TestCaseUtil.Element.has_class_name(element, class_name))
      this.throw_problem("Element has no class-name '"+class_name+"'", message);
  },
  assert_has_no_class_name: function(element, class_name, message) {
    if (TestCaseUtil.Element.has_class_name(element, class_name))
      this.throw_problem("Element have class-name '"+class_name+"'", message);
  },
  assert_has_attribute: function(element, name, message) {
    if (element.getAttribute(name) == null)
      this.throw_problem("Element has no attribute '"+name+"'", message);
  },
  assert_has_no_attribute: function(element, name, message) {
    if (element.getAttribute(name) != null)
      this.throw_problem("Element has attribute '"+name+"'", message);
  },
  assert_style: function(element, style, message) {
    var element_computed_style = this.__get_element_style(element);
    var element_style = {};
    for (var key in style) {
      if (key.toLowerCase().substring(key.length-5) == 'color') {
        var t = document.createElement('span');
        t.style[key] = style[key];
        style[key] = t.style[key];
      }
      if (element.style && element.style[key]) {
        element_style[key] = element.style[key];
      } else if (element_computed_style[key]) {
        element_style[key] = element_computed_style[key];
      } else {
        element_style[key] = null;
      }
    };
    if (!TestCaseUtil.equal(style, element_style))
      this.throw_unexp("Element has style:\n "+TestCaseUtil.to_s(style), 
        TestCaseUtil.to_s(element_style), message);
  },
  __get_element_style: function(element) {
    var style = document.defaultView ? document.defaultView.getComputedStyle(element, null) : element.currentStyle;
    return style ? style : {};
  }
};
/* ------------------------------------------------------------------- */

TestCase.AssertionsExtender = {
  add_assertion: function(name, func) {
    var name = name.substr(0, 7) == 'assert_' ? name.substr(7, name.length) : name;
    var assert = {}; assert['assert_'+name] = function() {
      this._count_assert(name);
      func.apply(this, arguments);
    };
    TestCaseUtil.extend(this.prototype ? this.prototype : this, assert);
    TestCaseUtil.extend_with_camelized_aliases(this.prototype ? this.prototype : this, assert);
  },
  add_assertions: function(module) {
    TestCaseUtil.extend(this.prototype ? this.prototype : this, module);
    TestCaseUtil.extend_with_camelized_aliases(this.prototype ? this.prototype : this, module);
    for (var key in module) {
      if (key.substr(0, 7) == 'assert_')
        this.add_assertion(key, module[key]);
    }
  },
  wire_custom_assertions: function(test_def) {
    for (var name in test_def) {
      if (name.substr(0, 6) == 'assert' && typeof(test_def[name]) == 'function') {
        this.add_assertion(name.replace(/([a-z]+)([A-Z])/g, '$1_$2').toLowerCase(), this.prototype[name]);
      }
    }
  },
  _count_assert: function(name) {
    this.assertions++;
    this.last_assert_name = name;
  }
};
/* ------------------------------------------------------------------- */

TestCaseUtil.extend_fully_object_and_prototype(TestCase, TestCase.Starter);
TestCaseUtil.extend_fully_object_and_prototype(TestCase, TestCase.Fires);
TestCaseUtil.extend_fully_object_and_prototype(TestCase, TestCase.Mocking);
var __mock_aliaces = {
  mockUp:              TestCase.mock,
  mockup:              TestCase.mock,
  undo_mockup:         TestCase.undo_mock,
  undoMockup:          TestCase.undo_mock,
  undoMockUp:          TestCase.undo_mock,
  with_mocked:         TestCase.with_mock,
  withMocked:          TestCase.with_mock,
  mockupEffects:       TestCase.mock_effects,
  mockUpEffects:       TestCase.mock_effects,
  mockup_effects:      TestCase.mock_effects,
  undo_effects_mockup: TestCase.undo_effects_mock,
  undoEffectsMockup:   TestCase.undo_effects_mock,
  undoMockUpEffects:   TestCase.undo_effects_mock,
  undoMockupEffects:   TestCase.undo_effects_mock,
  undo_mockup_effects: TestCase.undo_effects_mock,
  mockUpAjax:          TestCase.mock_ajax,
  mockupAjax:          TestCase.mock_ajax,
  mockup_ajax:         TestCase.mock_ajax,
  undoMockupAjax:      TestCase.undo_ajax_mock,
  undoMockUpAjax:      TestCase.undo_ajax_mock,
  undo_mockup_ajax:    TestCase.undo_ajax_mock,
  undo_ajax_mockup:    TestCase.undo_ajax_mock,
  undoAjaxMockup:      TestCase.undo_ajax_mock,
  undoAjaxMockUp:      TestCase.undo_ajax_mock,
  with_ajax_mockup:    TestCase.with_ajax_mock
};
TestCaseUtil.extend(TestCase,           __mock_aliaces);
TestCaseUtil.extend(TestCase.prototype, __mock_aliaces);
TestCaseUtil.extend(TestCase.prototype, TestCase.Messaging);
TestCaseUtil.extend_fully_object_and_prototype(TestCase, TestCase.AssertionsExtender);
TestCase.add_assertions(TestCase.Assertions);
TestCaseUtil.extend(TestCase.prototype, {
  flunk: TestCase.prototype.fail,
  assert: TestCase.prototype.assert_true,
  assert_nil: TestCase.prototype.assert_null,
  assert_not_nil: TestCase.prototype.assert_not_null,
  assert_kind_of: TestCase.prototype.assert_type_of,
  assert_no_match: TestCase.prototype.assert_not_match,
  assertEquals: TestCase.prototype.assert_equal,
  assertNotEquals: TestCase.prototype.assert_not_equal,
  assertNoMatch: TestCase.prototype.assert_not_match
});
TestCase.prototype.util = TestCaseUtil;

/* ------------------------------------------------------------------- */

var TestSuite = TestCaseUtil.create_class({
  title: null,
  reporter: null,
  test_cases: [],
  initialize: function() {
    this.test_cases = [];
    this.add.apply(this, arguments);
  },
  add: function() {
    for (var i=0; arguments.length > i; i++) {
      this.test_cases.push(arguments[i]);
    }
    this.test_cases = TestCaseUtil.Array.uniq(this.test_cases);
    return this;
  },
  remove: function() {
    for (var i=0; i < arguments.length; i++)
      this.test_cases = TestCaseUtil.Array.without(this.test_cases, arguments[i]);
    return this;
  },
  run: function(title) {
    for (var i=0; i < this.test_cases.length; i++)
      this.test_cases[i].run();
    return this;
  },
  run_on_load: function() {
    var $this = this;
    TestCaseUtil.Event.observe(window, 'load', function() {
      $this.run();
    });
  }
});
TestSuite.prototype.runOnLoad = TestSuite.prototype.run_on_load
/* ------------------------------------------------------------------- */

var TestReporter = TestCaseUtil.create_class({
  ui_builder: null,
  report_container: null,
  current_test: null,
  current_test_block: null,
  current_test_done_bar: null,
  seen_tests: null,
  initialize: function(ui_builder){
    this.ui_builder = ui_builder || new TestReporter.UIBuilder();
    this.report_container = this.ui_builder.create_report_container();
    this._is_prepared = false;
    this.seen_tests = [];
  },
  register: function(test) {
    this._check_prepare();
    this.seen_tests.push(test);
    this.current_test = test;
    this.current_test_block = this.ui_builder.create_test_block(test, this.report_container);
    this.current_test_done_bar = this.ui_builder.create_done_bar(this.current_test_block);
    this.current_test.__start_time = new Date().getTime(); 
  },
  test_started: function(test_name) {},
  test_passed: function(test_name) {
    this.current_test_done_bar.style.width = ((this.current_test.passed / this.current_test.size) * 100)+'%';
    this.check_for_test_summary_report();
  },
  test_failed: function(test_name, e, assertion_num) {
    this.ui_builder.create_error_report(
      this.current_test_block, test_name, e, assertion_num, this.current_test[test_name].toString()
    );
    this.check_for_test_summary_report();
  },
  check_for_test_summary_report: function() {
    if (this.current_test.size == (this.current_test.passed + this.current_test.failed))
      this.ui_builder.create_summary_report(this.current_test_block, this.current_test);
    this.ui_builder.update_overall_summary(this.report_container, this.seen_tests);
  },
  prepare: function() {},
  _check_prepare: function() {
    if(!this._is_prepared){
      this.prepare();
      this._is_prepared = true;
    }
  }
});

/* ------------------------------------------------------------------- */

TestReporter.UIBuilder = TestCaseUtil.create_class({
  DEFAULT_VIEW_NAME: 'summary-and-failed',
  initialize: function() {},
  create_report_container: function() {
    var block = document.createElement("DIV");
    block.innerHTML = ''+
      '<div id="testcase-report-block">'+
      '  <h1>Test Report</h1>'+
      '  <select id="testcase-view-switcher">'+
      '    <option value="summary-only">Display: Summary only</option>'+
      '    <option value="summary-and-failed">Display: Summary and Failed Cases</option>'+
      '    <option value="summary-and-active">Display: Summary and Active Cases</option>'+
      '    <option value="summary-and-skipped">Display: Summary and Skipped Cases</option>'+
      '    <option value="summary-and-all">Display: Summary and All Cases</option>'+
      '    <option value="cases-only">Display: Test Cases Only</option>'+
      '    <option value="active-cases-only">Display: Active Cases Only</option>'+
      '    <option value="skipped-cases-only">Display: Skipped Cases Only</option>'+
      '  </select>'+
      '  <ul id="test-cases-list">'+
      '    <li id="testcase-summary-block">'+
      '      <input type="checkbox" id="testcase-toggle-all-cases" title="Skip/Activate all TestCases" />'+
      '      <div class="test-name">Summary</div>'+
      '      <div class="progress-bar">'+
      '        <div class="done-bar"></div>'+
      '      </div>'+
      '      <div class="error-report-summary">'+
      '        Total Cases: 0 / Tests: 0 / Passed: 0 / Failed : 0 / Assertions : 0'+
      '      </div>'+
      '    </li>'+
      '  </ul>'+
      '</div>';
    this.init_view_switcher(block);
    this.init_toggle_all_cases(block);
    return block;
  },
  create_test_block: function(test, report_container) {
    var block = document.createElement("LI");
    var skipper = document.createElement("INPUT");
    skipper.type = "checkbox";
    skipper.title = "Skip/Activate Test";
    var $this = this;
    skipper.onclick = function(event) {
      $this.set_skip_test.apply($this, [event, test, skipper, block]);
    };
    block.appendChild(skipper);
    skipper.checked = !this.test_is_skipped(test);
    skipper.disabled = !TestCaseUtil.Cookie.enabled();
    if (!skipper.checked) TestCaseUtil.Element.add_class_name(block, 'skipped');
    var test_name = document.createElement("DIV");
    test_name.className = "test-name";
    test_name.innerHTML = test.title;
    block.appendChild(test_name);
    TestCaseUtil.Array.find(
      TestCaseUtil.Element.select(report_container, '*'),
      function(element){ return element.id == 'test-cases-list';}
    ).appendChild(block);
    return block;
  },
  create_done_bar: function(block) {
    var progress_bar = document.createElement("DIV");
    progress_bar.className = "progress-bar";
    var done_bar = document.createElement("DIV");
    done_bar.className = "done-bar";
    progress_bar.appendChild(done_bar);
    block.appendChild(progress_bar);
    return done_bar;
  },
  create_error_report: function(test_block, test_name, e, assertion_num, failed_test_code) {
    var block = document.createElement("DIV");
    block.className = 'error-report-case';
    block.innerHTML = '<div class="error-report-case-title">Test error in <span class="test-name" title="Show code">'+ test_name +'</span> '+
                      '<span class="assertion-name">('+this.get_assertion_name(e, assertion_num)+')</span>:</div>'+this.create_error_text(e);
    this.create_error_code_snippet(block, e, assertion_num, failed_test_code);
    test_block.appendChild(block);
    test_block.className = 'failed-case';
    return block;
  },
  create_error_text: function(e) {
    if (e instanceof TestCase.WrongValueException) {
      var e_value = this._htmlized(e.format ? this._formatted_value(e.expected) : e.expected);
      var r_value = this._htmlized(e.format ? this._formatted_value(e.received) : e.received);
      return ''+
        '<label>Expected:</label> <span class="report-text">'+ e_value +'</span> '+
        '<label>but had:</label> <span class="report-text">'+ r_value +'</span> '+
        this._create_diff_block(e) +
        this._create_message_block(e);
    } else if (e instanceof TestCase.ProblemException)
      return '<label>Problem:</label> <span class="report-text">'+this._htmlized(e.problem)+'</span> ' + this._create_message_block(e);
    else return e.message;
  },
  _htmlized: function(value) {
    return typeof(value) == 'string' ? value.replace(/\n/g, "<br/>") : value;
  },
  MAX_UNFOLDED_VALUE_LENGTH: 200,
  _formatted_value: function(value) {
    var value_s = TestCaseUtil.to_pretty_s(value);
    if (value_s.length > this.MAX_UNFOLDED_VALUE_LENGTH) {
      return "<span class='formatted-value short-version'>"+ 
               value_s.substr(0, this.MAX_UNFOLDED_VALUE_LENGTH).replace(/</g, '&lt;').replace(/ /g, '&nbsp;') +
             "</span>" +
             "<span class='formatted-value full-version'>"+ 
               value_s.replace(/</g, '&lt;').replace(/ /g, '&nbsp;') +
             "</span>" +
             '<a href="" class="folding-toggler" title="Toggle the value" onclick="'+
               "var short_version = TestCaseUtil.Element.down(TestCaseUtil.Element.up(this, 'span.report-text'), 'span.short-version');"+
               "var full_version = TestCaseUtil.Element.down(TestCaseUtil.Element.up(this, 'span.report-text'), 'span.full-version');"+
               "if (short_version.style.display != 'none') {"+
                 "short_version.style.display = 'none';"+
                 "full_version.style.display = 'block';"+
                 "this.innerHTML = 'Hide the full version';"+
               "} else {"+
                 "short_version.style.display = 'block';"+
                 "full_version.style.display = 'none';"+
                 "this.innerHTML = 'Full version';"+ 
               "}"+
             'return false;">Full version</a>';
    }
    return "<span class='formatted-value'>"+ value_s.replace(/</g, '&lt;').replace(/ /g, '&nbsp;') +"</span>";
  },
  _create_diff_block: function (e) {
    if (e.format) {
      try {
        var is_array = e.expected instanceof Array;
        var diff = TestCaseUtil.Diff.calc(e.expected, e.received);
        if (diff.length > 0) {
          var diff_entries = [];
          for (var i=0; i < diff.length; i++) {
            for (var key in diff[i]) {}
            var value = diff[i][key];
            if (typeof e.expected != 'string') {
              if (typeof e.expected == 'object' && !is_array) {
                var entries = [];
                for (var name in value) {
                  entries.push('"'+ name +'": '+TestCaseUtil._one_level_to_s(value[name]));
                }
                value = "{"+ entries.join(",\n ") +"\n}";
              } else if (typeof e.expected != 'function') {
                value = TestCaseUtil.debug(value);
              }
            }
            diff_entries.push('<span class="'+key+'">'+ value.replace(/</g, '&lt;').replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;') +'</span>');
          }
          return '<label>Diff:</label><span class="report-text">'+
                   '<span class="diff-block">'+ 
                     (is_array ? '[' : '')+
                     diff_entries.join(is_array ? ',<br/>&nbsp;' : '<br/>') +
                     (is_array ? "<br/>]" : '') +
                   '</span>'+
                   '<a href="" class="diff-toggler" title="Toggle the diff" onclick="'+
                     "var block = TestCaseUtil.Element.down(TestCaseUtil.Element.up(this, 'span.report-text'), 'span.diff-block');"+
                     "if (block.style.display != 'block') {"+
                       "block.style.display = 'block';"+
                       "this.innerHTML = 'Hide';"+
                     "} else {"+
                       "block.style.display = 'none';"+
                       "this.innerHTML = 'Show';"+
                     "}"+
                   'return false;">Show</a>'+
                 '</span>';
        }
      } catch (e) {  }
    }
    return '';
  },
  _create_message_block: function(e) {
    return e.message ? '<label>Message:</label>  <span class="report-text">'+e.message+'</span>' : '';
  },
  create_error_code_snippet: function(error_block, e, assertion_num, failed_test_code) {
    var failed_test_code = this._paint_source_code(failed_test_code, e, assertion_num);
    var failed_test_source_popup = document.createElement("DIV");
    failed_test_source_popup.className = 'failed-code-snippet';
    failed_test_source_popup.innerHTML = '<code>'+failed_test_code+'</code>';
    failed_test_source_popup.style.display = 'none';
    var test_name_pointer = TestCaseUtil.Element.select(error_block, 'span.test-name')[0];
    test_name_pointer.parentNode.insertBefore(failed_test_source_popup, test_name_pointer);
    TestCaseUtil.Event.observe(failed_test_source_popup, 'click', function(event) { TestCaseUtil.Event.stop(event); });
    TestCaseUtil.Event.observe(test_name_pointer, 'click', function(event) {
      TestCaseUtil.Event.stop(event);
      TestCaseUtil.Element.toggle(failed_test_source_popup);
    });
    TestCaseUtil.Event.observe(document, 'click', function() {
      TestCaseUtil.Element.hide(failed_test_source_popup);
    });
    return failed_test_source_popup;
  },
  _paint_source_code: function(failed_test_code, e, assertion_num) {
    if (TestCaseUtil.Browser.IE) failed_test_code = failed_test_code.replace(/\n/mg, "<br/>\n").replace(/ /mg, "&nbsp;"); 
    var assertion_num = assertion_num - 1;
    var asserts_counter = 0;
    var assertion_matches = failed_test_code.match(/this\.assert.+(\n|;)/ig);
    if (assertion_matches) {
      for (var i=0; i < assertion_matches.length; i++) {
        match = assertion_matches[i];
        asserts_counter ++;
        if (asserts_counter == assertion_num)
          failed_test_code = failed_test_code.replace(match, '<span class="problematic-code">'+match+'</span>');
      }
      failed_test_code = failed_test_code.replace(/(this)(\.)(assert[^\(]*)(\s*\()/img, '$1$2<span class="assertion-method">$3</span>$4');
    }
    return failed_test_code;
  },
  create_summary_report: function(test_block, test) {
    test.__taken_seconds = (test.__start_time && !test.skipped) ? (new Date().getTime() - test.__start_time)/1000 : 0;
    var block = document.createElement("DIV");
    block.className = 'error-report-summary';
    block.innerHTML = "Total tests: "+ test.size +
                      " / Passed: "+ test.passed +
                      " / Failed: "+ test.failed +
                      " / Assertions: "+ test.assertions +
                      " / Seconds: "+test.__taken_seconds;
    test_block.appendChild(block);
    return block;
  },
  update_overall_summary: function(block, cases_list) {
    var cases = 0, tests = 0, passed = 0, failed = 0, assertions = 0, seconds = 0;
    for (var i=0; i < cases_list.length; i++) {
      var testcase = cases_list[i];
      if (!testcase.skipped) {
        cases++;
        tests += testcase.size;
        passed += testcase.passed;
        failed += testcase.failed;
        assertions += testcase.assertions;
        seconds += testcase.__taken_seconds;
      }
    }
    var list_block = TestCaseUtil.Element.select(block, 'li#testcase-summary-block')[0];
    if (list_block) {
      var done_bar_element = TestCaseUtil.Element.select(list_block, 'div.done-bar')[0];
      if (done_bar_element)
        done_bar_element.style.width = ((tests > 0 ? (passed / tests) : 0) * 100)+'%';
      var summary_element = TestCaseUtil.Element.select(list_block, 'div.error-report-summary')[0];
      if (summary_element)
        summary_element.innerHTML = "Total Cases: "+cases+
                                    " / Tests: "+tests+
                                    " / Passed: "+passed+
                                    " / Failed : "+failed+
                                    " / Assertions : "+assertions+
                                    " / Seconds: "+seconds.toString().substr(0,5);
    }
    if (cases > 0) {
      var switcher = TestCaseUtil.Element.select(block, 'input#testcase-toggle-all-cases')[0];
      if (switcher)
        switcher.checked = true;
    }
  },
  test_is_skipped: function(test) {
    return TestCaseUtil.Array.include(this.get_skipped_cases(), escape(test.title));
  },
  get_assertion_name: function(e, assertion_num) {
    if (e.test && e.assertion) {
      for (key in e.test)
        if (e.test[key] == e.assertion)
          return key;
    } else {
      return "assertion #"+assertion_num;
    }
  },
  init_view_switcher: function(block) {
    var descendants = TestCaseUtil.Element.select(block, '*');
    var switcher = TestCaseUtil.Array.find(descendants, function(el) { return el.id == 'testcase-view-switcher' });
    var list_element = TestCaseUtil.Array.find(descendants, function(el) { return el.id == 'test-cases-list' });
    if (switcher && list_element) {
      TestCaseUtil.Event.observe(switcher, 'change', function() {
        list_element.className = switcher.value;
        TestCaseUtil.Cookie.set("testcase_view", switcher.value, 100);
      });
      switcher.value = this.get_current_view_name();
      list_element.className = switcher.value;
    }
  },
  get_current_view_name: function() {
    var view_name = TestCaseUtil.Cookie.get('testcase_view');
    return view_name == '' ? this.DEFAULT_VIEW_NAME : view_name;
  },
  init_toggle_all_cases: function(block) {
    var checkbox = TestCaseUtil.Array.find(TestCaseUtil.Element.select(block, '*'), function(el) { return el.id == 'testcase-toggle-all-cases' });
    if (checkbox) {
      var $this = this;
      TestCaseUtil.Event.observe(checkbox, 'click', function(event) {
        $this.toggle_all_cases.apply($this, [this, block, checkbox]);
      });
      checkbox.checked = false;
      checkbox.disabled = TestCaseUtil.Cookie.enabled() ? false : true;
    }
  },
  toggle_all_cases: function(event, block, checkbox) {
    var elements = TestCaseUtil.Element.select(block, 'ul li input[type="checkbox"]');
    for (var i=0; i < elements.length; i++) {
      elements[i].checked = checkbox.checked;
      if (elements[i].onclick)
        elements[i].onclick();
    }
  },
  set_skip_test: function(event, test, checkbox, block) {
    TestCaseUtil.Element[checkbox.checked ? 'remove_class_name' : 'add_class_name'](block, 'skipped');
    var skipped_cases = this.get_skipped_cases();
    if (checkbox.checked)
      skipped_cases = TestCaseUtil.Array.without(skipped_cases, escape(test.title));
    else
      skipped_cases.push(escape(test.title));
    TestCaseUtil.Cookie.set("testcase_skipped_cases", skipped_cases.join("|"));
  },
  get_skipped_cases: function() {
    return TestCaseUtil.Cookie.get('testcase_skipped_cases').split("|");
  }
});

/* ------------------------------------------------------------------- */

TestReporter.InlineReporter = TestCaseUtil.create_class(TestReporter, {
  prepare: function() {
    var source = ''+
      '<div id="testcase-inline-report-block">'+
      '  <div class="title">'+
      '    <div class="closer" title="Close" onclick="TestCaseUtil.Element.hide(\'testcase-inline-report-block\');">x</div>'+
      '  </div>'+
      '  <div class="body"></div>'+
      '</div>'+
    '';
    if (document.body) {
      var block = document.createElement("DIV");
      block.innerHTML = source;
      document.body.appendChild(block);
    } else {
      document.write(source);
    }
    TestCaseUtil.Element.down('testcase-inline-report-block', 'div.body').appendChild(this.report_container);
  }
});
/* ------------------------------------------------------------------- */

TestCaseUtil.extend(TestCase, {
  reporter: new TestReporter.InlineReporter()
});


/* ---------------- THE STYLES COLLECTION DUMPING ------------------- */
document.write('<style type="text/css">'+''+
'#testcase-report-block{'+
'  font-family: Verdana;'+
'  font-size: 9pt;'+
'}'+
'#testcase-report-block h1{'+
'  font-family: Arial;'+
'  font-size: 12pt;'+
'}'+
'#testcase-report-block div.progress-bar{'+
'  display:block;'+
'  height: 14px;'+
'  width: 100%;'+
'  background: red;'+
'  padding: 0;'+
'}'+
'#testcase-report-block div.progress-bar div.done-bar{'+
' display:block;'+
' position: relative;'+
' float: left;'+
' height: 14px;'+
' margin: 0;'+
' background: green;'+
'}'+
''+
'#testcase-report-block #testcase-view-switcher {'+
'  position: relative;'+
'  float: right;'+
'  margin-top: -20pt;'+
'}'+
''+
'#testcase-report-block ul#test-cases-list{'+
'   padding-left: 20pt;'+
'}'+
'#testcase-report-block ul#test-cases-list li{'+
'  margin-bottom: 8pt;'+
'}'+
'#testcase-report-block ul#test-cases-list li#testcase-summary-block {'+
'  padding-bottom: 4pt;'+
''+
'  margin-bottom: 4pt;'+
'}'+
'#testcase-report-block ul#test-cases-list li div.test-name{'+
'  font-weight: bold;'+
'}'+
'#testcase-report-block ul#test-cases-list li div.error-report-case{'+
'  padding: 4pt 0;'+
'  border-bottom: 1px dotted gray;'+
'}'+
'#testcase-report-block ul#test-cases-list li div.error-report-case div.error-report-case-title{'+
'  font-weight: bold;'+
'  color: brown;'+
'}'+
'#testcase-report-block ul#test-cases-list li div.error-report-case div.error-report-case-title .test-name{'+
'  text-decoration: underline;'+
'  color: red;'+
'  cursor: pointer;'+
'}'+
'#testcase-report-block ul#test-cases-list li div.error-report-case div.error-report-case-title .assertion-name{'+
'  font-weight: normal;'+
'}'+
'#testcase-report-block ul#test-cases-list li div.error-report-case label{'+
'  display: block;'+
'  font-weight: bold;'+
'  color: #888;'+
'  margin-top: 4pt;'+
'}'+
'#testcase-report-block ul#test-cases-list li div.error-report-case .report-text{'+
'  display: block;'+
'  padding-left: 4pt;'+
'  border-left: 8pt solid #FEE;'+
'}'+
'#testcase-report-block ul#test-cases-list li div.error-report-case .formatted-value {'+
'  white-space: pre;'+
'  font-family: monospace;'+
'  display: block;'+
'}'+
'#testcase-report-block ul#test-cases-list li div.error-report-case .formatted-value.short-version {'+
'  color: gray;'+
'}'+
'#testcase-report-block ul#test-cases-list li div.error-report-case .formatted-value.short-version:after {'+
'  content: "...";'+
'  font-size: 120%;'+
'  font-weight: bold;'+
'  margin-left: 4pt;'+
'}'+
'#testcase-report-block ul#test-cases-list li div.error-report-case .formatted-value.full-version {'+
'  display: none;'+
'}'+
'#testcase-report-block ul#test-cases-list li div.error-report-case .folding-toggler {'+
'  color: red;'+
'}'+
''+
'#testcase-report-block ul#test-cases-list li div.error-report-case .diff-block {'+
'  white-space: pre;'+
'  font-family: monospace;'+
'  display: none;'+
'}'+
'#testcase-report-block ul#test-cases-list li div.error-report-case .diff-block .del {'+
'  background: #FDD;'+
'}'+
'#testcase-report-block ul#test-cases-list li div.error-report-case .diff-block .ins {'+
'  background: #DFD;'+
'}'+
'#testcase-report-block ul#test-cases-list li div.error-report-case .diff-toggler {'+
'  color: red;'+
'}'+
''+
'#testcase-report-block ul#test-cases-list {'+
'  list-style: none;'+
'}'+
'#testcase-report-block ul#test-cases-list li {'+
(TestCaseUtil.Browser.IE?'margin-bottom: 0 !important; ':'')+
(TestCaseUtil.Browser.IE?'padding-bottom: 0 !important; ':'')+
'}'+
'#testcase-report-block ul#test-cases-list li input {'+
'  position: relative;'+
'  float: left;'+
'  margin-left: -16pt;'+
(TestCaseUtil.Browser.IE?'margin-left: -20pt;':'')+
(TestCaseUtil.Browser.IE?'margin-top: 10pt;':'')+
'}'+
'#testcase-report-block ul#test-cases-list li.skipped {'+
'  color: gray;'+
'}'+
'#testcase-report-block ul#test-cases-list li.skipped div.progress-bar,'+
'#testcase-report-block ul#test-cases-list li.skipped div.progress-bar div.done-bar {'+
'  background: gray;'+
'}'+
''+
'#testcase-report-block ul.summary-only li {'+
'  display: none;'+
'}'+
'#testcase-report-block ul.summary-only li#testcase-summary-block {'+
'  display: list-item;'+
'}'+
''+
'#testcase-report-block ul.summary-and-failed li {'+
'  display: none;'+
'}'+
'#testcase-report-block ul.summary-and-failed li#testcase-summary-block,'+
'#testcase-report-block ul.summary-and-failed li.failed-case {'+
'  display: list-item;'+
'}'+
''+
'#testcase-report-block ul.summary-and-all li {'+
'  display: list-item;'+
'}'+
''+
'#testcase-report-block ul.cases-only li#testcase-summary-block {'+
'  display: none;'+
'}'+
''+
'#testcase-report-block ul.summary-and-active li.skipped {'+
'  display: none;'+
'}'+
''+
'#testcase-report-block ul.summary-and-skipped li {'+
'  display: none;'+
'}'+
'#testcase-report-block ul.summary-and-skipped li#testcase-summary-block,'+
'#testcase-report-block ul.summary-and-skipped li.failed-case,'+
'#testcase-report-block ul.summary-and-skipped li.skipped {'+
'  display: list-item;'+
'}'+
''+
'#testcase-report-block ul.active-cases-only li {'+
'  display: list-item;'+
'}'+
'#testcase-report-block ul.active-cases-only li#testcase-summary-block,'+
'#testcase-report-block ul.active-cases-only li.skipped {'+
'  display: none;'+
'}'+
''+
'#testcase-report-block ul.skipped-cases-only li {'+
'  display: none;'+
'}'+
'#testcase-report-block ul.skipped-cases-only li.skipped {'+
'  display: list-item;'+
'}'+
''+
'#testcase-report-block div.failed-code-snippet {'+
'  position: absolute;'+
'  border: 1px solid brown;'+
'  padding: 4pt;'+
'  color: black;'+
'  font-weight: normal;'+
'  background: #FFE;'+
'  cursor: default;'+
'  border-left: 4pt solid brown;'+
'  padding-left: 8pt;'+
'  z-index: 999;'+
(TestCaseUtil.Browser.IE?'margin-top: 1em;':'')+
(TestCaseUtil.Browser.IE?'margin-left: -6em;':'')+
'}'+
'#testcase-report-block div.failed-code-snippet code {'+
'  text-decoration: none !important;'+
'  white-space: pre;'+
'  margin: 0;'+
'  padding: 0;'+
'  display: block;'+
'}'+
'#testcase-report-block div.failed-code-snippet code .problematic-code {'+
'  border-bottom: 1px solid red;'+
'}'+
'#testcase-report-block div.failed-code-snippet code .assertion-method {'+
'  color: #090;'+
'}'+
''+
'#testcase-inline-report-block{'+
'  position: absolute;'+
'  left: 20%;'+
'  top: 10pt;'+
'  background: white;'+
'  z-index: 99999999;'+
'  border: 1px solid gray;'+
'  width: 500pt;'+
'  font-size: 9pt;'+
'  font-family: Verdana;'+
'}'+
'#testcase-inline-report-block div.title{'+
'  display: block;'+
'  height: 14pt;'+
'  background: #EEE;'+
'  padding: 0 4pt;'+
'  border-bottom: 1px solid gray;'+
'}'+
'#testcase-inline-report-block div.title div.closer{'+
'  border: 1px solid gray;'+
'  float: right;'+
'  position: relative;'+
'  display: block;'+
'  width: 8pt;'+
'  height: 8pt;'+
'  line-height: 8pt;'+
'  text-align: center;'+
'  padding: 1pt;'+
'  margin-top: 1pt;'+
'  cursor: pointer;'+
'  background: #EBB;'+
'}'+
'#testcase-inline-report-block div.title div.closer:hover{'+
'  background: #F88'+
'}'+
'#testcase-inline-report-block div.body{'+
'  margin: .5em;'+
'}'+
'</style>');