foam.CLASS({
  package: 'hughes.ledger',
  name: 'Transaction',

  // Transaction (s) will rebuild account balance.
  // owner, account, category, amount, created
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
    'account',
    'amount',
    'direction'
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
      name: 'account',
      class: 'Reference',
      of: 'hughes.account.Account',
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
      gridColumns: 2
    },
    {
      name: 'amount',
      class: 'Long',
      // validation - ! zero,
      createVisibility: function(account) {
        if ( account ) {
          return foam.u2.DisplayMode.RW;
        }
        return foam.u2.DisplayMode.HIDDEN;
      },
      updateVisibility: function(id, account) {
        if ( id ) {
          return foam.u2.DisplayMode.RO;
        }
        if ( account ) {
          return foam.u2.DisplayMode.RW;
        }
        return foam.u2.DisplayMode.HIDDEN;
      },
      readVisibility: function(account) {
        if ( account ) {
          return foam.u2.DisplayMode.RO;
        }
        return foam.u2.DisplayMode.HIDDEN;
      },
      tableCellFormatter: function(value, obj) {
        var self = this;
        obj.accountDAO.find(obj.account).then(function(a) {
          obj.currencyDAO.find(a.currency).then(function(c) {
            if ( c ) {
              self.add(c.format(value));
            } else {
              self.add(value);
            }
          });
        });
      },
      gridColumns: 2
    },
    {
      name: 'direction',
      class: 'Enum',
      of: 'hughes.ledger.Direction',
      value: 'CREDIT',
      createVisibility: function(account) {
        if ( account ) {
          return foam.u2.DisplayMode.RW;
        }
        return foam.u2.DisplayMode.HIDDEN;
      },
      updateVisibility: function(id, account) {
        if ( id ) {
          return foam.u2.DisplayMode.RO;
        }
        if ( account ) {
          return foam.u2.DisplayMode.RW;
        }
        return foam.u2.DisplayMode.HIDDEN;
      },
      readVisibility: function(account) {
        if ( account ) {
          return foam.u2.DisplayMode.RO;
        }
        return foam.u2.DisplayMode.HIDDEN;
      },
      gridColumns: 2
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
      code: function() {
        return this.account + " " + this.amount + " " + this.direction;
      }
    }
  ]
});
