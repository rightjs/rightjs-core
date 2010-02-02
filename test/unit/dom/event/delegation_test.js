/**
 * The basic events delegation module tests
 *
 * Copyright (C) 2010 Nikolay V. Nemshilov
 */
var EventDelegationTest = TestCase.create({
  name: 'EventDelegationTest',
  
  setUp: function() {
    var node1 = this.node1 = {
      method: function() {
        this.args = $A(arguments);
      }
    };
    
    var node2 = this.node2 = {
      method: function() {
        this.args = $A(arguments);
      }
    };
    
    this.base = {
      select: function(rule) {
        return rule == 'node1' ? [node1] : [node2];
      }
    };
  },
  
  testDelegationByFunction: function() {
    var delegation = Event.delegate({
      node1: function() { this.value = 1; },
      node2: function() { this.value = 2; }
    });
    
    this.assertInstanceOf(Function, delegation);
    
    delegation.call(this.base, { target: this.node1 });
    
    this.assertEqual(1, this.node1.value);
    this.assertSame(undefined, this.node2.value);
    
    delete(this.node1.value);
    
    delegation.call(this.base, { target: this.node2 });
    
    this.assertSame(undefined, this.node1.value);
    this.assertEqual(2, this.node2.value);
  },
  
  testDelegationByName: function() {
    var delegation = Event.delegate({
      node1: 'method',
      node2: 'method'
    });
    
    delegation.call(this.base, { target: this.node1 });
    
    this.assertEqual([], this.node1.args);
    this.assertSame(undefined, this.node2.args);
    
    delete(this.node1.args);
    
    delegation.call(this.base, { target: this.node2 });
    
    this.assertSame(undefined, this.node1.args);
    this.assertEqual([], this.node2.args);
  },
  
  testDelegationByNameWithArgs: function() {
    var delegation = Event.delegate({
      node1: ['method', 'arg1', 'arg2', 'arg3'],
      node2: ['method', 'arg4', 'arg5', 'arg6']
    });
    
    delegation.call(this.base, { target: this.node1 });
    
    this.assertEqual(['arg1', 'arg2', 'arg3'], this.node1.args);
    this.assertSame(undefined, this.node2.args);
    
    delete(this.node1.args);
    
    delegation.call(this.base, { target: this.node2 });
    
    this.assertSame(undefined, this.node1.args);
    this.assertEqual(['arg4', 'arg5', 'arg6'], this.node2.args);
  },
  
  testDocumentAttachment: function() {
    var f = function() {}, c = function() {}, args;
    
    this.mock(Event, 'delegate', function() { args = $A(arguments); return f; });
    
    ".some.css.rule".behave('click', c);
    
    this.assert(document.observes('click', f));
    this.assertEqual([{'.some.css.rule': [c]}], args);
    
    ".some.css.rule".behave('mouseover', 'hide');
    
    this.assert(document.observes('mouseover', f));
    this.assertEqual([{'.some.css.rule': ['hide']}], args);
    
    ".some.css.rule".behave('mouseout', 'addClass', 'some-class');
    
    this.assert(document.observes('mouseover', f));
    this.assertEqual([{'.some.css.rule': ['addClass', 'some-class']}], args);
    
    document
      .stopObserving('click', f)
      .stopObserving('mouseout', f)
      .stopObserving('mouseover', f)
    
    this.undoMock(Event, 'delegate');
  },
  
  testDocumentAttachmentWithHash: function() {
    var f = function() {}, c = function() {}, args = [];
    
    this.mock(Event, 'delegate', function() { args.push($A(arguments)); return f; });
    
    ".some.css.rule".behave({
      click: c,
      mouseout: 'hide',
      mouseover: ['addClass', 'some-class']
    });
    
    this.assert(document.observes('click', f));
    this.assertEqual([{'.some.css.rule': c}], args[0]);
    
    this.assert(document.observes('mouseover', f));
    this.assertEqual([{'.some.css.rule': 'hide'}], args[1]);
    
    this.assert(document.observes('mouseover', f));
    this.assertEqual([{'.some.css.rule': ['addClass', 'some-class']}], args[2]);
    
    document
      .stopObserving('click', f)
      .stopObserving('mouseout', f)
      .stopObserving('mouseover', f)
    
    this.undoMock(Event, 'delegate');
  }
  
});