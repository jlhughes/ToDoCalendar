foam.CLASS({
  package: 'hughes.ledger',
  name: 'Transaction',

  documentation: `
Transactions rebuild account balance on replay.
`,

  // TODO:
  // memo - build from event - summary
  // attachments - act like expense input, or add event
  // reconciliation? or on event?

  implements: [
    'foam.nanos.auth.CreatedAware',
    'foam.nanos.auth.CreatedByAware'
  ],

  imports: [
    'accountDAO',
    'currencyDAO'
  ],

  tableColumns: [
    'id',
    'debitAccount',
    'creditAccount',
    'total',
    'created'
  ],

  searchColumns: [
    'id',
    'debitAccount',
    'creditAccount',
    'total',
    'created'
  ],

  properties: [
    {
      name: 'id',
      class: 'String',
      createVisibility: 'HIDDEN',
      updateVisibility: function(id) {
        if ( ! id ) {
          return foam.u2.DisplayMode.HIDDEN;
        }
        return foam.u2.DisplayMode.RO;
      },
      readVisibility: function(id) {
        if ( ! id ) {
          return foam.u2.DisplayMode.HIDDEN;
        }
        return foam.u2.DisplayMode.RO;
      }
    },
    {
      name: 'debitAccount',
      class: 'Reference',
      of: 'hughes.ledger.Account',
      label: 'Debit',
      createVisibility: 'RW',
      updateVisibility: function(id) {
        if ( ! id ) {
          return foam.u2.DisplayMode.RW;
        }
        return foam.u2.DisplayMode.RO;
      },
      readVisibility: function() {
        return foam.u2.DisplayMode.RO;
      },
      tableCellFormatter: function(val, obj) {
        var self = this;
        obj.accountDAO.find(obj.debitAccount).then(function(a) {
          self.add(a.toSummary());
        });
      },
      gridColumns: 3
    },
    {
      // TODO: need input fields to select user, then select accounts of user
      name: 'creditAccount',
      class: 'Reference',
      of: 'hughes.ledger.Account',
      label: 'Credit',
      createVisibility: 'RW',
      updateVisibility: function(id) {
        if ( ! id ) {
          return foam.u2.DisplayMode.RW;
        }
        return foam.u2.DisplayMode.RO;
      },
      readVisibility: function() {
        return foam.u2.DisplayMode.RO;
      },
      tableCellFormatter: function(val, obj) {
        var self = this;
        obj.accountDAO.find(obj.creditAccount).then(function(a) {
          self.add(a.toSummary());
        });
      },
      gridColumns: 3
    },
    {
      name: 'amount',
      class: 'UnitValue',
      unitPropName: 'denomination',
      min: 0,
      // validation - ! zero,
      createVisibility: function(debitAccount) {
        if ( debitAccount ) {
          return foam.u2.DisplayMode.RW;
        }
        return foam.u2.DisplayMode.HIDDEN;
      },
      updateVisibility: function(id, debitAccount) {
        if ( id ) {
          return foam.u2.DisplayMode.RO;
        }
        if ( debitAccount ) {
          return foam.u2.DisplayMode.RW;
        }
        return foam.u2.DisplayMode.HIDDEN;
      },
      readVisibility: function(debitAccount) {
        if ( debitAccount ) {
          return foam.u2.DisplayMode.RO;
        }
        return foam.u2.DisplayMode.HIDDEN;
      },
      tableCellFormatter: function(value, obj) {
        var self = this;
        obj.accountDAO.find(obj.debitAccount).then(function(a) {
          obj.currencyDAO.find(a.currency).then(function(c) {
            if ( c ) {
              self.add(c.format(value));
            } else {
              self.add(value);
            }
          });
        });
      },
      gridColumns: 2,
      unitPropValueToString: async function(x, val) {
        let a = await this.accountDAO.find(this.debitAccount);
        let c = await this.currencyDAO.find(a.currency);
        return c.format(val);
      }
    },
    {
      name: 'tax',
      class: 'UnitValue',
      unitPropName: 'denomination',
      min: 0,
      createVisibility: function(amount) {
        if ( amount ) {
          return foam.u2.DisplayMode.RW;
        }
        return foam.u2.DisplayMode.HIDDEN;
      },
      updateVisibility: function(id, amount) {
        if ( id ) {
          return foam.u2.DisplayMode.RO;
        }
        if ( amount ) {
          return foam.u2.DisplayMode.RW;
        }
        return foam.u2.DisplayMode.HIDDEN;
      },
      readVisibility: function(tax) {
        if ( tax ) {
          return foam.u2.DisplayMode.RO;
        }
        return foam.u2.DisplayMode.HIDDEN;
      },
      tableCellFormatter: function(value, obj) {
        var self = this;
        obj.accountDAO.find(obj.debitAccount).then(function(a) {
          obj.currencyDAO.find(a.currency).then(function(c) {
            if ( c ) {
              self.add(c.format(value));
            } else {
              self.add(value);
            }
          });
        });
      },
      gridColumns: 2,
      unitPropValueToString: async function(x, val) {
        let a = await this.accountDAO.find(this.debitAccount);
        let c = await this.currencyDAO.find(a.currency);
        return c.format(val);
      }
    },
    {
      name: 'total',
      class: 'UnitValue',
      unitPropName: 'denomination',
      storageTransient: true,
      expression: function(amount, tax) {
        return amount + tax;
      },
      javaGetter: 'return this.getAmount() + this.getTax();',
      createVisibility: function(tax) {
        if ( tax ) {
          return foam.u2.DisplayMode.RO;
        }
        return foam.u2.DisplayMode.HIDDEN;
      },
      updateVisibility: function(tax) {
        if ( tax ) {
          return foam.u2.DisplayMode.RO;
        }
        return foam.u2.DisplayMode.HIDDEN;
      },
      readVisibility: function(tax) {
        if ( tax ) {
          return foam.u2.DisplayMode.RO;
        }
        return foam.u2.DisplayMode.HIDDEN;
      },
      tableCellFormatter: function(value, obj) {
        var self = this;
        obj.accountDAO.find(obj.debitAccount).then(function(a) {
          obj.currencyDAO.find(a.currency).then(function(c) {
            if ( c ) {
              self.add(c.format(value));
            } else {
              self.add(value);
            }
          });
        });
      },
      gridColumns: 2,
      unitPropValueToString: async function(x, val) {
        let a = await this.accountDAO.find(this.debitAccount);
        let c = await this.currencyDAO.find(a.currency);
        return c.format(val);
      }
    },
    {
      name: 'denomination',
      class: 'String',
      visibility: 'HIDDEN',
      transient: true,
      // factory: async function(x, val) {
      //   if ( this.debitAccount ) {
      //     let a = await this.accountDAO.find(this.debitAccount);
      //     let c = await this.currencyDAO.find(a.currency);
      //     return c.format(this.)

      //   }
      // },
      // javaFactory: 'return "CAD";'
    },
    {
      name: 'created',
      createVisibility: 'HIDDEN',
      updateVisibility: function(id) {
        if ( ! id ) {
          return foam.u2.DisplayMode.HIDDEN;
        }
        return foam.u2.DisplayMode.RO;
      },
      readVisibility: function(id) {
        if ( ! id ) {
          return foam.u2.DisplayMode.HIDDEN;
        }
        return foam.u2.DisplayMode.RO;
      }
    },
    {
      name: 'createdBy',
      createVisibility: 'HIDDEN',
      updateVisibility: function(id) {
        if ( ! id ) {
          return foam.u2.DisplayMode.HIDDEN;
        }
        return foam.u2.DisplayMode.RO;
      },
      readVisibility: function(id) {
        if ( ! id ) {
          return foam.u2.DisplayMode.HIDDEN;
        }
        return foam.u2.DisplayMode.RO;
      }
    },
    {
      name: 'createdByAgent',
      visibility: 'HIDDEN'
    }
  ],

  methods: [
    {
      name: 'toSummary',
      type: 'String',
      code: async function() {
        var debitAccount = await this.debitAccount$find;
        var debtor = await debitAccount.owner$find;
        var creditAccount = await this.creditAccount$find;
        var creditor = await creditAccount.owner$find;
        var currency = await debitAccount.currency$find;
        return debtor.firstName + " -> " + this.creditor.firstName + " " + (currency ? currency.format(this.amount) : this.amount);
      }
    }
  ],

  // actions: [
  //   {
  //     name: 'viewEvent',
  //     code: async function(X) {
  //       var dao = X.eventDAO.where(
  //         this.OR(
  //           this.EQ(this.Transaction.DEBIT_ACCOUNT, X.data.id),
  //           this.EQ(this.Transaction.CREDIT_ACCOUNT, X.data.id)
  //         )
  //       );
  //       X.stack.push(this.StackBlock.create({
  //         view: {
  //           class: 'foam.comics.v2.DAOBrowseControllerView',
  //           data: dao,
  //           config: {
  //             class: 'foam.comics.v2.DAOControllerConfig',
  //             dao: dao,
  //             createPredicate: foam.mlang.predicate.False,
  //             editPredicate: foam.mlang.predicate.False,
  //             deletePredicate: foam.mlang.predicate.False,
  //             browseTitle: `${this.toSummary()} Event`
  //           }
  //         }
  //       }));
  //     }
  //   }
  // ]
});
