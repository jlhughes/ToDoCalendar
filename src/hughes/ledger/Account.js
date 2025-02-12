foam.CLASS({
  package: 'hughes.ledger',
  name: 'Account',

  implements: [
    'foam.mlang.Expressions',
    'foam.core.auth.CreatedAware',
    'foam.core.auth.CreatedByAware',
    'foam.core.auth.LastModifiedAware',
    'foam.core.auth.LastModifiedByAware'
  ],

  imports: [
    'auth',
    'balanceDAO',
    'currencyDAO?',
    'stack?',
    'transactionDAO',
    'userDAO'
  ],

  requires: [
    'hughes.ledger.Transaction',
    'foam.u2.stack.StackBlock',
  ],

  javaImports: [
    'foam.lang.X',
    'foam.dao.DAO',
    'static foam.mlang.MLang.EQ',
    'foam.core.logger.Loggers',
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
      of: 'foam.core.auth.User',
      required: true,
      view: function(_, X) {
        return {
          class: 'foam.u2.view.RichChoiceView',
          search: true,
          sections: [
            {
              heading: 'Users',
              dao: X.userDAO
            }
          ]
        };
      },
      tableCellFormatter: function(value, obj, axiom) {
        this.__subSubContext__.userDAO
          .find(value)
          .then((user) => this.add(user.toSummary()))
          .catch((error) => {
            this.add(value);
          });
      }
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
      // javaGetter: `
      //   return findBalance(foam.lang.XLocator.get());
      // `,
      storageTransient: true,
    },
    {
      class: 'UnitValue',
      unitPropName: 'currency',
      name: 'total',
      createVisibility: 'HIDDEN',
      updateVisibility: 'RO',
      // // TODO: don't clone or freeze
      // javaGetter: `
      //   return findTotal(foam.lang.XLocator.get());
      // `,
      storageTransient: true
    },
    {
      name: 'currency',
      class: 'Reference',
      of: 'foam.lang.Unit',
      targetDAOKey: 'currencyDAO',
      value: 'CAD',
      createVisibility: 'RW',
      updateVisibility: 'RW',
      readVisibility: 'HIDDEN'
    },
    {
      name: 'summary',
      class: 'String',
      visibility: 'HIDDEN',
      storageTransient: true,
      javaGetter: `
      StringBuilder sb = new StringBuilder();
      sb.append(getName());
       if ( ! SafetyUtil.isEmpty(getNumber()) ) {
        sb.append(" - ");
        sb.append(mask(getNumber()));
      }
      foam.core.auth.User user = findOwner(foam.lang.XLocator.get());
      if ( user != null ) {
        sb.append(" - ");
        sb.append(user.toSummary());
      }
      return sb.toString();
      `
    },
    {
      name: 'createdByAgent',
      visibility: 'HIDDEN'
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
      foam.core.auth.User user = findOwner(foam.lang.XLocator.get());
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
  ],

  actions: [
    {
      name: 'transactions',
      isAvailable: async function() {
        return this.id &&
          await this.auth.check(null, 'transaction.read.*');
      },
      code: async function(X) {
        // if ( X.memento ) {
        //   X = X.createSubContext({memento: X.memento.tail});
        // }
        var dao = X.transactionDAO.where(
          this.OR(
            this.EQ(this.Transaction.DEBIT_ACCOUNT, X.data.id),
            this.EQ(this.Transaction.CREDIT_ACCOUNT, X.data.id)
          )
        );
        var browseTitle = await X.data.toSummary();
        X.stack.push(
          this.StackBlock.create({
            parent: X,
            view: {
              class: 'foam.comics.v2.DAOBrowseControllerView',
              data: dao,
              config: {
                class: 'foam.comics.v2.DAOControllerConfig',
                dao: dao,
                createPredicate: foam.mlang.predicate.False.create(),
                editPredicate: foam.mlang.predicate.False.create(),
                deletePredicate: foam.mlang.predicate.False.create(),
                browseTitle: `${browseTitle} - Transactions`
              }
            }
          })
        );
      }
    }
  ]
})
