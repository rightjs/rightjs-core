SelectorMultipleTest = TestCase.create({
  name: 'SelectorMultipleTest',
  /*
  testInstance: function() {
    var selector = new Selector.Multiple('a, div, span');
    this.assertEqual(3, selector.selectors.length);
    this.assertEqual('a', selector.selectors[0].cssRule);
    this.assertEqual('div', selector.selectors[1].cssRule);
    this.assertEqual('span', selector.selectors[2].cssRule);
  },
  */
  testMethods: function() {
    var div = document.createElement('div');
    var span1 = document.createElement('span');
    var span2 = document.createElement('span');
    
    div.appendChild(span1);
    div.appendChild(span2);
    
    var selector = new Selector.Multiple('a, table, span');
    
    //this.assertSame(span1, selector.first(div));
    this.assertEqual([span1, span2], selector.select(div));
    this.assert(selector.match(span1));
    this.assert(selector.match(span2));
  }
})