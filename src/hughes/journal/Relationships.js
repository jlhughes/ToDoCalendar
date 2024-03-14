foam.RELATIONSHIP({
  sourceModel: 'hughes.journal.Event',
  targetModel: 'hughes.journal.Event',
  forwardName: 'children',
  inverseName: 'parent',
  cardinality: '1:*',
  targetProperty: {
    label: 'Parent',
    view: { class: 'foam.u2.view.ReferenceView', placeholder: '--' }
  }
});

foam.RELATIONSHIP({
  sourceModel: 'hughes.journal.Asset',
  targetModel: 'hughes.journal.Event',
  forwardName: 'events',
  inverseName: 'asset'
});
