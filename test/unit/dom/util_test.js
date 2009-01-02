/**
 * DOM utils tests
 *
 *
 */
var DomUtilTest = TestCase.create({
  'name': 'DomUtilTest',
  
  test$Extending: function() {
    var el = document.createElement('div');
    
    this.assertSame(el, $(el));
    this.assertNotNull(el['hasClass'], "check if the object was prepared");
  },
  
  test$_Search: function() {
    var id = 'some-testing-div-id';
    var el = document.getElementById(id);
    if (el) {
      el.parentNode.removeChild(el);
    }
    var el = document.createElement('div');
    el.id = id;
    document.body.appendChild(el);
    
    this.assertSame(el, $(id));
    this.assertNotNull(el['hasClass']);
  }
})