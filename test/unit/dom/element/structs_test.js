/**
 * The Element class structures related module functionality test
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var ElementStructsTest = TestCase.create({
  name: 'ElementStructsTest',
  
  setUp: function() {
    this.el = new Element('div');
    this.div = document.createElement('div');
  },
  
  _testParent: function(element, select) {
    var el = document.createElement('div');
    el.appendChild(element);
    
    this.assertSame(el, select(element));
    this.assert(el['parent'], "checking if the element was extended");
  
    // testing filtered by css parent select
    var el1 = document.createElement('div');
    var el2 = document.createElement('div');
    var el3 = document.createElement('div');
    
    el1.appendChild(el);
    el2.appendChild(el1);
    el3.appendChild(el2);
    
    el2.className = 'our-guy';

    this.assertSame(el2, select(element, 'div.our-guy'));
    this.assert(el['parent'], "checking if the element was extened");
  },

  testParent: function() {
    this._testParent(this.el, function(element, css_rule) {
      return element.parent(css_rule);
    })
  },
  
  testParent_static: function() {
    this._testParent(this.div, function(element, css_rule) {
      return Element.parent(element, css_rule);
    });
    
    this.assertNull(this.div['parent'], "should not get extended");
  },
  
  _testParents: function(element, select) {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    
    el1.appendChild(element);
    el2.appendChild(el1);
    el3.appendChild(el2);
    
    this.assertEqual([el1, el2, el3], select(element));
    this.assert(el1['parents']);
    this.assert(el2['parents']);
    this.assert(el2['parents']);
    
    this.assertEqual([el1, el3], select(element, 'div, span'), "getting the filtered parents list");
  },
  
  testParents: function() {
    this._testParents(this.el, function(element, css_rule) {
      return element.parents(css_rule);
    });
  },
  
  testParents_static: function() {
    this._testParents(this.div, function(element, css_rule) {
      return Element.parents(element, css_rule);
    });
    
    this.assertNull(this.div['parents'], "should not get extended");
  },
  
  _testSubNodes: function(element, select) {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    var el4 = document.createElement('div');
    
    element.innerHTML = 'bla'; // creating some text-node
    
    element.appendChild(el1);
    element.appendChild(el2);
    element.appendChild(el3);
    el3.appendChild(el4);

    this.assertEqual([el1, el2, el3], select(element)); 
    this.assert(el1['subNodes']);
    this.assert(el2['subNodes']);
    this.assert(el3['subNodes']);
    
    this.assertEqual([el1, el3], select(element, 'div, span'), "getting the filtered parents list");
  },
  
  testSubNodes: function() {
    this._testSubNodes(this.el, function(element, css_rule) {
      return element.subNodes(css_rule);
    });
  },
  
  testSubNodes_static: function() {
    this._testSubNodes(this.div, function(element, css_rule) {
      return Element.subNodes(element, css_rule);
    });
    
    this.assertNull(this.div['subNodes'], "should not get extended");
  },
  
  _testSiblings: function(element, select) {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    var el4 = document.createElement('div');
    
    el4.innerHTML = 'bla'; // creating some text-node
    
    el4.appendChild(el1);
    el4.appendChild(element);
    el4.appendChild(el2);
    el4.appendChild(el3);
    
    this.assertEqual([el1, el2, el3], select(element));
    this.assert(el1['siblings']);
    this.assert(el2['siblings']);
    this.assert(el3['siblings']);
    
    this.assertEqual([el1, el3], select(element, 'div, span'), "getting the filtered siblings list");
  },
  
  testSiblings: function() {
    this._testSiblings(this.el, function(element, css_rule) {
      return element.siblings(css_rule);
    });
  },
  
  testSiblings_static: function() {
    this._testSiblings(this.div, function(element, css_rule) {
      return Element.siblings(element, css_rule);
    });
    
    this.assertNull(this.div['siblings'], "should not get extended");
  },
  
  _testNextSiblings: function(element, select) {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    var el4 = document.createElement('div');
    
    el4.innerHTML = 'bla'; // creating some text-node
    
    el4.appendChild(el1);
    el4.appendChild(element);
    el4.appendChild(el2);
    el4.appendChild(el3);
    
    this.assertEqual([el2, el3], select(element));
    this.assert(el2['nextSiblings']);
    this.assert(el3['nextSiblings']);
    
    this.assertEqual([el3], select(element, 'span'), "checking the filtered list");
  },
  
  testNextSiblings: function() {
    this._testNextSiblings(this.el, function(element, css_rule) {
      return element.nextSiblings(css_rule);
    });
  },
  
  testNextSiblings_static: function() {
    this._testNextSiblings(this.div, function(element, css_rule) {
      return Element.nextSiblings(element, css_rule);
    });
    
    this.assertNull(this.div['nextSiblings'], "should not get extended");
  },
  
  _testPrevSiblings: function(element, select) {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    var el4 = document.createElement('div');
    
    el4.innerHTML = 'bla'; // creating some text-node
    
    el4.appendChild(el1);
    el4.appendChild(el2);
    el4.appendChild(element);
    el4.appendChild(el3);
    
    this.assertEqual([el2, el1], select(element));
    this.assert(el1['prevSiblings']);
    this.assert(el2['prevSiblings']);
    
    this.assertEqual([el1], select(element, 'div'), "checking the filtered list");
  },
  
  testPrevSiblings: function() {
    this._testPrevSiblings(this.el, function(element, css_rule) {
      return element.prevSiblings(css_rule);
    });
  },
  
  testPrevSiblings_static: function() {
    this._testPrevSiblings(this.div, function(element, css_rule) {
      return Element.prevSiblings(element, css_rule);
    });
    
    this.assertNull(this.div['prevSiblings'], "should not get extended");
  },
  
  _testNext: function(element, select) {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    var el4 = document.createElement('div');
    
    el4.innerHTML = 'bla'; // creating some text-node
    
    el4.appendChild(el1);
    el4.appendChild(element);
    el4.appendChild(el2);
    el4.appendChild(el3);
    
    this.assertEqual(el2, select(element));
    this.assert(el2['next']);
    
    this.assertEqual(el3, select(element, 'span'), "checking the filtered list");
  },
  
  testNext: function() {
    this._testNext(this.el, function(element, css_rule) {
      return element.next(css_rule);
    });
  },
  
  testNext_static: function() {
    this._testNext(this.div, function(element, css_rule) {
      return Element.next(element, css_rule);
    });
    
    this.assertNull(this.div['next'], "should not get extended");
  },
  
  _testPrev: function(element, select) {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    var el4 = document.createElement('div');
    
    el4.innerHTML = 'bla'; // creating some text-node
    
    el4.appendChild(el1);
    el4.appendChild(el2);
    el4.appendChild(element);
    el4.appendChild(el3);
    
    this.assertEqual(el2, select(element));
    this.assert(el2['prev']);
    
    this.assertEqual(el1, select(element, 'div'), "checking the filtered list");
  },
  
  testPrev: function() {
    this._testPrev(this.el, function(element, css_rule) {
      return element.prev(css_rule);
    });
  },
  
  testPrev_static: function() {
    this._testPrev(this.div, function(element, css_rule) {
      return Element.prev(element, css_rule);
    });
    this.assertNull(this.div['prev'], "should not get extended");
  },
  
  _testUp: function(element, select) {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    
    el1.appendChild(element);
    el2.appendChild(el1);
    el3.appendChild(el2);
    
    this.assertEqual(el1, select(element));
    this.assert(el1['up']);
    
    this.assertEqual(el2, select(element, 'p'), "getting the filtered parents list");
  },
  
  testUp: function() {
    this._testUp(this.el, function(element, css_rule) {
      return element.up(css_rule);
    });
  },
  
  testUp_static: function() {
    this._testUp(this.div, function(element, css_rule) {
      return Element.up(element, css_rule);
    });
    this.assertNull(this.div['up'], "should not get extended");
  },
  
  _testDown: function(element, select) {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    var el4 = document.createElement('div');
    
    element.innerHTML = 'bla'; // creating some text-node
    
    element.appendChild(el1);
    element.appendChild(el2);
    element.appendChild(el3);
    el3.appendChild(el4);
    
    el4.className = 'our-guy';

    this.assertEqual(el1, select(element));
    this.assert(el1['down']);
    
    this.assertEqual(el2, select(element, 'p'), "getting the filtered parents list");
    this.assertEqual(el4, select(element, 'div.our-guy'));
  },
  
  testDown: function() {
    this._testDown(this.el, function(element, css_rule) {
      return element.down(css_rule);
    })
  },
  
  testDown_static: function() {
    this._testDown(this.div, function(element, css_rule) {
      return Element.down(element, css_rule);
    });
    this.assertNull(this.div['down'], "should not get extended");
  },
  
  _testSelect: function(element, select) {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    var el4 = document.createElement('div');
    
    element.innerHTML = 'bla'; // creating some text-node
    
    element.appendChild(el1);
    element.appendChild(el2);
    element.appendChild(el3);
    el3.appendChild(el4);
    
    el4.className = 'our-guy';
    
    this.assertEqual([el1, el4, el2], select(element, 'div, p'));
    this.assert(el1['select']);
    this.assert(el2['select']);
    this.assert(el4['select']);
  },
  
  testSelect: function() {
    this._testSelect(this.el, function(element, css_rule) {
      return element.select(css_rule);
    });
  },
  
  testSelect_select: function() {
    this._testSelect(this.div, function(element, css_rule) {
      return Element.select(element, css_rule);
    });
    this.assertNull(this.div['select'], "should not get extended");
  },
  
  testMatch: function() {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    var el4 = document.createElement('div');
    
    this.el.innerHTML = 'bla'; // creating some text-node
    
    this.el.appendChild(el1);
    this.el.appendChild(el2);
    this.el.appendChild(el3);
    el3.appendChild(el4);
    
    el4.className = 'our-guy';
    
    this.assert(Element.match(el1, 'div'));
    this.assert(Element.match(el2, 'p'));
    this.assert(Element.match(el4, 'span div'));
    
    this.assertFalse(Element.match(el2, 'div'));
    this.assertFalse(Element.match(el4, 'p'));
    this.assertFalse(Element.match(el1, 'span div'));
    
    this.assert($(el1).match('div'));
    this.assert($(el2).match('p'));
    this.assert($(el4).match('span div'));
    
    this.assertFalse($(el2).match('div'));
    this.assertFalse($(el4).match('p'));
    this.assertFalse($(el1).match('span div'));
  },
  
  _testRemove: function(element, call) {
    document.body.appendChild(element);
    this.assertSame(document.body, element.parentNode);
    this.assertCalled(document.body, 'removeChild', function() {
      this.assertSame(element, call(element));
    }, this);
  },
  
  testRemove: function() {
    this._testRemove(this.el, function(element) {
      return element.remove();
    });
  },
  
  testRemove_static: function() {
    this._testRemove(this.div, function(element) {
      return Element.remove(element);
    });
    this.assertNull(this.div['remove'], "should not get extended");
  },
  
  _testInsert: function(element, call) {
    call(element, "<div></div><script>self['____test'] = 2;</script>");
    this.assertEqual('<div></div>', element.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    this.assertEqual(2, self['____test']);
    self['____test'] = null;
    
    this.assertSame(element, call(element, document.createElement('span'), 'bottom'));
    this.assertEqual('<div></div><span></span>', element.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    
    call(element, new Element('p'), 'top');
    this.assertEqual('<p></p><div></div><span></span>', element.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    
    call(Element.down(element,'div'), '<blockquote></blockquote><cite></cite>', 'before');
    this.assertEqual('<p></p><blockquote></blockquote><cite></cite><div></div><span></span>', element.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    
    call(Element.down(element, 'blockquote'), [new Element('b'), new Element('u')], 'after');
    this.assertEqual('<p></p><blockquote></blockquote><b></b><u></u><cite></cite><div></div><span></span>', element.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    
    call(Element.down(element, 'p'), 'some string', 'instead');
    this.assertEqual('some string<blockquote></blockquote><b></b><u></u><cite></cite><div></div><span></span>', element.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
  },
  
  testInsert: function() {
    this._testInsert(this.el, function() {
      var args = $A(arguments), element = args.shift();
      return element.insert.apply(element, args);
    });
  },
  
  testInsert_static: function() {
    this._testInsert(this.div, Element.insert);
    this.assertNull(this.div['insert'], "should not get extended");
  },
  
  _testReplace: function(element, call) {
    element.innerHTML = '<p></p><div></div><span></span>';
    call(Element.down(element, 'div'), '<ul></ul><ul></ul><script>self["____test"]=4;</script>');
    
    this.assertEqual('<p></p><ul></ul><ul></ul><span></span>', element.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    this.assertEqual(4, self['____test']);
    self['____test'] = null;
    
    this.assertSame(Element.down(element, 'ul'), call(Element.down(element, 'ul'), document.createElement('cite')));
    this.assertEqual('<p></p><cite></cite><ul></ul><span></span>', element.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    
    call(Element.down(element, 'span'), [$E('div'), $E('b')]);
    this.assertEqual('<p></p><cite></cite><ul></ul><div></div><b></b>', element.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    
    call(Element.down(element, 'div'), 'div string');
    this.assertEqual('<p></p><cite></cite><ul></ul>div string<b></b>', element.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
  },
  
  testReplace: function() {
    this._testReplace(this.el, function() {
      var args = $A(arguments), element = args.shift();
      return element.replace.apply(element, args);
    })
  },
  
  testReplace_static: function() {
    this._testReplace(this.div, Element.replace);
    this.assertNull(this.div['replace'], "should not get extended");
  },
  
  _testUpdate: function(element, call) {
    call(element, '<div></div><script>self["____test"] = 8;</script>');
    this.assertEqual('<div></div>', element.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    this.assertEqual(8, self['____test']);
    self['____test'] = null;
    
    this.assertSame(element, call(element, document.createElement('span')));
    this.assertEqual('<span></span>', element.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    
    call(element, [$E('p'), $E('b'), $E('u')]);
    this.assertEqual('<p></p><b></b><u></u>', element.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
  },
  
  testUpdate: function() {
    this._testUpdate(this.el, function() {
      var args = $A(arguments), element = args.shift();
      return element.update.apply(element, args);
    });
  },
  
  testUpdate_static: function() {
    this._testUpdate(this.div, Element.update);
    this.assertNull(this.div['update'], "should not get extended");
  },
  
  _testWrap: function(element, call) {
    var p = document.createElement('p');
    var div = document.createElement('div');
    
    div.appendChild(element)
    this.assertSame(element, call(element, p));
    
    this.assertEqual('<p><div></div></p>', div.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
  },
  
  testWrap: function() {
    this._testWrap(this.el, function(element, wrap) {
      return element.wrap(wrap);
    });
  },
  
  testWrap_static: function() {
    this._testWrap(this.div, function(element, wrap) {
      return Element.wrap(element, wrap);
    });
    this.assertNull(this.div['wrap'], "should not get extended");
  },
  
  _testClean: function(element, call) {
    element.innerHTML = 'asdfasdf <b>asdfsdf</b> <div>asdfasdf</div>';
    
    this.assertSame(element, call(element));
    this.assertEqual('', element.innerHTML); //.toLowerCase().replace(/\s+</mg, "<"));
  },
  
  testClean: function() {
    this._testClean(this.el, function(element) {
      return element.clean();
    });
  },
  
  testClean_static: function() {
    this._testClean(this.div, function(element) {
      return Element.clean(element);
    });
    this.assertNull(this.div['clean'], "should not get extended");
  },
  
  _testEmpty: function(element, call) {
    this.assert(call(element));
    
    element.innerHTML = "     \n\n\n  ";
    this.assert(call(element));
    
    element.innerHTML = "<div></div>";
    this.assertFalse(call(element));
    
    element.innerHTML = 'asdf';
    this.assertFalse(call(element));
  },
  
  testEmpty: function() {
    this._testEmpty(this.el, function(element) {
      return element.empty();
    });
  },
  
  testEmpty_static: function() {
    this._testEmpty(this.el, function(element) {
      return element.empty();
    });
    this.assertNull(this.div['empty'], "should not get extended");
  }
  
});