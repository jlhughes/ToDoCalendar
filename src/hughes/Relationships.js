foam.RELATIONSHIP({
  sourceModel: 'hughes.journal.Event',
  targetModel: 'hughes.ledger.Transaction',
  forwardName: 'transactions',
  inverseName: 'event',
  cardinality: '1:*'
});

// foam.RELATIONSHIP({
//   sourceModel: 'hughes.journal.Event',
//   targetModel: 'hughes.journal.Asset',
//   forwardName: 'assets',
//   inverseName: 'event'
// });
