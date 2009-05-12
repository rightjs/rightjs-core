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
  
  // prepares a right callback for a test
  _callFor: function(element, name) {
    return element == this.el ? 
      function() {
        var args = $A(arguments), element = args.shift();
        return element[name].apply(element, args);
      } :
      Element[name];
  },
  
  testParent: function() {
    this._testParent(this.el);
  },

  testParent_static: function() {
    this._testParent(this.div);
  },
  
  _testParent: function(element) {
    var select = this._callFor(element, 'parent');
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
  
  testParents: function() {
    this._testParents(this.el);
  },
  
  testParents_static: function() {
    this._testParents(this.div);
  },
  
  _testParents: function(element, select) {
    var select = this._callFor(element, 'parents');
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
  
  testSubNodes: function() {
    this._testSubNodes(this.el);
  },
  
  testSubNodes_static: function() {
    this._testSubNodes(this.div);
  },
  
  _testSubNodes: function(element) {
    var select = this._callFor(element, 'subNodes');
    
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
  
  testSiblings: function() {
    this._testSiblings(this.el);
  },
  
  testSiblings_static: function() {
    this._testSiblings(this.div);
  },
  
  _testSiblings: function(element) {
    var select = this._callFor(element, 'siblings');
    
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
  
  testNextSiblings: function() {
    this._testNextSiblings(this.el);
  },
  
  testNextSiblings_static: function() {
    this._testNextSiblings(this.div);
  },
  
  _testNextSiblings: function(element) {
    var select = this._callFor(element, 'nextSiblings');
    
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
  
  testPrevSiblings: function() {
    this._testPrevSiblings(this.el);
  },
  
  testPrevSiblings_static: function() {
    this._testPrevSiblings(this.div);
  },
  
  _testPrevSiblings: function(element) {
    var select = this._callFor(element, 'prevSiblings');
    
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
  
  testNext: function() {
    this._testNext(this.el);
  },
  
  testNext_static: function() {
    this._testNext(this.div);
  },
  
  _testNext: function(element) {
    var select = this._callFor(element, 'next');
    
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
  
  testPrev: function() {
    this._testPrev(this.el);
  },
  
  testPrev_static: function() {
    this._testPrev(this.div);
  },
  
  _testPrev: function(element) {
    var select = this._callFor(element, 'prev');
    
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
  
  testFirst: function() {
    this._testFirst(this.el)
  },
  
  testFirst_static: function() {
    this._testFirst(this.div);
  },
  
  _testFirst: function(element) {
    var select = this._callFor(element, 'first');
    
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
    this.assert(el1['first']);
    
    this.assertEqual(el2, select(element, 'p'), "getting the filtered parents list");
    this.assertEqual(el4, select(element, 'div.our-guy'));
  },
  
  testSelect: function() {
    this._testSelect(this.el);
  },
  
  testSelect_select: function() {
    this._testSelect(this.div);
  },
  
  _testSelect: function(element) {
    var select = this._callFor(element, 'select');
    
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
    
    this.assertEqual([el1, el4, el2].sort(), select(element, 'div, p').sort());
    
    this.assert(el1['select']);
    this.assert(el2['select']);
    this.assert(el4['select']);
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
  
  testRemove: function() {
    this._testRemove(this.el);
  },
  
  testRemove_static: function() {
    this._testRemove(this.div);
  },
  
  _testRemove: function(element) {
    var call = this._callFor(element, 'remove');
    
    document.body.appendChild(element);
    this.assertSame(document.body, element.parentNode);
    this.assertCalled(document.body, 'removeChild', function() {
      this.assertSame(element, call(element));
    }, this);
  },
  
  testInsert: function() {
    this._testInsert(this.el);
  },
  
  testInsert_static: function() {
    this._testInsert(this.div);
  },
  
  _testInsert: function(element) {
    var call = this._callFor(element, 'insert');
    
    call(element, "<div></div><script>self['____test'] = 2;</script>");
    this.assertEqual('<div></div>', element.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    this.assertEqual(2, self['____test']);
    self['____test'] = null;
    
    this.assertSame(element, call(element, document.createElement('span'), 'bottom'));
    this.assertEqual('<div></div><span></span>', element.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    
    call(element, new Element('p'), 'top');
    this.assertEqual('<p></p><div></div><span></span>', element.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    
    call(Element.first(element,'div'), '<blockquote></blockquote><cite></cite>', 'before');
    this.assertEqual('<p></p><blockquote></blockquote><cite></cite><div></div><span></span>', element.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    
    call(Element.first(element, 'blockquote'), [new Element('b'), new Element('u')], 'after');
    this.assertEqual('<p></p><blockquote></blockquote><b></b><u></u><cite></cite><div></div><span></span>', element.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    
    call(Element.first(element, 'p'), 'some string', 'instead');
    this.assertEqual('some string<blockquote></blockquote><b></b><u></u><cite></cite><div></div><span></span>', element.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
  },
  
  testReplace: function() {
    this._testReplace(this.el);
  },
  
  testReplace_static: function() {
    this._testReplace(this.div);
  },
  
  _testReplace: function(element) {
    var call = this._callFor(element, 'replace');
    
    element.innerHTML = '<p></p><div></div><span></span>';
    call(Element.first(element, 'div'), '<ul></ul><ul></ul><script>self["____test"]=4;</script>');
    
    this.assertEqual('<p></p><ul></ul><ul></ul><span></span>', element.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    this.assertEqual(4, self['____test']);
    self['____test'] = null;
    
    this.assertSame(Element.first(element, 'ul'), call(Element.first(element, 'ul'), document.createElement('cite')));
    this.assertEqual('<p></p><cite></cite><ul></ul><span></span>', element.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    
    call(Element.first(element, 'span'), [$E('div'), $E('b')]);
    this.assertEqual('<p></p><cite></cite><ul></ul><div></div><b></b>', element.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    
    call(Element.first(element, 'div'), 'div string');
    this.assertEqual('<p></p><cite></cite><ul></ul>div string<b></b>', element.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
  },
  
  testUpdate: function() {
    this._testUpdate(this.el);
  },
  
  testUpdate_static: function() {
    this._testUpdate(this.div);
  },
  
  _testUpdate: function(element, call) {
    var call = this._callFor(element, 'update');
    
    call(element, '<div></div><script>self["____test"] = 8;</script>');
    this.assertEqual('<div></div>', element.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    this.assertEqual(8, self['____test']);
    self['____test'] = null;
    
    this.assertSame(element, call(element, document.createElement('span')));
    this.assertEqual('<span></span>', element.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    
    call(element, [$E('p'), $E('b'), $E('u')]);
    this.assertEqual('<p></p><b></b><u></u>', element.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
  },
  
  testWrap: function() {
    this._testWrap(this.el);
  },
  
  testWrap_static: function() {
    this._testWrap(this.div);
  },
  
  _testWrap: function(element, call) {
    var call = this._callFor(element, 'wrap');
    
    var p = document.createElement('p');
    var div = document.createElement('div');
    
    div.appendChild(element)
    this.assertSame(element, call(element, p));
    
    this.assertEqual('<p><div></div></p>', div.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
  },
  
  testClean: function() {
    this._testClean(this.el);
  },
  
  testClean_static: function() {
    this._testClean(this.div);
  },
  
  _testClean: function(element) {
    var call = this._callFor(element, 'clean');
    
    element.innerHTML = 'asdfasdf <b>asdfsdf</b> <div>asdfasdf</div>';
    
    this.assertSame(element, call(element));
    this.assertEqual('', element.innerHTML); //.toLowerCase().replace(/\s+</mg, "<"));
  },
  
  testEmpty: function() {
    this._testEmpty(this.el);
  },
  
  testEmpty_static: function() {
    this._testEmpty(this.el);
  },
  
  _testEmpty: function(element) {
    var call = this._callFor(element, 'empty');
    
    this.assert(call(element));
    
    element.innerHTML = "     \n\n\n  ";
    this.assert(call(element));
    
    element.innerHTML = "<div></div>";
    this.assertFalse(call(element));
    
    element.innerHTML = 'asdf';
    this.assertFalse(call(element));
  }
});