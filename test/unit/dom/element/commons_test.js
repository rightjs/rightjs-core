var ElementCommonsTest = TestCase.create({
  name: 'ElementCommonsTest',
  
  setUp: function() {
    this.el = new Element('div');
  },
  
  testSetSimple: function() {
    this.assertSame(this.el, this.el.set('id', 'some-id'));
    this.assertEqual('some-id', this.el.id);
  },
  
  testSetHash: function() {
    this.assertSame(this.el, this.el.set({
      id: 'another-id',
      className: 'foo bar'
    }));
    
    this.assertEqual('another-id', this.el.id);
    this.assertEqual('foo bar', this.el.className);
  },
  
  testGet: function() {
    this.el.id = 'something';
    this.assertEqual(this.el.id, this.el.get('id'));
  }
})