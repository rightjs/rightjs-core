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
    this.assert(el['parent'], "checking if the element was extened");
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
    
    this.assertEqual([el1, el3], this.el.subNodes('div, span'), "getting the filtered parents list");
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
  
  testUp: function() {
    var el1 = document.createElement('div');
    var el2 = document.createElement('p');
    var el3 = document.createElement('span');
    
    el1.appendChild(this.el);
    el2.appendChild(el1);
    el3.appendChild(el2);
    
    this.assertEqual(el1, this.el.up());
    this.assert(el1['up']);
    
    this.assertEqual(el2, this.el.up('p'), "getting the filtered parents list");
  },
  
  testDown: function() {
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

    this.assertEqual(el1, this.el.down());
    this.assert(el1['down']);
    
    this.assertEqual(el2, this.el.down('p'), "getting the filtered parents list");
    this.assertEqual(el4, this.el.down('div.our-guy'));
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
    
    this.assertEqual([el1, el4, el2], this.el.select('div, p'));
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
  }
  
});