foam.RELATIONSHIP({
  sourceModel: 'hughes.journal.Event',
  targetModel: 'hughes.journal.Event',
  forwardName: 'children',
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
