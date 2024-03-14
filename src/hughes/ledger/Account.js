foam.CLASS({
  package: 'hughes.ledger',
  name: 'Account',

  implements: [
    'foam.nanos.auth.CreatedAware',
    'foam.nanos.auth.CreatedByAware',
    'foam.nanos.auth.LastModifiedAware',
    'foam.nanos.auth.LastModifiedByAware'
  ],

  imports: [
    'balanceDAO',
    'currencyDAO?',
    'userDAO'
  ],

  javaImports: [
    'foam.core.X',
    'foam.dao.DAO',
    'static foam.mlang.MLang.EQ',
    'foam.nanos.logger.Loggers',
    'foam.util.SafetyUtil',
    'hughes.ledger.Direction'
  ],

  searchColumns: [
    'id',
    'owner',
    'name',
    'code',
    'number',
    'currency'
  ],

  tableColumns: [
    'owner',
    'name',
    'code',
    'number',
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
      class: 'String',
      factory: function() { return this.code; },
      javaFactory: 'return getCode();',
      createVisibility: 'HIDDEN',
      updateVisibility: 'RW'
    },
    {
      name: 'owner',
      class: 'Reference',
      of: 'foam.nanos.auth.User',
      required: true,
      tableCellFormatter: function(value, obj) {
        var self = this;
        obj.userDAO.find(value).then(function(u) {
          self.add(u.toSummary());
        });
      },
    },
    {
      name: 'code',
      class: 'Reference',
      of: 'hughes.ledger.AccountCode',
      value: 'Cash',
      // TODO: support changing category - this will affect balance
      // updateVisibility: 'RO',
    },
    {
      name: 'number',
      class: 'String'
    },
    {
      class: 'UnitValue',
      unitPropName: 'currency',
      name: 'balance',
      createVisibility: 'HIDDEN',
      updateVisibility: 'RO',
      javaGetter: `
        return findBalance(getX());
      `,
      storageTransient: true,
    },
    {
      class: 'UnitValue',
      unitPropName: 'currency',
      name: 'total',
      createVisibility: 'HIDDEN',
      updateVisibility: 'RO',
      // TODO: don't clone or freeze
      javaGetter: `
        return findTotal(getX());
      `,
      storageTransient: true
    },
    {
      name: 'currency',
      class: 'Reference',
      of: 'foam.core.Unit',
      targetDAOKey: 'currencyDAO',
      value: 'CAD',
      createVisibility: 'RW',
      updateVisibility: 'RW',
      readVisibility: 'HIDDEN'
    }
  ],

  static: [
    {
      name: 'mask',
      documentation: 'Mask out part of the number',
      code: function(str) {
        return str ? `***${str.substring(str.length - 3)}` : '';
      },
      type: 'String',
      args: 'String str',
      javaCode: `
        return str == null ? "" : "***" + str.substring(str.length() - Math.min(str.length(), 3));
      `
    }
  ],

  methods: [
    {
      name: 'toSummary',
      type: 'String',
      code: async function() {
        var summary = this.name;
        if ( this.number ) {
          summary += " - " + this.mask(this.number);
        }
        var user = await this.owner$find;
        if ( user ) {
          summary += " - " + user.toSummary();
        }
        return summary;
      },
      javaCode: `
      StringBuilder sb = new StringBuilder();
      sb.append(getName());
       if ( ! SafetyUtil.isEmpty(getNumber()) ) {
        sb.append(" - ");
        sb.append(mask(getNumber()));
      }
      foam.nanos.auth.User user = findOwner(getX());
      if ( user != null ) {
        sb.append(" - ");
        sb.append(user.toSummary());
      }
      return sb.toString();
      `
    },
    {
      name: 'findBalance',
      type: 'Long',
      args: 'X x',
      // code: async function(x) {
      //   var bal = await x.balanceDAO?.find(this.id);
      //   if ( bal != null )
      //     return bal.balance;
      //   return 0;
      // },
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
      name: 'findTotal',
      type: 'Long',
      args: 'X x',
      javaCode: `
        AccountBalanceSink sink = new AccountBalanceSink(x);
        ((DAO) x.get("accountDAO")).where(EQ(Account.ID, getId())).select(sink);
        return sink.getTotal();
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
