var SelectorManualTest = TestCase.create({
  name: 'SelectorManualTest',

  testAtomsParsing: function() {
    var selector = new Selector.Manual('div span > table + input ~ textarea');
    this.assertEqual(5, selector.atoms.length);
    
    this.assertEqual(' ', selector.atoms[0].rel);
    this.assertEqual('DIV', selector.atoms[0].tag);
    
    this.assertEqual(' ', selector.atoms[1].rel);
    this.assertEqual('SPAN', selector.atoms[1].tag);
    
    this.assertEqual('>', selector.atoms[2].rel);
    this.assertEqual('TABLE', selector.atoms[2].tag);
    
    this.assertEqual('+', selector.atoms[3].rel);
    this.assertEqual('INPUT', selector.atoms[3].tag);
    
    this.assertEqual('~', selector.atoms[4].rel);
    this.assertEqual('TEXTAREA', selector.atoms[4].tag);
  },

  assertSelect: function(css_rule, block, elements, message) {
    var selected = new Selector(css_rule).select(block);
    if (!this.util.equal(selected, elements)) {
      this.throw_unexp(elements, selected, message || "Trying '"+css_rule+"'");
    }
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
    
    // trying immidiate descendants
    this.assertSelect('div > *',      block, [el11, el12, el121, el13]);
    //this.assertSelect('div + *',      block, [el13, el2]);
  }
});