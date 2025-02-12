foam.CLASS({
  package: 'hughes.ledger',
  name: 'AccountBalanceSink',
  extends: 'foam.dao.AbstractSink',

  javaImports: [
    'foam.lang.X',
    'foam.dao.DAO',
    'foam.dao.Sink',
    'static foam.mlang.MLang.EQ'
  ],

  properties: [
    {
      name: 'total',
      class: 'Long'
    }
  ],

  methods: [
    {
      name: 'put',
      javaCode: `
      Account account = (Account) obj;
      setTotal(getTotal() + account.findBalance(getX()));
      ((DAO) getX().get("accountDAO")).where(EQ(Account.PARENT, account.getId())).select(this);
      `
    }
  ]
});
