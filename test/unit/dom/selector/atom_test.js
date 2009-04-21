var SelectorAtomTest = TestCase.create({
  name: 'SelectorAtomTest',
  
  atom: function(rule) {
    return new Selector.Atom(rule);
  },
  
  // custom shortcut assertions for the atoms matching
  assertMatchAtom: function(atom, element, message) {
    if (!this.atom(atom).match(element)) {
      this.throw_problem("Element doesn't match the atom: "+atom, message);
    }
  },
  
  assertNotMatchAtom: function(atom, element, message) {
    if (this.atom(atom).match(element)) {
      this.throw_problem("Element should not match the atom: "+atom, message);
    }
  },
  
  testIdRecognition: function() {
    ['', '.asdf', 'div.adf', 'div:sdfdsf', '*'].each(function(rule) {
      this.assertNull(this.atom(rule).id, "Checking '"+rule+"'");
    }, this);
    
    ['#id', 'div#id', 'div.class#id', 'div#id.class', 'div#id:last-child'].each(function(rule) {
      this.assertEqual('id', this.atom(rule).id, "Checking '"+rule+"'");
    }, this);
    
    this.assertEqual('id-this_4', this.atom('#id-this_4').id);
  },
  
  testTagRecognition: function() {
    ['', '.asdf', '#sdfsdf', '*.sdf', '*'].each(function(rule) {
      this.assertEqual('*', this.atom(rule).tag, "Checking '"+rule+"'");
    }, this);
    
    ['div', 'DIV', 'div.asdf', 'div#asdf', 'div[asdf=asdf]', 'div:last'].each(function(rule) {
      this.assertEqual('div', this.atom(rule).tag, "Checking '"+rule+"'");
    }, this);
    
    this.assertEqual('p', this.atom('  p ').tag);
    this.assertEqual('table', this.atom('table').tag);
  },
  
  testClassesRecognition: function() {
    ['', 'div#id', 'div:last', 'div[some="value"]'].each(function(rule) {
      this.assertEqual([], this.atom(rule).classes, "Checking '"+rule+"'");
    }, this);
    
    ['div.class', '.class', '*.class', 'div#id.class', 'div[some="value"].class:hover'].each(function(rule) {
      this.assertEqual(['class'], this.atom(rule).classes, "Checking '"+rule+"'");
    }, this);
    
    this.assertEqual(['one', 'two', 'three'], this.atom('div.one.two.three').classes);
    this.assertEqual(['one-two_3'], this.atom('div.one-two_3').classes);
  },
  
  testAttrsRecognition: function() {
    this.assertEqual({some: {op: '=', value: 'value'}}, this.atom('div[some=value]').attrs);
    this.assertEqual({some: {op: '*=', value: 'value'}}, this.atom('div[some*="value"]').attrs);
    this.assertEqual({some: {op: '^=', value: 'value'}}, this.atom('div[some^="value"]').attrs);
    this.assertEqual({some: {op: '$=', value: 'value'}}, this.atom('div[some$=\'value\']').attrs);
    this.assertEqual({some: {op: '!=', value: 'value'}}, this.atom('div[some!=value]').attrs);
    this.assertEqual({some: {op: '~=', value: 'value'}}, this.atom('div[some~=value]').attrs);
    this.assertEqual({some: {op: '|=', value: 'value'}}, this.atom('div[some|=value]').attrs);
    
    this.assertEqual(
      {
        some:  {op: '=', value: "some"},
        other: {op: '=', value: "other"}
      },
      this.atom('div[some="some"][other="other"]').attrs
    )
  },
  
  testPseudoRecognition: function() {
    ['', 'div#id', 'div.class'].each(function(rule) {
      this.assertNull(this.atom(rule).pseudo, "Checking '"+rule+"'");
      this.assertNull(this.atom(rule).pseudoValue);
    }, this);
    
    ['*:last-child', 'div:last-child', 'div.class:last-child'].each(function(rule) {
      this.assertEqual('last-child', this.atom(rule).pseudo, "Checking '"+rule+"'");
      this.assertNull(this.atom(rule).pseudoValue);
    }, this);
    
    ['*:nth-child(2)', 'div.class:nth-child(2) '].each(function(rule) {
      this.assertEqual('nth-child', this.atom(rule).pseudo, "Checking '"+rule+"'");
      this.assertEqual('2', this.atom(rule).pseudoValue, "Checking '"+rule+"'");
    }, this);
  },
  
  testIdMatch: function() {
    var element = document.createElement('div');
    element.id = 'some';
    
    this.assertMatchAtom('#some', element);
    this.assertMatchAtom('div', element);
    this.assertNotMatchAtom('#other', element);
  },
  
  testTagMatch: function() {
    var element = document.createElement('div');
    
    this.assertMatchAtom('div', element);
    this.assertMatchAtom('*', element);
    this.assertNotMatchAtom('span', element);
  },
  
  testClassMatch: function() {
    var element = document.createElement('div');
    element.className = 'boo foo';
    
    this.assertMatchAtom('.boo', element);
    this.assertMatchAtom('.foo', element);
    this.assertMatchAtom('.boo.foo', element);
    
    this.assertNotMatchAtom('.zoo', element);
    this.assertNotMatchAtom('.zoo.foo', element);
    this.assertNotMatchAtom('.zoo.boo', element);
    this.assertNotMatchAtom('.zoo.foo.boo', element);
  },
  
  testAttrsMatch: function() {
    var element = document.createElement('input');
    element.title = 'title';
    element.name  = 'name';
    
    this.assertMatchAtom('input[title="title"]', element);
    this.assertMatchAtom('input[name="name"]', element);
    this.assertMatchAtom('input[title="title"][name="name"]', element);
    
    this.assertNotMatchAtom('input[title="another"]', element);
    this.assertNotMatchAtom('input[title="title"][value="something"]', element);
    this.assertNotMatchAtom('input[name="name"][value="something"]', element);
    
    element.value = 'somevalue';
    this.assertMatchAtom('input[value*="some"]', element);
    this.assertMatchAtom('input[value*="value"]', element);
    this.assertNotMatchAtom('input[value*="another"]', element);
    
    this.assertMatchAtom('input[value^="some"]', element);
    this.assertNotMatchAtom('input[value^="value"]', element);
    
    this.assertMatchAtom('input[value$="value"]', element);
    this.assertNotMatchAtom('input[value$="some"]', element);
    
    this.assertMatchAtom('input[value!="another"]', element);
    this.assertNotMatchAtom('input[value!="somevalue"]', element);
    
    this.assertNotMatchAtom('input[value~="some"]', element);
    element.value = "some value";
    this.assertMatchAtom('input[value~="some"]', element);
    this.assertMatchAtom('input[value~="value"]', element);
    
    this.assertNotMatchAtom('input[value|="some"]', element);
    element.value = "some-value";
    this.assertMatchAtom('input[value|="some"]', element);
    this.assertMatchAtom('input[value|="value"]', element);
  },
  
  testPseudoMatch: function() {
    var element = document.createElement('input');
    element.type = 'checkbox';
    
    this.assertNotMatchAtom('input:checked', element);
    element.checked = true;
    this.assertMatchAtom('input:checked', element);
    
    this.assertNotMatchAtom('input:disabled', element);
    element.disabled = true;
    this.assertMatchAtom('input:disabled', element);
    
    this.assertMatchAtom('input:not(*.class)', element);
    element.className = 'class';
    this.assertNotMatchAtom('input:not(*.class)', element);
    
    var div = document.createElement('div');
    this.assertMatchAtom('*:empty', div);
    div.innerHTML = 'something';
    this.assertNotMatchAtom('*:empty', div);
    
    this.assertMatchAtom('*:contains(some)', div);
    this.assertNotMatchAtom('*:contains(another)', div);
    
    var element2 = document.createElement('input');
    div.appendChild(element);
    
    this.assertMatchAtom('*:only-child', element);
    this.assertMatchAtom('*:only-child', element2);
    
    div.appendChild(element2);
    
    this.assertNotMatchAtom('*:only-child', element);
    this.assertNotMatchAtom('*:only-child', element2);
    
    this.assertMatchAtom('*:first-child', element);
    this.assertNotMatchAtom('*:first-child', element2);
    
    this.assertMatchAtom('*:last-child', element2);
    this.assertNotMatchAtom('*:last-child', element);
    
    this.assertMatchAtom('*:nth-child(1)', element);
    this.assertMatchAtom('*:nth-child(2)', element2);
    
    this.assertNotMatchAtom('*:nth-child(1)', element2);
    this.assertNotMatchAtom('*:nth-child(2)', element);
    
    var element3 = document.createElement('div');
    div.appendChild(element3);
    
    // trying some 'n' pseudo variations
    this.assertMatchAtom('*:nth-child(n)', element);
    this.assertMatchAtom('*:nth-child(n)', element2);
    this.assertMatchAtom('*:nth-child(n)', element3);
    
    this.assertNotMatchAtom('*:nth-child(2n)', element);
    this.assertMatchAtom('*:nth-child(2n)', element2);
    this.assertNotMatchAtom('*:nth-child(2n)', element3);
    
    this.assertMatchAtom('*:nth-child(2n+1)', element);
    this.assertNotMatchAtom('*:nth-child(2n+1)', element2);
    this.assertMatchAtom('*:nth-child(2n+1)', element3);
    
    this.assertNotMatchAtom('*:nth-child(3n)', element);
    this.assertNotMatchAtom('*:nth-child(3n)', element2);
    this.assertMatchAtom('*:nth-child(3n)', element3);
    
    this.assertMatchAtom('*:nth-child(3n+1)', element);
    this.assertNotMatchAtom('*:nth-child(3n+1)', element2);
    this.assertNotMatchAtom('*:nth-child(3n+1)', element3);
    
    this.assertNotMatchAtom('*:nth-child(3n+2)', element);
    this.assertMatchAtom('*:nth-child(3n+2)', element2);
    this.assertNotMatchAtom('*:nth-child(3n+2)', element3);
    
    // trying negative values
    this.assertMatchAtom('*:nth-child(-n+1)', element);
    this.assertNotMatchAtom('*:nth-child(-n+1)', element2);
    this.assertNotMatchAtom('*:nth-child(-n+1)', element3);
    
    this.assertMatchAtom('*:nth-child(-n+2)', element);
    this.assertMatchAtom('*:nth-child(-n+2)', element2);
    this.assertNotMatchAtom('*:nth-child(-n+2)', element3);
    
    this.assertMatchAtom('*:nth-child(-n+3)', element);
    this.assertMatchAtom('*:nth-child(-n+3)', element2);
    this.assertMatchAtom('*:nth-child(-n+3)', element3);
    
    this.assertNotMatchAtom('*:nth-child(3n-1)', element);
    this.assertMatchAtom('*:nth-child(3n-1)', element2);
    this.assertNotMatchAtom('*:nth-child(3n-1)', element3);
        
    // testing pseudo selectors with types
    var element4 = document.createElement('div');
    div.appendChild(element4);
    
    this.assertMatchAtom('*:first-of-type', element);
    this.assertMatchAtom('*:first-of-type', element3);
    this.assertNotMatchAtom('*:first-of-type', element2);
    this.assertNotMatchAtom('*:first-of-type', element4);
    
    this.assertMatchAtom('*:last-of-type', element2);
    this.assertMatchAtom('*:last-of-type', element4);
    this.assertNotMatchAtom('*:last-of-type', element);
    this.assertNotMatchAtom('*:last-of-type', element3);
    
    var element5 = document.createElement('textarea');
    div.appendChild(element5);
    
    this.assertMatchAtom('*:only-of-type', element5);
    this.assertNotMatchAtom('*:only-of-type', element);
    this.assertNotMatchAtom('*:only-of-type', element2);
    this.assertNotMatchAtom('*:only-of-type', element3);
    this.assertNotMatchAtom('*:only-of-type', element4);
    
    this.assertMatchAtom('*:nth-of-type(1)', element);
    this.assertMatchAtom('*:nth-of-type(2)', element2);
    this.assertMatchAtom('*:nth-of-type(1)', element3);
    this.assertMatchAtom('*:nth-of-type(2)', element4);
    
    this.assertNotMatchAtom('*:nth-of-type(2)', element);
    this.assertNotMatchAtom('*:nth-of-type(1)', element2);
    this.assertNotMatchAtom('*:nth-of-type(2)', element3);
    this.assertNotMatchAtom('*:nth-of-type(1)', element4);
  }
})