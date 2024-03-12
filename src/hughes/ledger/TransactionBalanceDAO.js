foam.CLASS({
  package: 'hughes.ledger',
  name: 'TransactionBalanceDAO',
  extends: 'foam.dao.ProxyDAO',

  documentation: 'Manipulates account balance',

  javaImports: [
    'foam.dao.DAO',
    'foam.nanos.logger.Loggers',
    'hughes.ledger.Account'
  ],

  methods: [
    {
      name: 'put_',
      javaCode: `
      Transaction txn = (Transaction) getDelegate().put_(x, obj);
      Account account = (Account) ((DAO) x.get("accountDAO")).find_(x, txn.getAccount());
      if ( account != null ) {
        account.updateBalance(x, txn.getAmount(), txn.getDirection());
      } else {
        Loggers.logger(x, this).error("Account not found", txn.getAccount());
      }
      return txn;
      `
    },
    {
      name: 'remove_',
      javaCode: `
      Transaction txn = (Transaction) getDelegate().find_(x, obj);
      Account account = (Account) ((DAO) x.get("accountDAO")).find_(x, txn.getAccount());
      if ( account != null ) {
        account.updateBalance(x, -1 * txn.getAmount(), txn.getDirection());
      } else {
        Loggers.logger(x, this).error("Account not found", txn.getAccount());
      }
      return getDelegate().remove_(x, obj);
      `
    }
  ]
})
