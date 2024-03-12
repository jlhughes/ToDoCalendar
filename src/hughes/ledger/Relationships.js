foam.RELATIONSHIP({
  sourceModel: 'foam.nanos.auth.User',
  targetModel: 'hughes.ledger.Account',
  forwardName: 'accounts',
  inverseName: 'owner',
  cardinality: '1:*',
  sourceDAOKey: 'userDAO',
  targetDAOKey: 'accountDAO'
});

foam.RELATIONSHIP({
  sourceModel: 'hughes.ledger.Account',
  targetModel: 'hughes.ledger.Account',
  forwardName: 'children',
  inverseName: 'parent',
  cardinality: '1:*'
});
