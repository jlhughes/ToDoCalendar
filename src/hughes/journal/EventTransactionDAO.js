foam.CLASS({
  package: 'hughes.journal',
  name: 'EventTransactionDAO',
  extends: 'foam.dao.ProxyDAO',

  documentation: 'Create Transaction from Event',

  javaImports: [
    'foam.dao.DAO',
    'foam.nanos.cron.Schedule',
    'foam.util.SafetyUtil',
    'hughes.ledger.Transaction'
  ],

  methods: [
    {
      name: 'put_',
      javaCode: `
      // Event old = (Event) getDelegate().find_(x, obj);
      Event event = (Event) obj;
      Transaction txn = event.getTransaction();
      if ( txn != null && SafetyUtil.isEmpty(txn.getId()) ) {
        Schedule schedule = event.getWhen();
        java.util.Date date = schedule.getNextScheduledTime(x, null);
        if ( date != null &&
             date.getTime() <= System.currentTimeMillis() ) {
          txn = (Transaction) ((DAO) x.get("transactionDAO")).put_(x, txn);
          // event.setTransactionId(txn.getId());
          event.setTransaction(txn);
        }
      }
      return getDelegate().put_(x, event);
      `
    },
    {
      name: 'remove_',
      javaCode: `
      Event event = (Event) obj;
      Transaction txn = (Transaction) ((DAO) x.get("transactionDAO")).find_(x, event.getTransaction());
      if ( txn != null ) {
        ((DAO) x.get("transactionDAO")).remove_(x, txn);
      }
      return getDelegate().remove_(x, obj);
      `
    }
  ]
})
