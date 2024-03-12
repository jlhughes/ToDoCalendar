foam.RELATIONSHIP({
  sourceModel: 'hughes.journal.Event',
  targetModel: 'hughes.journal.Event',
  forwardName: 'children',
  inverseName: 'parent',
  cardinality: '1:*',
  // sourceProperty: {
  //   section: 'parentInformation'
  // },
  targetProperty: {
  //   section: 'parentInformation',
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
