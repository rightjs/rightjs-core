/**
 * The Element unit common methods module test-case
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var SelectorTest = TestCase.create({
  name: "SelectorTest",
  
  beforeAll: function() {
    this.container = $E('div').insertTo(document.body);
  },
  
  afterAll: function() {
    this.container.remove();
  },
  
  assertSelect: function(css_rule, block, elements, message) {
    var selected = $(block).select(css_rule).map('_');
    if (!this.util.equal(selected, elements)) {
      this.throw_unexp(elements, selected, message || "Trying '"+css_rule+"'");
    }
  },
  
  assertNotSelect: function(css_rule, block, elements, message) {
    var selected = $(block).select(css_rule).map('_');
    elements.each(function(element) {
      if (selected.includes(element)) {
        this.throw_problem('It should not select the element: '+this.util.to_s(element), message);
      }
    }, this);
  },
  
  assertFirst: function(css_rule, block, element, message) {
    var first = $(block).first(css_rule)._;
    if (first != element) {
      this.throw_unexp(element, first, message || "Trying first '"+css_rule+"'");
    }
  },
  
  assertMatchRule: function(css_rule, elementst, message) {
    var elements = elementst instanceof Array ? elementst : [elementst];
    elements.each(function(element) {
      if (!$(element).match(css_rule)) {
        this.throw_problem("Element should match the rule '"+css_rule+"'", message);
      }
    }, this);
  },
  
  assertNotMatchRule: function(css_rule, elementst, message) {
    var elements = elementst instanceof Array ? elementst : [elementst];
    elements.each(function(element) {
      if ($(element).match(css_rule)) {
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
    
    el1.className = 'el1';
    el12.className = 'el12';
    el121.className = 'el121';
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
    this.assertSelect('div > *',      block, block.querySelector ? [el11, el12, el121, el13] : [el11, el12, el13, el121]);
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
    
    // manual selector has problems with the select results order for the case
    //this.assertSelect('div + *',      block, [el13, el2]);
    //this.assertSelect('div ~ *',      block, [el13, el2]);
    //this.assertFirst('div + *',       block, el13);
    //this.assertFirst('div ~ *',       block, el13);
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
    this.container.insert(block);
    
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
     
    this.assertMatchRule('div#test-block', [block]);
    this.assertMatchRule('div#test-block *', [el1, el2, el11, el12, el13, el121]);
    this.assertMatchRule('div#test-block div > div', [el12, el121]);
    this.assertMatchRule('div#test-block input, div#test-block h1', [el11, el13]);
  },
  
  testIdMatch: function() {
    var element = $E('div', {id: 'some'}).insertTo(this.container);
    
    this.assertMatchRule('#some', element);
    this.assertNotMatchRule('#other', element);
  },
  
  testTagMatch: function() {
    var element = $E('div').insertTo(this.container);
    
    this.assertMatchRule('div', element);
    this.assertMatchRule('*', element);
    this.assertNotMatchRule('span', element);
  },
  
  testClassMatch: function() {
    var element = $E('div', {'class': 'boo foo'}).insertTo(this.container);
    
    this.assertMatchRule('.boo', element);
    this.assertMatchRule('.foo', element);
    this.assertMatchRule('.boo.foo', element);
    
    this.assertNotMatchRule('.zoo', element);
    this.assertNotMatchRule('.zoo.foo', element);
    this.assertNotMatchRule('.zoo.boo', element);
    this.assertNotMatchRule('.zoo.foo.boo', element);
  },
  
  testAttrsMatch: function() {
    var element = $E('input', {
      title: 'title',
      name:  'name'
    }).insertTo(this.container);
    
    this.assertMatchRule('input[title="title"]', element);
    this.assertMatchRule('input[name="name"]', element);
    this.assertMatchRule('input[title="title"][name="name"]', element);
    
    this.assertNotMatchRule('input[title="another"]', element);
    this.assertNotMatchRule('input[title="title"][value="something"]', element);
    this.assertNotMatchRule('input[name="name"][value="something"]', element);
    
    element._.title = 'somevalue';
    
    this.assertMatchRule('input[title*="some"]', element);
    this.assertMatchRule('input[title*="value"]', element);
    this.assertNotMatchRule('input[title*="another"]', element);
    
    this.assertMatchRule('input[title^="some"]', element);
    this.assertNotMatchRule('input[title^="value"]', element);
    
    this.assertMatchRule('input[title$="value"]', element);
    this.assertNotMatchRule('input[title$="some"]', element);
        
    this.assertNotMatchRule('input[title~="some"]', element);
    element._.title = "some value";
    if (!Browser.Opera) {
      this.assertMatchRule('input[title~="some"]', element);
      this.assertMatchRule('input[title~="value"]', element);
    }
    
    element._.setAttribute('lang', "en-EN");
    this.assertMatchRule('input[lang|="en"]', element);
    this.assertNotMatchRule('input[lang|="ru"]', element);
  },
  
  testPseudoMatch: function() {
    if (!Browser.OLD && Browser.IE) return; // IE8 has problems with the native selectors
    
    var div = $E('div').insertTo(this.container);
    
    this.assertMatchRule('*:empty', div);
    div._.innerHTML = 'something';
    this.assertNotMatchRule('*:empty', div);
    
    var element = $E('input', {type: 'checkbox'});
    div.insert(element);
    
    this.assertNotMatchRule('input:checked', element);
    element._.checked = true;
    if (!Browser.Opera && !Browser.OLD) // opera doesn't get it somehow
      this.assertMatchRule('input:checked', element);
    
    this.assertNotMatchRule('input:disabled', element);
    element._.disabled = true;
    if (!Browser.Opera) // opera doesn't get it somehow
      this.assertMatchRule('input:disabled', element);
    
    this.assertMatchRule('*:only-child', element);
    
    var element2 = document.createElement('input');
    div.insert(element2);
    
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
    div.insert(element3);
    
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
        
    // testing pseudo selectors with types
    var element4 = document.createElement('div');
    div.insert(element4);
    
    this.assertMatchRule('*:first-of-type', element);
    this.assertMatchRule('*:first-of-type', element3);
    this.assertNotMatchRule('*:first-of-type', element2);
    this.assertNotMatchRule('*:first-of-type', element4);
    
    this.assertMatchRule('*:last-of-type', element2);
    this.assertMatchRule('*:last-of-type', element4);
    this.assertNotMatchRule('*:last-of-type', element);
    this.assertNotMatchRule('*:last-of-type', element3);
    
    var element5 = document.createElement('textarea');
    div.insert(element5);
    
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