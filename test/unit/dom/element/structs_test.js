/**
 * The Element class structures related module functionality test
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
 */
var ElementStructsTest = TestCase.create({
  name: 'ElementStructsTest',
  
  beforeAll: function() {
    this.container = $E('div').insertTo(document.body);
  },
  
  afterAll: function() {
    this.container.remove();
  },
  
  setUp: function() {
    this.el = new Element('div');
  },
  
  testParent: function() {
    var el = document.createElement('div');
    el.appendChild(this.el._);
    var parent = this.el.parent();
    
    this.assertSame(el, parent._);
    this.assert(parent instanceof RightJS.Element, "checking if the element was extended");
  
    // testing filtered by css parent select
    var el1 = document.createElement('div');
    var el2 = document.createElement('div');
    var el3 = document.createElement('div');
    
    el1.appendChild(el);
    el2.appendChild(el1);
    el3.appendChild(el2);
    
    el2.className = 'our-guy';
    
    var result = this.el.parent('div.our-guy')
    
    this.assertSame(el2, result._);
    this.assert(result instanceof RightJS.Element, "checking if the element was extened");
  },
  
  testParents: function() {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    
    el1.appendChild(this.el._);
    el2.appendChild(el1);
    el3.appendChild(el2);
    
    var parents = this.el.parents();
    
    this.assertEqual([el1, el2, el3], parents.map('_'));
    this.assert(parents[0] instanceof RightJS.Element);
    this.assert(parents[1] instanceof RightJS.Element);
    this.assert(parents[2] instanceof RightJS.Element);
    
    this.assertEqual([el1, el3], this.el.parents('div, span').map('_'), "getting the filtered parents list");
    
    // trying them inside of the page context
    this.container.insert(el3);
    
    this.assertEqual(
      [el1, el2, el3, this.container._, document.body, document.documentElement],
      this.el.parents().map('_')
    );
    
    this.assertEqual([el1, el3, this.container._], this.el.parents('div, span').map('_'));
  },
  
  testChildren: function() {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    var el4 = document.createElement('div');
    
    this.el._.innerHTML = 'bla'; // creating some text-node
    
    this.el._.appendChild(el1);
    this.el._.appendChild(el2);
    this.el._.appendChild(el3);
    el3.appendChild(el4);
    
    var result = this.el.children();
    
    this.assertEqual([el1, el2, el3], result.map('_'));
    this.assert(result[0] instanceof RightJS.Element);
    this.assert(result[1] instanceof RightJS.Element);
    this.assert(result[2] instanceof RightJS.Element);
    
    this.assertEqual([el1, el3], this.el.children('div, span').map('_'), "getting the filtered subnodes list");
    this.assertEqual([el2], this.el.children('p').map('_'), "filtering the subnodes differently");
    
    // trying the same things, but with more settings
    var el = $E('div');
    var d1 = $E('div', {id: 'a'});
    var d2 = $E('div', {id: 'b'});
    
    el.insert([d1, d2]);
    
    this.assertEqual([d2], el.children('#b'));
  },
  
  testSubNodesAlias: function() {
    this.assertSame(Element.prototype.subNodes, Element.prototype.children);
  },
  
  testSiblings: function() {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    var el4 = document.createElement('div');
    
    el4.innerHTML = 'bla'; // creating some text-node
    
    el4.appendChild(el1);
    el4.appendChild(this.el._);
    el4.appendChild(el2);
    el4.appendChild(el3);
    
    var result = this.el.siblings();
    
    this.assertEqual([el1, el2, el3], result.map('_'));
    this.assert(result[0] instanceof RightJS.Element);
    this.assert(result[1] instanceof RightJS.Element);
    this.assert(result[2] instanceof RightJS.Element);
    
    this.assertEqual([el1, el3], this.el.siblings('div, span').map('_'), "getting the filtered siblings list");
  },
  
  testNextSiblings: function() {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    var el4 = document.createElement('div');
    
    el4.innerHTML = 'bla'; // creating some text-node
    
    el4.appendChild(el1);
    el4.appendChild(this.el._);
    el4.appendChild(el2);
    el4.appendChild(el3);
    
    var result = this.el.nextSiblings();
    
    this.assertEqual([el2, el3], result.map('_'));
    this.assert(result[0] instanceof RightJS.Element);
    this.assert(result[1] instanceof RightJS.Element);
    
    this.assertEqual([el3], this.el.nextSiblings('span').map('_'), "checking the filtered list");
  },
  
  testPrevSiblings: function() {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    var el4 = document.createElement('div');
    
    el4.innerHTML = 'bla'; // creating some text-node
    
    el4.appendChild(el1);
    el4.appendChild(el2);
    el4.appendChild(this.el._);
    el4.appendChild(el3);
    
    var result = this.el.prevSiblings();
    
    this.assertEqual([el2, el1], result.map('_'));
    this.assert(result[0] instanceof RightJS.Element);
    this.assert(result[1] instanceof RightJS.Element);
    
    this.assertEqual([el1], this.el.prevSiblings('div').map('_'), "checking the filtered list");
  },
  
  testNext: function() {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    var el4 = document.createElement('div');
    
    el4.innerHTML = 'bla'; // creating some text-node
    
    el4.appendChild(el1);
    el4.appendChild(this.el._);
    el4.appendChild(el2);
    el4.appendChild(el3);
    
    var result = this.el.next();
    
    this.assertSame(el2, result._);
    this.assert(result instanceof RightJS.Element);
    
    this.assertSame(el3, this.el.next('span')._, "checking the filtered list");
  },
  
  testPrev: function() {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    var el4 = document.createElement('div');
    
    el4.innerHTML = 'bla'; // creating some text-node
    
    el4.appendChild(el1);
    el4.appendChild(el2);
    el4.appendChild(this.el._);
    el4.appendChild(el3);
    
    var result = this.el.prev();
    
    this.assertSame(el2, result._);
    this.assert(result instanceof RightJS.Element);
    
    this.assertSame(el1, this.el.prev('div')._, "checking the filtered list");
  },
  
  testFirst: function() {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    var el4 = document.createElement('div');
    
    this.el._.innerHTML = 'bla'; // creating some text-node
    
    this.el._.appendChild(el1);
    this.el._.appendChild(el2);
    this.el._.appendChild(el3);
    el3.appendChild(el4);
    
    el4.className = 'our-guy';
    this.assertSame(el1, this.el.first()._);
    this.assert(this.el.first() instanceof RightJS.Element);
    
    this.assertSame(el2, this.el.first('p')._);
    this.assertSame(el4, this.el.first('div.our-guy')._);
  },
  
  testFind: function() {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    var el4 = document.createElement('div');
    
    this.el._.innerHTML = 'bla'; // creating some text-node
    
    this.el._.appendChild(el1);
    this.el._.appendChild(el2);
    this.el._.appendChild(el3);
    el3.appendChild(el4);
    
    el4.className = 'our-guy';
    
    var result = this.el.find('div, p');
    
    this.assertEqual([el1, el4, el2].sort(), result.map('_').sort());
    
    this.assert(result[0] instanceof RightJS.Element);
    this.assert(result[1] instanceof RightJS.Element);
    this.assert(result[2] instanceof RightJS.Element);
  },
  
  testSelectAlias: function() {
    this.assertSame(Element.prototype.select, Element.prototype.find);
  },
  
  testMatch: function() {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    var el4 = document.createElement('div');
    
    this.el._.innerHTML = 'bla'; // creating some text-node
    
    this.el._.appendChild(el1);
    this.el._.appendChild(el2);
    this.el._.appendChild(el3);
    el3.appendChild(el4);
    
    el4.className = 'our-guy';
    
    this.assert($(el1).match('div'));
    this.assert($(el2).match('p'));
    this.assert($(el4).match('span div'));
    
    this.assertFalse($(el2).match('div'));
    this.assertFalse($(el4).match('p'));
    this.assertFalse($(el1).match('span div'));
  },
  
  testRemove: function() {
    document.body.appendChild(this.el._);
    this.assertSame(document.body, this.el._.parentNode);
    this.assertCalled(document.body, 'removeChild', function() {
      this.assertSame(this.el, this.el.remove());
    }, this);
  },
  
  _html: function(el) {
    var element = el || this.el;
    element = '_' in element ? element._ : element;
    return element.innerHTML.toLowerCase()
      .replace(/\s+</mg, "<").replace(/\s+_rid[^=]+="\d+"/mg, '')
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/img, '');
  },
  
  testInsert: function() {
    this.assertSame(this.el, this.el.insert("<div></div><script>self['____test'] = 2;</script>"));
    this.assertEqual('<div></div>', this._html());
    this.assertEqual(2, self['____test']);
    self['____test'] = null;
    
    this.assertSame(this.el, this.el.insert(document.createElement('span'), 'bottom'));
    this.assertEqual('<div></div><span></span>', this._html());
    
    this.el.insert(new Element('b'), 'top');
    this.assertEqual('<b></b><div></div><span></span>', this._html());
    
    this.el.first('div').insert('<blockquote></blockquote><cite></cite>', 'before');
    this.assertEqual(
      '<b></b><blockquote></blockquote><cite></cite><div></div><span></span>',
      this._html()
    );
    
    this.el.first('blockquote').insert([new Element('i'), new Element('u')], 'after');
    this.assertEqual(
      '<b></b><blockquote></blockquote><i></i><u></u><cite></cite><div></div><span></span>',
      this._html()
    );
    
    this.el.first('b').insert('some string', 'instead');
    this.assertEqual(
      'some string<blockquote></blockquote><i></i><u></u><cite></cite><div></div><span></span>',
      this._html()
    );
  },
  
  testInsertTable: function() {
    var el = $E('table').insert('<tr><td>test</td></tr>');
    this.assertEqual('<tbody><tr><td>test</td></tr></tbody>',
      this._html(el)
    );
    
    el.first('tr').insert('<tr><td>another</td></tr>', 'after');
    this.assertEqual('<tbody><tr><td>test</td></tr><tr><td>another</td></tr></tbody>',
      this._html(el)
    );
    
    el.first('tr').insert('<tr><td>more</td></tr>', 'before');
    this.assertEqual('<tbody><tr><td>more</td></tr><tr><td>test</td></tr><tr><td>another</td></tr></tbody>',
      this._html(el)
    );
  },
  
  testInsertOptions: function() {
    var el = $E('select').insert('<option>test</option>');
    this.assertEqual('<option>test</option>',
      this._html(el).replace(' selected', '') // <- IE fix
    )
  },
  
  testInsertTo: function() {
    var div = document.createElement('div');
    
    this.el._.innerHTML = 'element';
    
    this.assertSame(this.el, this.el.insertTo(div));
    
    this.assertEqual([this.el._], $A(div.childNodes));
    
  },
  
  testAppend: function() {
    this.el.append(
      $E('i', {html:'1'}),
      $E('b', {html:'2'}),
      $E('u', {html:'3'})
    );
    this.assertEqual('<i>1</i><b>2</b><u>3</u>', this._html());
  },
  
  testAppendStrings: function() {
    this.el.append(
      '<i>1</i>',
      '<b>2</b>',
      '<u>3</u>'
    );
    this.assertEqual('<i>1</i><b>2</b><u>3</u>', this._html());
  },
  
  testUpdate: function() {
    this.el.update('<div></div><script>self["____test"] = 8;</script>');
    this.assertEqual('<div></div>', this._html());
    this.assertEqual(8, self['____test']);
    self['____test'] = null;
    
    this.assertSame(this.el, this.el.update(document.createElement('span')));
    this.assertEqual('<span></span>', this._html());
    
    this.el.update([$E('i'), $E('b'), $E('u')]);
    this.assertEqual('<i></i><b></b><u></u>', this._html());
  },
  
  testUpdateSelect: function() {
    var element = $E('select').update('<option value="o1">O1</option><option value="o2">O2</option>');
    var options = $A(element._.getElementsByTagName('option'));
    
    this.assertEqual(['o1','o2'], options.map('value'));
    this.assertEqual(['O1','O2'], options.map('innerHTML'));
  },
  
  testUpdateSelectWithSelectedOptions: function() {
    var e1 = $E('select').update('<option selected="true" value="1">1</option><option value="2">2</option>');
    var e2 = $E('select').update('<option value="1">1</option><option selected="true" value="2">2</option>');
    
    this.assertEqual('1', e1._.value);
    this.assertEqual('2', e2._.value);
    
    // checking that the non-string content works correctly
    var e3 = $E('select').insert([
      $E('option', {selected: true, value: '1', html: '1'}),
      $E('option', {value: '2', html: '2'})
    ]);
    
    this.assertEqual('1', e3._.value);
  },
  
  testUpdateOptgroup: function() {
    var element = $E('select').update('<optgroup label="Boos"></optgroup>');
    var optgroup = $(element._.getElementsByTagName('optgroup')[0])
      .update('<option>O1</option><option>O2</option>');
    var options = $A(element._.getElementsByTagName('option'));
    this.assertEqual(['O1','O2'], options.map('innerHTML'));
  },
  
  testUpdateLists: function() {
    var content = '<LI>one</LI><LI>two</LI>';
    [
      $E('ul').update(content),
      $E('ol').update(content),
      $E('dl').update(content)
    ].each(function(element) {
      this.assertEqual(content.toLowerCase(), element._.innerHTML.toLowerCase(0).replace(/\s+/im, ""));
    }, this)
  },
  
  testInsertAndUpdateWithNumbers: function() {
    this.el.insert(2.2);
    this.assertEqual('2.2', this.el._.innerHTML);
    this.el.update(44);
    this.assertEqual('44', this.el._.innerHTML);
    this.assertEqual('8.8', $E('div', {html: 8.8})._.innerHTML);
  },
  
  testReplace: function() {
    this.el._.innerHTML = '<b></b><div></div><span></span>';
    this.el.first('div').replace('<ul></ul><ul></ul><script>self["____test"]=4;</script>');
    
    this.assertEqual('<b></b><ul></ul><ul></ul><span></span>', this._html());
    this.assertEqual(4, self['____test']);
    self['____test'] = null;
    
    this.assertSame(this.el.first('ul'), this.el.first('ul').replace(document.createElement('cite')));
    this.assertEqual('<b></b><cite></cite><ul></ul><span></span>', this._html());
    
    this.el.first('span').replace([$E('div'), $E('u')]);
    this.assertEqual('<b></b><cite></cite><ul></ul><div></div><u></u>', this._html());
    
    this.el.first('div').replace('div string');
    this.assertEqual('<b></b><cite></cite><ul></ul>div string<u></u>', this._html());
  },
  
  testWrap: function() {
    var p = document.createElement('p');
    var div = document.createElement('div');
    
    div.appendChild(this.el._)
    this.assertSame(this.el, this.el.wrap(p));
    
    this.assertEqual('<p><div></div></p>', this._html(div));
  },
  
  testClean: function() {
    this.el._.innerHTML = 'asdfasdf <b>asdfsdf</b> <div>asdfasdf</div>';
    
    this.assertSame(this.el, this.el.clean());
    this.assertEqual('', this.el._.innerHTML); //.toLowerCase().replace(/\s+</mg, "<"));
  },
  
  testEmpty: function() {
    this.el._.innerHTML = "     \n\n\n  ";
    this.assert(this.el.empty());
    
    this.el._.innerHTML = "<div></div>";
    this.assertFalse(this.el.empty());
    
    this.el._.innerHTML = 'asdf';
    this.assertFalse(this.el.empty());
  },
  
  testHtml_getter: function() {
    this.el._.innerHTML = 'boo hoo';
    
    this.assertEqual('boo hoo', this.el.html());
  },
  
  testHtml_setter: function() {
    this.assertSame(this.el, this.el.html('boo hoo'));
    this.assertEqual('boo hoo', this.el._.innerHTML);
  },
  
  testAnotherFrameAccess: function() {
    var id = 'elements_checks_iframe';
    
    $E('div').insertTo(document.body).update('<iframe name="'+id+'" id="'+id+
      '" width="0" height="0" frameborder="0" src="about:blank"></iframe>');
    
    var doc = window.frames[id].document;
    doc.open();
    doc.write(
      '<html><body>'+
        '<div id="test">'+
          '<div class="that">one</div>'+
          '<div class="that">two</div>'+
          '<div class="another">three</div>'+
          '<div class="last">last one</div>'+
        '</div>'+
      '</body></html>'
    );
    doc.close();
    
    // grabbing the elements
    var e = $(doc.getElementById('test'));
    
    // checking that the element was automatically extended
    this.assert(e instanceof RightJS.Element);
    
    var that_divs = e.find('div.that');
    this.assertEqual(['one', 'two'], that_divs.map('html'));
    this.assert(that_divs[0].set && that_divs[1].set, 'both elements should be extended');
    
    var another = e.first('div.another');
    this.assertEqual('three', another._.innerHTML);
    this.assert('set' in another, 'the third element should be extended');
    
    var last = another.next();
    this.assertEqual('last one', last._.innerHTML);
    this.assert('set' in last, 'the last element should be extended');
  },
  
  testClone: function() {
    var original = new Element('div', {html: 'boo hoo!'}).onClick('hide');
    var clone    = original.clone();
    
    this.assert(clone instanceof Element, "Clone should be instance of an Element");
    this.assertNotSame(original, clone);
    this.assertNotSame(original._, clone._);
    
    this.assertEqual('DIV', clone._.tagName, 'Clone should have correct tag-name');
    this.assertEqual(original.html(), clone.html(), 'Clone should have the same innerHTML');
    this.assertFalse(clone.observes('click'), 'Clone should not inherit the events');
  }
});

