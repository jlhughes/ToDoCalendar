foam.RELATIONSHIP({
  sourceModel: 'hughes.journal.Event',
  forwardName: 'children',
  targetModel: 'hughes.journal.Event',
  invserseName: 'parent',
  cardinality: '1:*',
  sourceProperty: {
    section: 'parentInformation'
  },
  targetProperty: {
    section: 'parentInformation',
    label: 'Parent',
    view: { class: 'foam.u2.view.ReferenceView', placeholder: '--' }
  }
});
