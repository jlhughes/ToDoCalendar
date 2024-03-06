foam.RELATIONSHIP({
  sourceModel: 'foam.nanos.auth.User',
  targetModel: 'hughes.account.Account',
  forwardName: 'accounts',
  inverseName: 'owner',
  cardinality: '1:*',
  sourceDAOKey: 'userDAO',
  targetDAOKey: 'accountDAO'
});
