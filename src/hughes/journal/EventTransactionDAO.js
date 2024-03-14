foam.CLASS({
  package: 'hughes.journal',
  name: 'EventTransactionDAO',
  extends: 'foam.dao.ProxyDAO',

  documentation: 'Create Transaction from Event',

  javaImports: [
    'foam.dao.DAO',
    'foam.nanos.cron.Schedule',
    'foam.util.SafetyUtil',
    'hughes.ledger.Transaction',
    'java.util.ArrayList',
    'java.util.List'
  ],

  methods: [
    {
      name: 'put_',
      javaCode: `
      // Event old = (Event) getDelegate().find_(x, obj);
      Event event = (Event) obj;
      Transaction[] txns = event.getTransactions();
      if ( txns != null ) {
        for ( Transaction txn : txns ) {
          if ( ! SafetyUtil.isEmpty(txn.getId()) )
            continue;

          // Schedule schedule = event.getWhen();
          // java.util.Date date = schedule.getNextScheduledTime(x, null);
          // if ( date != null &&
          //      date.getTime() <= System.currentTimeMillis() ) {
            Transaction nu = (Transaction) ((DAO) x.get("transactionDAO")).put_(x, txn);
            txn.copyFrom(nu);
          // }
        }
      }
      return getDelegate().put_(x, event);
      `
    },
    {
      name: 'remove_',
      javaCode: `
      Event event = (Event) obj;
      // Transaction txn = (Transaction) ((DAO) x.get("transactionDAO")).find_(x, event.getTransaction());
      // if ( txn != null ) {
      //   txn = (Transaction) event.getTransactions(x).remove_(x, txn);
      //   // ((DAO) x.get("transactionDAO")).remove_(x, txn);
      // }
      return getDelegate().remove_(x, obj);
      `
    }
  ]
})
