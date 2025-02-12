foam.CLASS({
  package: 'hughes.ledger',
  name: 'AccountTableViewDAO',
  extends: 'foam.dao.ProxyDAO',

  documentation: 'Manipulates account balance',

  javaImports: [
    'foam.lang.Detachable',
    'foam.lang.FObject',
    'foam.lang.X',
    'foam.dao.AbstractSink',
    'foam.dao.DAO',
    'foam.dao.ProxySink',
    'foam.core.logger.Loggers'
  ],

  javaCode: `
  public AccountTableViewDAO(X x, DAO delegate) {
    setX(x);
    setDelegate(delegate);
  }
  `,

  methods: [
    {
      name: 'find_',
      javaCode: `
      Account account = (Account) getDelegate().find_(x, id);
      if ( account != null ) {
        account = (Account) account.fclone();
        account.setBalance(account.findBalance(x));
        account.setTotal(account.findTotal(x));
      }
      return account;
      `
    },
    {
      name: 'select_',
      javaCode: `
        if (sink != null) {
          ProxySink refinedSink = new ProxySink(x, sink) {
            @Override
            public void put(Object obj, foam.lang.Detachable sub) {
              Account account = (Account) ((FObject)obj).fclone();
              account.setBalance(account.findBalance(x));
              account.setTotal(account.findTotal(x));
              super.put(account, sub);
            }
          };
          return ((ProxySink) super.select_(x, refinedSink, skip, limit, order, predicate)).getDelegate();
        }
        return super.select_(x, sink, skip, limit, order, predicate);
      `
    }
  ]
})
