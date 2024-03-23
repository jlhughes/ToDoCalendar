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
    'amount',
    'created'
  ],

  searchColumns: [
    'id',
    'debitAccount',
    'creditAccount',
    'amount',
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
      gridColumns: 2
    },
    {
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
      gridColumns: 2
    },
    {
      name: 'amount',
      class: 'Long',
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
      gridColumns: 1
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
  ]
});
