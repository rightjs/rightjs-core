/**
 * The Element class structures related module functionality test
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var ElementStructsTest = TestCase.create({
  name: 'ElementStructsTest',
  
  setUp: function() {
    this.el = new Element('div');
  },
  
  testParent: function() {
    var el = document.createElement('div');
    el.appendChild(this.el);
    
    this.assertSame(el, this.el.parent());
    this.assert(el['parent'], "checking if the element was extended");
  
    // testing filtered by css parent select
    var el1 = document.createElement('div');
    var el2 = document.createElement('div');
    var el3 = document.createElement('div');
    
    el1.appendChild(el);
    el2.appendChild(el1);
    el3.appendChild(el2);
    
    el2.className = 'our-guy';
    
    this.assertSame(el2, this.el.parent('div.our-guy'));
    this.assert(el2['parent'], "checking if the element was extened");
  },
  
  testParents: function() {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    
    el1.appendChild(this.el);
    el2.appendChild(el1);
    el3.appendChild(el2);
    
    this.assertEqual([el1, el2, el3], this.el.parents());
    this.assert(el1['parents']);
    this.assert(el2['parents']);
    this.assert(el2['parents']);
    
    this.assertEqual([el1, el3], this.el.parents('div, span'), "getting the filtered parents list");
  },
  
  testSubNodes: function() {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    var el4 = document.createElement('div');
    
    this.el.innerHTML = 'bla'; // creating some text-node
    
    this.el.appendChild(el1);
    this.el.appendChild(el2);
    this.el.appendChild(el3);
    el3.appendChild(el4);

    this.assertEqual([el1, el2, el3], this.el.subNodes()); 
    this.assert(el1['subNodes']);
    this.assert(el2['subNodes']);
    this.assert(el3['subNodes']);
    
    this.assertEqual([el1, el3], this.el.subNodes('div, span'), "getting the filtered subnodes list");
    this.assertEqual([el2], this.el.subNodes('p'), "filtering the subnodes differently");
    
    // trying the same things, but with more settings
    var el = $E('div');
    var d1 = $E('div', {id: 'a'});
    var d2 = $E('div', {id: 'b'});
    
    el.insert([d1, d2]);
    
    this.assertEqual([d2], el.subNodes('#b'));
  },
  
  testSiblings: function() {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    var el4 = document.createElement('div');
    
    el4.innerHTML = 'bla'; // creating some text-node
    
    el4.appendChild(el1);
    el4.appendChild(this.el);
    el4.appendChild(el2);
    el4.appendChild(el3);
    
    this.assertEqual([el1, el2, el3], this.el.siblings());
    this.assert(el1['siblings']);
    this.assert(el2['siblings']);
    this.assert(el3['siblings']);
    
    this.assertEqual([el1, el3], this.el.siblings('div, span'), "getting the filtered siblings list");
  },
  
  testNextSiblings: function() {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    var el4 = document.createElement('div');
    
    el4.innerHTML = 'bla'; // creating some text-node
    
    el4.appendChild(el1);
    el4.appendChild(this.el);
    el4.appendChild(el2);
    el4.appendChild(el3);
    
    this.assertEqual([el2, el3], this.el.nextSiblings());
    this.assert(el2['nextSiblings']);
    this.assert(el3['nextSiblings']);
    
    this.assertEqual([el3], this.el.nextSiblings('span'), "checking the filtered list");
  },
  
  testPrevSiblings: function() {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    var el4 = document.createElement('div');
    
    el4.innerHTML = 'bla'; // creating some text-node
    
    el4.appendChild(el1);
    el4.appendChild(el2);
    el4.appendChild(this.el);
    el4.appendChild(el3);
    
    this.assertEqual([el2, el1], this.el.prevSiblings());
    this.assert(el1['prevSiblings']);
    this.assert(el2['prevSiblings']);
    
    this.assertEqual([el1], this.el.prevSiblings('div'), "checking the filtered list");
  },
  
  testNext: function() {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    var el4 = document.createElement('div');
    
    el4.innerHTML = 'bla'; // creating some text-node
    
    el4.appendChild(el1);
    el4.appendChild(this.el);
    el4.appendChild(el2);
    el4.appendChild(el3);
    
    this.assertEqual(el2, this.el.next());
    this.assert(el2['next']);
    
    this.assertEqual(el3, this.el.next('span'), "checking the filtered list");
  },
  
  testPrev: function() {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    var el4 = document.createElement('div');
    
    el4.innerHTML = 'bla'; // creating some text-node
    
    el4.appendChild(el1);
    el4.appendChild(el2);
    el4.appendChild(this.el);
    el4.appendChild(el3);
    
    this.assertEqual(el2, this.el.prev());
    this.assert(el2['prev']);
    
    this.assertEqual(el1, this.el.prev('div'), "checking the filtered list");
  },
  
  testFirst: function() {
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
    this.assertEqual(el1, this.el.first());
    this.assert(el1['first']);
    
    this.assertEqual(el2, this.el.first('p'));
    this.assertEqual(el4, this.el.first('div.our-guy'));
  },
  
  testSelect: function() {
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
    
    this.assertEqual([el1, el4, el2].sort(), this.el.select('div, p').sort());
    
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
    
    this.assert($(el1).match('div'));
    this.assert($(el2).match('p'));
    this.assert($(el4).match('span div'));
    
    this.assertFalse($(el2).match('div'));
    this.assertFalse($(el4).match('p'));
    this.assertFalse($(el1).match('span div'));
  },
  
  testRemove: function() {
    document.body.appendChild(this.el);
    this.assertSame(document.body, this.el.parentNode);
    this.assertCalled(document.body, 'removeChild', function() {
      this.assertSame(this.el, this.el.remove());
    }, this);
  },
  
  testInsert: function() {
    this.assertSame(this.el, this.el.insert("<div></div><script>self['____test'] = 2;</script>"));
    this.assertEqual('<div></div>', this.el.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    this.assertEqual(2, self['____test']);
    self['____test'] = null;
    
    this.assertSame(this.el, this.el.insert(document.createElement('span'), 'bottom'));
    this.assertEqual('<div></div><span></span>', this.el.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    
    this.el.insert(new Element('b'), 'top');
    this.assertEqual('<b></b><div></div><span></span>', this.el.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    
    this.el.first('div').insert('<blockquote></blockquote><cite></cite>', 'before');
    this.assertEqual(
      '<b></b><blockquote></blockquote><cite></cite><div></div><span></span>',
      this.el.innerHTML.toLowerCase().replace(/\s+</mg, "<")
    );
    
    this.el.first('blockquote').insert([new Element('i'), new Element('u')], 'after');
    this.assertEqual(
      '<b></b><blockquote></blockquote><i></i><u></u><cite></cite><div></div><span></span>',
      this.el.innerHTML.toLowerCase().replace(/\s+</mg, "<")
    );
    
    this.el.first('b').insert('some string', 'instead');
    this.assertEqual(
      'some string<blockquote></blockquote><i></i><u></u><cite></cite><div></div><span></span>',
      this.el.innerHTML.toLowerCase().replace(/\s+</mg, "<")
    );
  },
  
  testInsertTable: function() {
    var el = $E('table').insert('<tr><td>test</td></tr>');
    this.assertEqual('<tbody><tr><td>test</td></tr></tbody>',
      el.innerHTML.toLowerCase().replace(/\s+</mg, "<")
    );
    
    el.first('tr').insert('<tr><td>another</td></tr>', 'after');
    this.assertEqual('<tbody><tr><td>test</td></tr><tr><td>another</td></tr></tbody>',
      el.innerHTML.toLowerCase().replace(/\s+</mg, "<")
    );
    
    el.first('tr').insert('<tr><td>more</td></tr>', 'before');
    this.assertEqual('<tbody><tr><td>more</td></tr><tr><td>test</td></tr><tr><td>another</td></tr></tbody>',
      el.innerHTML.toLowerCase().replace(/\s+</mg, "<")
    );
  },
  
  testInsertOptions: function() {
    var el = $E('select').insert('<option>test</option>');
    this.assertEqual('<option>test</option>',
      el.innerHTML.toLowerCase().replace(/\s+</mg, "<").replace(' selected', '') // <- IE fix
    )
  },
  
  testInsertTo: function() {
    var div = document.createElement('div');
    
    this.el.innerHTML = 'element';
    
    this.assertSame(this.el, this.el.insertTo(div));
    
    this.assertEqual([this.el], $A(div.childNodes));
    
  },
  
  testReplace: function() {
    this.el.innerHTML = '<b></b><div></div><span></span>';
    this.el.first('div').replace('<ul></ul><ul></ul><script>self["____test"]=4;</script>');
    
    this.assertEqual('<b></b><ul></ul><ul></ul><span></span>', this.el.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    this.assertEqual(4, self['____test']);
    self['____test'] = null;
    
    this.assertSame(this.el.first('ul'), this.el.first('ul').replace(document.createElement('cite')));
    this.assertEqual('<b></b><cite></cite><ul></ul><span></span>', this.el.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    
    this.el.first('span').replace([$E('div'), $E('u')]);
    this.assertEqual('<b></b><cite></cite><ul></ul><div></div><u></u>', this.el.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    
    this.el.first('div').replace('div string');
    this.assertEqual('<b></b><cite></cite><ul></ul>div string<u></u>', this.el.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
  },
  
  testUpdate: function() {
    this.el.update('<div></div><script>self["____test"] = 8;</script>');
    this.assertEqual('<div></div>', this.el.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    this.assertEqual(8, self['____test']);
    self['____test'] = null;
    
    this.assertSame(this.el, this.el.update(document.createElement('span')));
    this.assertEqual('<span></span>', this.el.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
    
    this.el.update([$E('i'), $E('b'), $E('u')]);
    this.assertEqual('<i></i><b></b><u></u>', this.el.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
  },
  
  testWrap: function() {
    var p = document.createElement('p');
    var div = document.createElement('div');
    
    div.appendChild(this.el)
    this.assertSame(this.el, this.el.wrap(p));
    
    this.assertEqual('<p><div></div></p>', div.innerHTML.toLowerCase().replace(/\s+</mg, "<"));
  },
  
  testClean: function() {
    this.el.innerHTML = 'asdfasdf <b>asdfsdf</b> <div>asdfasdf</div>';
    
    this.assertSame(this.el, this.el.clean());
    this.assertEqual('', this.el.innerHTML); //.toLowerCase().replace(/\s+</mg, "<"));
  },
  
  testEmpty: function() {
    this.el.innerHTML = "     \n\n\n  ";
    this.assert(this.el.empty());
    
    this.el.innerHTML = "<div></div>";
    this.assertFalse(this.el.empty());
    
    this.el.innerHTML = 'asdf';
    this.assertFalse(this.el.empty());
  }
});