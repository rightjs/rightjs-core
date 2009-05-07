/**
 * The Element unit common methods module test-case
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var SelectorTest = TestCase.create({
  name: "SelectorTest",
  
  testInstance: function() {
    var selector = new Selector('div');
    this.assertInstanceOf(Selector, selector);
    this.assertEqual('div', selector.cssRule);
    
    var selector = new Selector('div, span');
    this.assertInstanceOf(Selector, selector);
    this.assertEqual('div, span', selector.cssRule);
  },
  
  assertSelect: function(css_rule, block, elements, message) {
    var selected = new Selector(css_rule).select(block);
    
    if (!this.util.equal(selected, elements)) {
      this.throw_unexp(elements, selected, message || "Trying '"+css_rule+"'");
    }
  },
  
  assertNotSelect: function(css_rule, block, elements, message) {
    var selected = new Selector(css_rule).select(block);
    elements.each(function(element) {
      if (selected.includes(element)) {
        this.throw_problem('It should not select the element: '+this.util.to_s(element), message);
      }
    }, this);
  },
  
  assertFirst: function(css_rule, block, element, message) {
    var first = new Selector(css_rule).first(block);
    if (first != element) {
      this.throw_unexp(element, first, message || "Trying first '"+css_rule+"'");
    }
  },
  
  assertMatchRule: function(css_rule, elements, message) {
    var selector = new Selector(css_rule);
    var elements = elements instanceof Array ? elements : [elements];
    elements.each(function(element) {
      if (!selector.match(element)) {
        this.throw_problem("Element should match the rule '"+css_rule+"'", message);
      }
    }, this);
  },
  
  assertNotMatchRule: function(css_rule, elements, message) {
    var selector = new Selector(css_rule);
    var elements = elements instanceof Array ? elements : [elements];
    elements.each(function(element) {
      if (selector.match(element)) {
        this.throw_problem("Element should not match the rule '"+css_rule+"'", message);
      }
    }, this);
  },
  
  testSearch: function() {
    var block = document.createElement('div');
    var el1   = document.createElement('div');
    var el11  = document.createElement('input');
    var el12  = document.createElement('div');
    var el121 = document.createElement('div');
    var el13  = document.createElement('h1');
    var el2   = document.createElement('table');
    
    block.appendChild(el1);
    block.appendChild(el2);
    el1.appendChild(el11);
    el1.appendChild(el12);
    el1.appendChild(el13);
    el12.appendChild(el121);
    
    /**
    
    <div>
      <div> el1
        <input /> el11
        <div> el12
          <div></div> el121
        </div>
        <h1></h1> el13
      </div>
      <table></table> el2
    </div>
    
     */
    
    // seome simple selections
    this.assertSelect('*',            block, [el1, el11, el12, el121, el13, el2]);
    this.assertSelect('div',          block, [el1, el12, el121]);
    this.assertSelect('input',        block, [el11]);
    this.assertSelect('input, table', block, [el11, el2]);
    
    // trying nested selections
    this.assertSelect('div *',        block, [el11, el12, el121, el13]);
    this.assertSelect('div input',    block, [el11]);
    this.assertSelect('div div',      block, [el12, el121]);
    
    // trying immidiate descendants
    this.assertSelect('div > *',      block, [el11, el12, el121, el13]);
    this.assertSelect('div > input',  block, [el11]);
    this.assertSelect('div > div',    block, [el12, el121]);
    
    // trying immidiate siblings
    this.assertSelect('div + table',  block, [el2]);
    this.assertSelect('input + *',    block, [el12]);
    
    // trying late siblings
    this.assertSelect('input ~ *',    block, [el12, el13]);
    
    // checking the same for the 'first' request
    this.assertFirst('*',             block, el1);
    this.assertFirst('div',           block, el1);
    this.assertFirst('input',         block, el11);
    this.assertFirst('input, table',  block, el11);
    this.assertFirst('div *',         block, el11);
    this.assertFirst('div input',     block, el11);
    this.assertFirst('div div',       block, el12);
    this.assertFirst('div > *',       block, el11);
    this.assertFirst('div > input',   block, el11);
    this.assertFirst('div > div',     block, el12);
    this.assertFirst('div + table',   block, el2);
    this.assertFirst('input + *',     block, el12);
    
    this.assertFirst('input ~ *',     block, el12);
    
    this.assertSelect('div + *',      block, [el13, el2]);
    this.assertSelect('div ~ *',      block, [el13, el2]);
    this.assertFirst('div + *',       block, el13);
    this.assertFirst('div ~ *',       block, el13);
  },
  
  testMatch: function() {
    var block = document.createElement('div');
    var el1   = document.createElement('div');
    var el11  = document.createElement('input');
    var el12  = document.createElement('div');
    var el121 = document.createElement('div');
    var el13  = document.createElement('h1');
    var el2   = document.createElement('table');
    
    block.appendChild(el1);
    block.appendChild(el2);
    el1.appendChild(el11);
    el1.appendChild(el12);
    el1.appendChild(el13);
    el12.appendChild(el121);
    
    block.id = 'test-block';
    document.body.appendChild(block);
    
    /**
    
    <div id="test-block">
      <div> el1
        <input /> el11
        <div> el12
          <div></div> el121
        </div>
        <h1></h1> el13
      </div>
      <table></table> el2
    </div>
    
     */
     
    try {
      this.assertMatchRule('div#test-block', [block]);
      this.assertMatchRule('div#test-block *', [el1, el2, el11, el12, el13, el121]);
      this.assertMatchRule('div#test-block div > div', [el12, el121]);
      this.assertMatchRule('div#test-block input, div#test-block h1', [el11, el13]);
      
    } finally {
      document.body.removeChild(block);
    }
  },
  
  testIdMatch: function() {
    var element = document.createElement('div');
    element.id = 'some';
    
    this.assertMatchRule('#some', element);
    this.assertNotMatchRule('#other', element);
  },
  
  testTagMatch: function() {
    var element = document.createElement('div');
    
    this.assertMatchRule('div', element);
    this.assertMatchRule('*', element);
    this.assertNotMatchRule('span', element);
  },
  
  testClassMatch: function() {
    var element = document.createElement('div');
    element.className = 'boo foo';
    
    this.assertMatchRule('.boo', element);
    this.assertMatchRule('.foo', element);
    this.assertMatchRule('.boo.foo', element);
    
    this.assertNotMatchRule('.zoo', element);
    this.assertNotMatchRule('.zoo.foo', element);
    this.assertNotMatchRule('.zoo.boo', element);
    this.assertNotMatchRule('.zoo.foo.boo', element);
  },
  
  testAttrsMatch: function() {
    var element = document.createElement('input');
    element.title = 'title';
    element.name  = 'name';
    
    this.assertMatchRule('input[title="title"]', element);
    this.assertMatchRule('input[name="name"]', element);
    this.assertMatchRule('input[title="title"][name="name"]', element);
    
    this.assertNotMatchRule('input[title="another"]', element);
    this.assertNotMatchRule('input[title="title"][value="something"]', element);
    this.assertNotMatchRule('input[name="name"][value="something"]', element);
    
    element.title = 'somevalue';
    
    this.assertMatchRule('input[title*="some"]', element);
    this.assertMatchRule('input[title*="value"]', element);
    this.assertNotMatchRule('input[title*="another"]', element);
    
    this.assertMatchRule('input[title^="some"]', element);
    this.assertNotMatchRule('input[title^="value"]', element);
    
    this.assertMatchRule('input[title$="value"]', element);
    this.assertNotMatchRule('input[title$="some"]', element);
    
    // FIXME WebKit seems to be has some problems with the case
    if (navigator.userAgent.indexOf('WebKit') == -1) {
      this.assertMatchRule('input[title!="another"]', element);
      this.assertNotMatchRule('input[title!="somevalue"]', element);
    }
    
    this.assertNotMatchRule('input[title~="some"]', element);
    element.title = "some value";
    this.assertMatchRule('input[title~="some"]', element);
    this.assertMatchRule('input[title~="value"]', element);
    
    this.assertNotMatchRule('input[title|="some"]', element);
    element.title = "some-value";
    this.assertMatchRule('input[title|="some"]', element);
    // FIXME WebKit seems to be has some problems with the case
    if (navigator.userAgent.indexOf('WebKit') == -1) {
      this.assertMatchRule('input[title|="value"]', element);
    }
  },
  
  testPseudoMatch: function() {
    var element = document.createElement('input');
    element.type = 'checkbox';
    
    this.assertNotMatchRule('input:checked', element);
    element.checked = true;
    this.assertMatchRule('input:checked', element);
    
    this.assertNotMatchRule('input:disabled', element);
    element.disabled = true;
    this.assertMatchRule('input:disabled', element);
    
    this.assertMatchRule('input:not(*.class)', element);
    element.className = 'class';
    this.assertNotMatchRule('input:not(*.class)', element);
    
    var div = document.createElement('div');
    this.assertMatchRule('*:empty', div);
    div.innerHTML = 'something';
    this.assertNotMatchRule('*:empty', div);
    
    // FIXME WebKit seems to be has some problems with the case
    if (navigator.userAgent.indexOf('WebKit') == -1) {
      this.assertMatchRule('*:contains(some)', div);
      this.assertNotMatchRule('*:contains(another)', div);
    }
    
    var element2 = document.createElement('input');
    div.appendChild(element);
    
    this.assertMatchRule('*:only-child', element);
    this.assertMatchRule('*:only-child', element2);
    
    div.appendChild(element2);
    
    this.assertNotMatchRule('*:only-child', element);
    this.assertNotMatchRule('*:only-child', element2);
    
    this.assertMatchRule('*:first-child', element);
    this.assertNotMatchRule('*:first-child', element2);
    
    this.assertMatchRule('*:last-child', element2);
    this.assertNotMatchRule('*:last-child', element);
    
    this.assertMatchRule('*:nth-child(1)', element);
    this.assertMatchRule('*:nth-child(2)', element2);
    
    this.assertNotMatchRule('*:nth-child(1)', element2);
    this.assertNotMatchRule('*:nth-child(2)', element);
    
    var element3 = document.createElement('div');
    div.appendChild(element3);
    
    // trying some 'n' pseudo variations
    this.assertMatchRule('*:nth-child(n)', element);
    this.assertMatchRule('*:nth-child(n)', element2);
    this.assertMatchRule('*:nth-child(n)', element3);
    
    this.assertNotMatchRule('*:nth-child(2n)', element);
    this.assertMatchRule('*:nth-child(2n)', element2);
    this.assertNotMatchRule('*:nth-child(2n)', element3);
    
    this.assertMatchRule('*:nth-child(2n+1)', element);
    this.assertNotMatchRule('*:nth-child(2n+1)', element2);
    this.assertMatchRule('*:nth-child(2n+1)', element3);
    
    this.assertNotMatchRule('*:nth-child(3n)', element);
    this.assertNotMatchRule('*:nth-child(3n)', element2);
    this.assertMatchRule('*:nth-child(3n)', element3);
    
    this.assertMatchRule('*:nth-child(3n+1)', element);
    this.assertNotMatchRule('*:nth-child(3n+1)', element2);
    this.assertNotMatchRule('*:nth-child(3n+1)', element3);
    
    this.assertNotMatchRule('*:nth-child(3n+2)', element);
    this.assertMatchRule('*:nth-child(3n+2)', element2);
    this.assertNotMatchRule('*:nth-child(3n+2)', element3);
    
    // trying negative values
    this.assertMatchRule('*:nth-child(-n+1)', element);
    this.assertNotMatchRule('*:nth-child(-n+1)', element2);
    this.assertNotMatchRule('*:nth-child(-n+1)', element3);
    
    this.assertMatchRule('*:nth-child(-n+2)', element);
    this.assertMatchRule('*:nth-child(-n+2)', element2);
    this.assertNotMatchRule('*:nth-child(-n+2)', element3);
    
    this.assertMatchRule('*:nth-child(-n+3)', element);
    this.assertMatchRule('*:nth-child(-n+3)', element2);
    this.assertMatchRule('*:nth-child(-n+3)', element3);
    
    this.assertNotMatchRule('*:nth-child(3n-1)', element);
    this.assertMatchRule('*:nth-child(3n-1)', element2);
    this.assertNotMatchRule('*:nth-child(3n-1)', element3);
    
    // trying the virtual pseudos
    this.assertMatchRule('*:index(0)', element);
    this.assertMatchRule('*:index(1)', element2);
    this.assertMatchRule('*:index(2)', element3);
    
    this.assertMatchRule('*:nth-child(odd)', element);
    this.assertNotMatchRule('*:nth-child(odd)', element2);
    this.assertMatchRule('*:nth-child(odd)', element3);
    
    this.assertNotMatchRule('*:nth-child(even)', element);
    this.assertMatchRule('*:nth-child(even)', element2);
    this.assertNotMatchRule('*:nth-child(even)', element3);
    
    this.assertMatchRule('*:odd', element);
    this.assertNotMatchRule('*:odd', element2);
    this.assertMatchRule('*:odd', element3);
    
    this.assertNotMatchRule('*:even', element);
    this.assertMatchRule('*:even', element2);
    this.assertNotMatchRule('*:even', element3);
    
    // testing pseudo selectors with types
    var element4 = document.createElement('div');
    div.appendChild(element4);
    
    this.assertMatchRule('*:first-of-type', element);
    this.assertMatchRule('*:first-of-type', element3);
    this.assertNotMatchRule('*:first-of-type', element2);
    this.assertNotMatchRule('*:first-of-type', element4);
    
    this.assertMatchRule('*:last-of-type', element2);
    this.assertMatchRule('*:last-of-type', element4);
    this.assertNotMatchRule('*:last-of-type', element);
    this.assertNotMatchRule('*:last-of-type', element3);
    
    var element5 = document.createElement('textarea');
    div.appendChild(element5);
    
    this.assertMatchRule('*:only-of-type', element5);
    this.assertNotMatchRule('*:only-of-type', element);
    this.assertNotMatchRule('*:only-of-type', element2);
    this.assertNotMatchRule('*:only-of-type', element3);
    this.assertNotMatchRule('*:only-of-type', element4);
    
    this.assertMatchRule('*:nth-of-type(1)', element);
    this.assertMatchRule('*:nth-of-type(2)', element2);
    this.assertMatchRule('*:nth-of-type(1)', element3);
    this.assertMatchRule('*:nth-of-type(2)', element4);
    
    this.assertNotMatchRule('*:nth-of-type(2)', element);
    this.assertNotMatchRule('*:nth-of-type(1)', element2);
    this.assertNotMatchRule('*:nth-of-type(2)', element3);
    this.assertNotMatchRule('*:nth-of-type(1)', element4);
  }
});