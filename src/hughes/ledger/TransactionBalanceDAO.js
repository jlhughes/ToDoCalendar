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
      synchronized: true,
      javaCode: `
      Transaction txn = (Transaction) getDelegate().put_(x, obj);
      Account debitAccount = (Account) ((DAO) x.get("accountDAO")).find_(x, txn.getDebitAccount());
      if ( debitAccount != null ) {
        debitAccount.updateBalance(getX(), txn.getAmount(), Direction.DEBIT);
      } else {
        Loggers.logger(x, this).error("DebitAccount not found", txn.getDebitAccount());
      }
      Account creditAccount = (Account) ((DAO) x.get("accountDAO")).find_(x, txn.getCreditAccount());
      if ( creditAccount != null ) {
        creditAccount.updateBalance(getX(), txn.getAmount(), Direction.CREDIT);
      } else {
        Loggers.logger(x, this).error("CreditAccount not found", txn.getCreditAccount());
      }
      return txn;
      `
    },
    {
      name: 'remove_',
      synchronized: true,
      javaCode: `
      Transaction txn = (Transaction) getDelegate().find_(x, obj);
      Account debitAccount = (Account) ((DAO) x.get("accountDAO")).find_(x, txn.getDebitAccount());
      if ( debitAccount != null ) {
        debitAccount.updateBalance(getX(), txn.getAmount(), Direction.CREDIT);
      } else {
        Loggers.logger(x, this).error("DebitAccount not found", txn.getDebitAccount());
      }
      Account creditAccount = (Account) ((DAO) x.get("accountDAO")).find_(x, txn.getCreditAccount());
      if ( creditAccount != null ) {
        creditAccount.updateBalance(getX(), txn.getAmount(), Direction.DEBIT);
      } else {
        Loggers.logger(x, this).error("CreditAccount not found", txn.getCreditAccount());
      }
      return getDelegate().remove_(x, obj);
      `
    }
  ]
})
