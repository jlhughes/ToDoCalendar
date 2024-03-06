foam.CLASS({
  package: 'hughes.account',
  name: 'Account',

  implements: [
    'foam.nanos.auth.CreatedAware',
    'foam.nanos.auth.CreatedByAware',
    'foam.nanos.auth.LastModifiedAware',
    'foam.nanos.auth.LastModifiedByAware'
  ],

  imports: [
    'balanceDAO',
    'currencyDAO?'
  ],

  javaImports: [
    'foam.core.X',
    'foam.dao.DAO',
    'foam.nanos.logger.Loggers',
    'hughes.ledger.Direction'
  ],

  searchColumns: [
    'id',
    'name',
    'code',
    'currency'
  ],

  tableColumns: [
    'name',
    'description',
    'code',
    'balance'
  ],

  properties: [
    {
      name: 'id',
      class: 'String',
      createVisibility: 'HIDDEN',
      updateVisibility: 'RO'
    },
    {
      name: 'name',
      class: 'String'
    },
    {
      name: 'description',
      class: 'String'
    },
    {
      name: 'code',
      class: 'Reference',
      of: 'hughes.ledger.AccountCode',
      // TODO: support changing category - this will affect balance
      updateVisibility: 'RO',
    },
    {
      name: 'owner',
      class: 'Reference',
      of: 'foam.nanos.auth.User'
    },
    {
      name: 'currency',
      class: 'Reference',
      of: 'foam.core.Unit',
      targetDAOKey: 'currencyDAO',
      value: 'CAD',
      // visibility: 'HIDDEN'
    },
    {
      class: 'UnitValue',
      unitPropName: 'currency',
      name: 'balance',
      createVisibility: 'HIDDEN',
      updateVisibility: 'RO',
      javaGetter: `
        return (Long) findBalance(foam.core.XLocator.get());
      `,
      storageTransient: true
    }
  ],
  methods: [
    {
      name: 'toSummary',
      type: 'String',
      code: function() {
        return this.name + " ("+this.id+")";
      }
    },
    {
      name: 'findBalance',
      type: 'Long',
      async: true,
      args: 'X x',
      code: async function(x) {
        var bal = await x.balanceDAO?.find(this.id);
        if ( bal != null )
          return bal.balance;
        return 0;
      },
      javaCode: `
        try {
          Balance bal = (Balance) ((DAO) x.get("balanceDAO")).find(getId());
          if ( bal != null )
            return bal.getBalance();
        } catch(Throwable t) {
          Loggers.logger(getX(), this).warning(t);
        }
        return 0L;
      `
    },
    {
      name: 'updateBalance',
      synchronized: true,
      args: 'X x, long amount, Direction direction',
      type: 'Long',
      javaCode: `
        DAO balanceDAO = (DAO) x.get("balanceDAO");
        Balance bal = (Balance) balanceDAO.find(getId());
        if ( bal == null ) {
          bal = new Balance();
          bal.setId(getId());
        } else {
          bal = (Balance) bal.fclone();
        }
        bal.setBalance(bal.getBalance() + amount * direction.getMultiplier());
        bal = (Balance) ((DAO) x.get("balanceDAO")).put_(x, bal);
        return bal.getBalance();
      `
    }
  ]
})
